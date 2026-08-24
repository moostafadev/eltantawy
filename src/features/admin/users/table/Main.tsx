"use client";

import { Table } from "@/components/table";
import { IProps } from "./types";
import { usersTableColumns } from "./UsersTableColumns";

const UsersTable = ({ users }: IProps) => {
  return (
    <Table
      data={users}
      columns={usersTableColumns}
      keyExtractor={(user) => user.id}
      emptyMessage="لا يوجد مستخدمين"
    />
  );
};

export default UsersTable;
