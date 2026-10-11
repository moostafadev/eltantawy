import { Suspense } from "react";
import { Table } from "@/components/table";
import { UsersTable } from "@/features/admin/users/table";
import { usersTableColumns } from "@/features/admin/users/table/UsersTableColumns";

const UsersPage = async () => {
  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold">المستخدمين</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المستخدمين المسجلين
        </p>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={usersTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <UsersTable />
      </Suspense>
    </div>
  );
};

export default UsersPage;
