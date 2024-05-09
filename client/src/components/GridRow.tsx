import React from "react";
import { Order } from "../domain/types/Order.ts";

interface OrderRowProps {
  order: Order;
}

const OrderRow: React.FC<OrderRowProps> = React.memo(({ order }) => {
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

export default OrderRow;
