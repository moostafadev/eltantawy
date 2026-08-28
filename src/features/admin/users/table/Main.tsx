import { Table } from "@/components/table";

import { usersTableColumns } from "./UsersTableColumns";
import { getUsers } from "./user.service";

const UsersTable = async () => {
  const users = await getUsers();

  return (
    <Table
      data={users}
      columns={usersTableColumns}
      emptyMessage="لا يوجد مستخدمين"
    />
  );
};

export default UsersTable;
