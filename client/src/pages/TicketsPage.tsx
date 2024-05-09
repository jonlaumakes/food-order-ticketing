import React, { ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Order } from "../domain/types/Order.ts";
import OrderRow from "../components/OrderRow.tsx";

import "./TicketsPage.css";

type Column = {
  id: string;
  label: string;
};

type State = {
  orders: Order[];
  priceFilter?: number;
};

const initialState: State = {
  orders: [],
};

interface Props extends React.HTMLAttributes<HTMLElement> {}

const TicketsPage: React.FC<Props> = () => {
  const [orders, setOrders] = useState(initialState.orders);
  const [priceFilter, setPriceFilter] = useState(initialState.priceFilter);
  // todo: memoize column headers?
  const tableHeaders: Column[] = [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "event_name",
      label: "Event name",
    },
    {
      id: "price",
      label: "Price",
    },
    {
      id: "item",
      label: "Item",
    },
    {
      id: "customer",
      label: "Customer",
    },
    {
      id: "destination",
      label: "Destination",
    },
  ];

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Socket connected to server");
    });

    socket.on("order_event", (data: Order[]) => {
      setOrders((prevOrders) => {
        console.log("new order count", data.length);
        console.log("prev orders", prevOrders.length);
        const combined = [...data, ...prevOrders];
        console.log("combined orders", combined.length);
        const orderMap = new Map<string, Order>();

        const mergedOrders: Order[] = combined.reduce(
          (acc: Order[], order: Order) => {
            // if valid orderId (not repeated)
            if (!orderMap.get(order.id)) {
              // add to accumulator
              acc.push(order);
              // update map
              orderMap.set(order.id, order);
            }
            return acc;
          },
          []
        );
        console.log("merged orders", mergedOrders);
        return mergedOrders;
      });
    });

    // cleanup when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // TODO 2: Search based on price
  const handlePriceInputChange = () => {};

  return (
    <>
      <div className="container">
        <Header title="CSS Ticketing" />
        <main className="content">
          <input
            type="text"
            onChange={handlePriceInputChange}
            value={priceFilter}
          />
          <table id="order-table">
            <thead>
              <tr>
                {tableHeaders.map((col: Column) => {
                  return <th key={col.id}>{col.label}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return <OrderRow key={order.id} order={order} />;
              })}
            </tbody>
          </table>
        </main>
        <div className="footer">
          <Footer title="Cloud Store Solutions 2024" />
        </div>
      </div>
    </>
  );
};

export default TicketsPage;
