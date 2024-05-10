import { Order } from "../domain/types/Order";

export const filterOrdersByPrice = (
  orders: Order[],
  filterPrice: number
): Order[] => {
  return orders.filter((order) => {
    const range = 2500;
    const lowerBound = filterPrice - range;
    const upperBound = filterPrice + range;
    console.log(
      order.price,
      "fits bounds",
      order.price > lowerBound && order.price < upperBound
    );

    return order.price > lowerBound && order.price < upperBound;
  });
};

export const mergeOrders = (
  newOrders: Order[],
  prevOrders: Order[]
): Order[] => {
  const combined = [...newOrders, ...prevOrders];
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
  return mergedOrders;
};
