import React from "react";
import { Order } from "../domain/types/Order.ts";
import { convertCentsToDollars } from "../util/currency.ts";

interface OrderRowProps {
  order?: Order;
}

const OrderRow: React.FC<OrderRowProps> = React.memo(({ order }) => {
  if (!order) return null;
  return (
    <tr key={`row-${order.id}`}>
      <td>{order.id}</td>
      <td>{order.event_name}</td>
      <td>{convertCentsToDollars(order.price)}</td>
      <td>{order.item}</td>
      <td>{order.customer}</td>
      <td>{order.destination}</td>
    </tr>
  );
});

export default OrderRow;
