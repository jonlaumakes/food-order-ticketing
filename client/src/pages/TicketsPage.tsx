import React, { ChangeEvent, useEffect, useState } from "react";
import io from "socket.io-client";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Order } from "../domain/types/Order.ts";
import OrderRow from "../components/OrderRow.tsx";
import { formatCurrency, getCents } from "../util/currency.ts";
import { filterOrdersByPrice, mergeOrders } from "../util/orders.ts";

import "./TicketsPage.css";

type Column = {
  id: string;
  label: string;
};

type State = {
  priceFilter: number;
  priceInputVal: string;
  orders: Order[];
  filteredOrders: Order[];
};

const initialState: State = {
  priceFilter: 0,
  priceInputVal: "",
  orders: [],
  filteredOrders: [],
};

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

interface Props extends React.HTMLAttributes<HTMLElement> {}

const TicketsPage: React.FC<Props> = () => {
  const [orders, setOrders] = useState(initialState.orders);
  const [filteredOrders, setFilteredOrders] = useState(
    initialState.filteredOrders
  );
  const [priceFilter, setPriceFilter] = useState(initialState.priceFilter);
  const [priceInputVal, setPriceInputVal] = useState(
    initialState.priceInputVal
  );

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Socket connected to server");
    });

    socket.on("order_event", (newOrders: Order[]) => {
      handleNewOrders(newOrders);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("price filter updated", priceFilter);
    if (priceFilter > 0) {
      const ordersFilteredByPrice = filterOrdersByPrice(
        orders,
        priceFilter,
        500
      );
      setFilteredOrders(ordersFilteredByPrice);
    } else {
      setFilteredOrders([]);
    }
  }, [priceFilter]);

  const handleNewOrders = (newOrders: Order[]) => {
    console.log("handle new orders - new orders", newOrders);
    // set new orders to all orders
    setOrders((prevAllOrders) => {
      return mergeOrders(newOrders, prevAllOrders);
    });

    // update filtered orders
    setPriceFilter((prevPriceFilter) => {
      if (prevPriceFilter > 0) {
        const filteredNewOrders = filterOrdersByPrice(
          newOrders,
          prevPriceFilter,
          500
        );
        console.log("filteredNewOrders", prevPriceFilter, filteredOrders);
        setFilteredOrders((prevFilteredOrders) => {
          console.log(
            "merged filter orders",
            mergeOrders(filteredNewOrders, prevFilteredOrders)
          );
          return mergeOrders(filteredNewOrders, prevFilteredOrders);
        });
      }
      return prevPriceFilter;
    });
  };

  const handlePriceInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputVal = e.target.value;
    const formattedInput = formatCurrency(inputVal);
    setPriceInputVal(formattedInput);

    const cents = getCents(inputVal);
    setPriceFilter(cents);
  };

  return (
    <>
      <div className="container">
        <Header title="CSS Ticketing" />
        <main className="content">
          <input
            type="text"
            onChange={handlePriceInputChange}
            value={priceInputVal}
            placeholder="Search by Price"
          />
          <div className="table-container">
            <table id="order-table">
              <thead>
                <tr>
                  {tableHeaders.map((col: Column) => {
                    return <th key={col.id}>{col.label}</th>;
                  })}
                </tr>
              </thead>
              {/* <div className="table-body-container"> */}
              <tbody>
                {filteredOrders.length > 0
                  ? filteredOrders.map((order) => {
                      return <OrderRow key={order.id} order={order} />;
                    })
                  : orders.map((order) => {
                      return <OrderRow key={order.id} order={order} />;
                    })}
              </tbody>
              {/* </div> */}
            </table>
          </div>
        </main>
        <div className="footer">
          <Footer title="Cloud Store Solutions 2024" />
        </div>
      </div>
    </>
  );
};

export default TicketsPage;
