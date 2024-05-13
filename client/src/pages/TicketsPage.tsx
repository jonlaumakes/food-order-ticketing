import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { Order } from "../domain/types/Order.ts";
import OrderRow from "../components/OrderRow.tsx";
import { formatCurrency, getCents } from "../util/currency.ts";
import { filterOrdersByPrice } from "../util/orders.ts";
import { PriceRangeFilter } from "../domain/types/PriceRangeFilter.ts";

import "./TicketsPage.css";

type Column = {
  id: string;
  label: string;
};

type State = {
  priceFilter: number;
  priceFilterRange: number;
  priceInputVal: string;
  orders: Order[];
  filteredOrders: Order[];
};

const initialState: State = {
  priceFilter: 0,
  priceFilterRange: 200,
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

const priceFiltersOptions: PriceRangeFilter[] = [
  {
    label: "Exact match",
    value: 0,
  },
  {
    label: "$1.00",
    value: 100,
  },
  {
    label: "$2.00",
    value: 200,
  },
  {
    label: "$5.00",
    value: 500,
  },
  {
    label: "$10.00",
    value: 1000,
  },
];

interface Props extends React.HTMLAttributes<HTMLElement> {
  allOrders: Order[];
}

const TicketsPage: React.FC<Props> = ({ allOrders = [] }) => {
  const [filteredOrders, setFilteredOrders] = useState(
    initialState.filteredOrders
  );
  const [priceFilter, setPriceFilter] = useState(initialState.priceFilter);
  const [priceFilterRange, setPriceFilterRange] = useState(
    initialState.priceFilterRange
  );
  const [priceInputVal, setPriceInputVal] = useState(
    initialState.priceInputVal
  );

  // when new orders are recieved
  useEffect(() => {
    console.log("all orders updated");
    // update filtered orders
    if (priceFilterRange > 0 || priceFilter > 0) {
      const ordersFilteredByPrice = filterOrdersByPrice(
        allOrders,
        priceFilter,
        priceFilterRange
      );
      setFilteredOrders(ordersFilteredByPrice);
    }
  }, [allOrders]);

  // when user updates filters
  useEffect(() => {
    console.log("price filter updated", priceFilter, priceFilterRange);
    if (priceFilterRange > 0 || priceFilter > 0) {
      const ordersFilteredByPrice = filterOrdersByPrice(
        allOrders,
        priceFilter,
        priceFilterRange
      );
      console.log("filtered orders", ordersFilteredByPrice);
      setFilteredOrders(ordersFilteredByPrice);
    } else if (priceFilterRange === 0 || priceFilter === 0) {
      setFilteredOrders([]);
    }
  }, [priceFilter, priceFilterRange]);

  const handlePriceInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputVal = e.target.value;
    const formattedInput = formatCurrency(inputVal);
    setPriceInputVal(formattedInput);

    const cents = getCents(inputVal);
    setPriceFilter(cents);
  };

  const handlePriceFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("e", e.target.value);
    setPriceFilterRange(Number(e.target.value) || 0);
  };

  const renderNoRecordsMsg = (): ReactNode => {
    if (allOrders.length === 0) {
      return (
        <div className="no-records-container">
          <p>No orders found in price range</p>
        </div>
      );
    }
    if (
      filteredOrders.length === 0 &&
      priceFilterRange > 0 &&
      priceFilter > 0
    ) {
      return (
        <div className="no-records-container">
          <p>No orders found in price range</p>
        </div>
      );
    }
  };

  const renderOrderTable = (): ReactNode => {
    return (
      <div className="table-container">
        <table id="order-table" className="table">
          <thead>
            <tr>
              {tableHeaders.map((col: Column) => {
                return <th key={col.id}>{col.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0
              ? filteredOrders.map((order) => {
                  return <OrderRow key={order.id} order={order} />;
                })
              : allOrders.map((order) => {
                  return <OrderRow key={order.id} order={order} />;
                })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="container">
        <Header title="CSS Ticketing" />
        <main className="content">
          <div className="fitlers-container">
            <input
              type="text"
              onChange={handlePriceInputChange}
              value={priceInputVal}
              placeholder="Search by Price"
            />
            <select value={priceFilterRange} onChange={handlePriceFilterChange}>
              {priceFiltersOptions.map((option) => {
                return <option value={option.value}>{option.label}</option>;
              })}
            </select>
            <p className="record-count">
              {`Orders: ${
                priceFilter ? filteredOrders.length : allOrders.length
              }`}
            </p>
          </div>
          {allOrders.length === 0 && filteredOrders.length === 0
            ? renderNoRecordsMsg()
            : renderOrderTable()}
        </main>
        {/* <div className="footer">
          <Footer title="Cloud Store Solutions 2024" />
        </div> */}
      </div>
    </>
  );
};

export default TicketsPage;
