import { Order } from "../domain/types/Order";

export const filterOrdersByPrice = (
  orders: Order[],
  filterPrice: number,
  range: number
): Order[] => {
  return orders.filter((order) => {
    const lowerBound = filterPrice - range > 0 ? filterPrice - range : 0;
    const upperBound = filterPrice + range;

    return order.price > lowerBound && order.price < upperBound;
  });
};

export const isOrderInPriceRange =
  (filterPrice: number, range: number) => (order: Order) => {
    const lowerBound = filterPrice - range > 0 ? filterPrice - range : 0;
    const upperBound = filterPrice + range;
    console.log(
      "filter price",
      order.price,
      order.price > lowerBound && order.price < upperBound
    );

    return order.price > lowerBound && order.price < upperBound;
  };

export const mergeOrders = (
  newOrders: Order[],
  prevOrders: Order[]
): Order[] => {
  const combined = [...newOrders, ...prevOrders];
  const orderMap = new Map<string, Order>();

  const mergedOrders: Order[] = combined.reduce(
    (acc: Order[], order: Order) => {
      // remove duplicates
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
