import { Table } from "@/components/table";
import { usersTableColumns } from "@/features/admin/users/table/UsersTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const UsersLoading = () => (
  <AdminListPageLoading titleWidth={120} descriptionWidth={190}>
    <Table data={[]} columns={usersTableColumns} loading loadingRows={8} />
  </AdminListPageLoading>
);

export default UsersLoading;
