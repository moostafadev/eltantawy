export { default as OrdersTable } from "./Main";
export { default as StatusChanger } from "./StatusChanger";
export {
  getOrders,
  getOneOrder,
  getOrderStatusDistribution,
} from "./orders.service";
export { updateOrderStatusAction } from "./updateOrderStatus.service";
export * from "./types";
