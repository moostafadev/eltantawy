import { Table } from "@/components/table";
import { getOrders } from "./orders.service";
import { ordersTableColumns } from "./OrdersTableColumns";

const OrdersTable = async () => {
  const orders = await getOrders();

  return (
    <Table
      data={orders}
      columns={ordersTableColumns}
      emptyMessage="لا يوجد طلبات"
    />
  );
};

export default OrdersTable;
