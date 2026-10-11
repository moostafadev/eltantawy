import { Table } from "@/components/table";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const OrdersLoading = () => (
  <AdminListPageLoading titleWidth={90} descriptionWidth={250}>
    <Table data={[]} columns={ordersTableColumns} loading loadingRows={8} />
  </AdminListPageLoading>
);

export default OrdersLoading;
