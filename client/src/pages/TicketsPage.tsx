import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Order } from "../domain/types/Order.ts";
import OrderRow from "../components/OrderRow.tsx";
import { formatCurrency, getCents } from "../util/formatCurrency.ts";
import { filterOrdersByPrice, mergeOrders } from "../util/orders.ts";

import "./TicketsPage.css";

type Column = {
  id: string;
  label: string;
};

type State = {
  priceFilter: number;
  PriceInputVal: string;
  orders: Order[];
  filteredOrders: Order[];
};

const initialState: State = {
  priceFilter: 0,
  PriceInputVal: "",
  orders: [],
  filteredOrders: [],
};

interface Props extends React.HTMLAttributes<HTMLElement> {}

const TicketsPage: React.FC<Props> = () => {
  const [orders, setOrders] = useState(initialState.orders);
  const [priceFilter, setPriceFilter] = useState(initialState.priceFilter);
  const [filteredOrders, setFilteredOrders] = useState(
    initialState.filteredOrders
  );
  const [PriceInputVal, setPriceInputVal] = useState(
    initialState.PriceInputVal
  );

  // const debouncedSearchTerm = useDebounce(PriceInputVal, 250);

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
      const ordersFilteredByPrice = orders.filter((order) => {
        const range = 2500;
        const lowerBound = priceFilter - range;
        const upperBound = priceFilter + range;

        return order.price > lowerBound && order.price < upperBound;
      });
      console.log("ordersFiltered by price", ordersFilteredByPrice);
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
          prevPriceFilter
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
    // update the input val
    setPriceInputVal(formattedInput);

    const cents = getCents(inputVal);
    console.log("new price filter", cents);
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
            value={PriceInputVal}
            placeholder="Search by Price"
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
