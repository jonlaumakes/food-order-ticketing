import "./App.css";
import io from "socket.io-client";
import TicketsPage from "./pages/TicketsPage";
import React, { useEffect, useState } from "react";
import { Order } from "./domain/types/Order.ts";
import { mergeOrders } from "./util/orders.ts";

type State = {
  orders: Order[];
};

const initialState: State = {
  orders: [],
};

const App: React.FC = () => {
  const [orders, setOrders] = useState(initialState.orders);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Socket connected to server");
    });

    socket.on("order_event", (newOrders: Order[]) => {
      console.log("app new orders", newOrders);
      setOrders((prevOrders) => {
        return mergeOrders(newOrders, prevOrders);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("app orders", orders);
  }, [orders]);

  return (
    <>
      <TicketsPage allOrders={orders} />
    </>
  );
};

export default App;
