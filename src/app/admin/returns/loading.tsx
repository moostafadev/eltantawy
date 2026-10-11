import { Table } from "@/components/table";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const ReturnsLoading = () => (
  <AdminListPageLoading titleWidth={100} descriptionWidth={260}>
    <Table data={[]} columns={returnsTableColumns} loading loadingRows={8} />
  </AdminListPageLoading>
);

export default ReturnsLoading;
