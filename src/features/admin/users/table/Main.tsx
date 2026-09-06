import { Table } from "@/components/table";

import { usersTableColumns } from "./UsersTableColumns";
import { getUsers, getGuestUsers } from "./user.service";
import { UserRow } from "./types";

const UsersTable = async () => {
  const [users, guests] = await Promise.all([getUsers(), getGuestUsers()]);

  const rows: UserRow[] = [
    ...users.map((user) => ({ kind: "REGISTERED" as const, data: user })),
    ...guests.map((guest) => ({ kind: "GUEST" as const, data: guest })),
  ].sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime(),
  );

  return (
    <Table
      data={rows}
      columns={usersTableColumns}
      emptyMessage="لا يوجد مستخدمين"
    />
  );
};

export default UsersTable;
