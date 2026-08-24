import { getUsers, UsersTable } from "@/features/admin/users/table";

const UsersPage = async () => {
  const users = await getUsers();

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المستخدمين</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المستخدمين المسجلين
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
};

export default UsersPage;
