import { Table } from "@/components/table";

import { usersTableColumns } from "./UsersTableColumns";
import { getUsersPage } from "./user.service";

const UsersTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getUsersPage(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={usersTableColumns}
      emptyMessage="لا يوجد مستخدمين"
      pagination={{ ...pagination, basePath: "/admin/users" }}
      sorting={sorting}
    />
  );
};

export default UsersTable;
