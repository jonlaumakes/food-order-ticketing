import React, { ReactNode, useState } from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Order } from "../domain/types/Order.ts";
import OrderRow from "../components/GridRow.tsx";

import "./TicketsPage.css";

type Column = {
  id: string;
  label: string;
};

type State = {
  orders: Order[];
};

const initialState: State = {
  orders: [
    {
      id: "123",
      event_name: "PENDING",
      price: 10023,
      item: "Burger",
      customer: "Bob",
      destination: "Beach town",
    },
    {
      id: "124",
      event_name: "IN TRANSIT",
      price: 4023,
      item: "PIZZA  ",
      customer: "PESTO",
      destination: "Beach town",
    },
  ],
};

interface Props extends React.HTMLAttributes<HTMLElement> {}

const TicketsPage: React.FC<Props> = (props) => {
  const [orders, setOrders] = useState(initialState.orders);

  // const handleAddOrders = (order: Orders): void => {
  // [a, b, c, d, e]  where c is an update to existing order
  // const newOrders = [];
  // const updateOrders = [];
  // iterate in reverse
  // if !(orderId in map)
  // newOrders.push(order)
  // if (orderId in map) {
  // updateOrdrs.push(order)
  // Prepend the newOrders
  // setOrders([newOrders, ...orders])
  // iterate through updated orders
  // find the index in the ordersMap
  // orders
  // };

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

  const renderRow = React.memo((order: Order) => {
    console.log("rendering orderId", order.id);
    return (
      <tr key={`row-${order.id}`}>
        <td>{order.id}</td>
        <td>{order.event_name}</td>
        <td>{order.price}</td>
        <td>{order.item}</td>
        <td>{order.customer}</td>
        <td>{order.destination}</td>
      </tr>
    );
  });

  return (
    <>
      <div className="container">
        <Header title="CSS Ticketing" />
        <main className="content">
          <table id="order-table">
            <thead>
              <tr>
                {tableHeaders.map((col: Column) => {
                  return <th key={col.id}>{col.label}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
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
