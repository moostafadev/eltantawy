import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import {
  UserDetailView,
  getUserProfile,
  getUserOrders,
  getUserReturns,
  getUserSummary,
} from "@/features/admin/users/details";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  const { id } = await params;

  const user = await getUserProfile(id);

  if (!user) {
    notFound();
  }

  const [orders, returns, summary] = await Promise.all([
    getUserOrders(id),
    getUserReturns(id),
    getUserSummary(id),
  ]);

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "المستخدمين",
            href: "/admin/users",
          },
          {
            label: `${user.fName} ${user.lName}`,
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">
          {user.fName} {user.lName}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تفاصيل المستخدم وطلباته ومرتجعاته
        </p>
      </div>

      <UserDetailView
        name={`${user.fName} ${user.lName}`}
        phone={user.phone}
        email={user.email}
        isGuest={false}
        isVerified={user.isVerified}
        role={user.role}
        registeredAt={user.createdAt}
        ordersCount={summary.ordersCount}
        totalSpent={summary.totalSpent}
        returnsCount={summary.returnsCount}
        orders={orders}
        returns={returns}
      />
    </div>
  );
};

export default UserPage;
