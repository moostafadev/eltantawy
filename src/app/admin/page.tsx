import { AdminDashboard, AdminDashboardSkeleton } from "@/features/admin";
import { Suspense } from "react";

const AdminPage = () => {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
};

export default AdminPage;
