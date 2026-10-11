import { Table } from "@/components/table";
import { getOrders } from "./orders.service";
import { ordersTableColumns } from "./OrdersTableColumns";

const OrdersTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getOrders(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={ordersTableColumns}
      emptyMessage="لا يوجد طلبات"
      pagination={{ ...pagination, basePath: "/admin/orders" }}
      sorting={sorting}
    />
  );
};

export default OrdersTable;
