import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import {
  UserDetailView,
  getGuestProfile,
  getGuestOrders,
  getGuestReturns,
  getGuestSummary,
} from "@/features/admin/users/details";

interface GuestUserPageProps {
  params: Promise<{
    phone: string;
  }>;
}

const GuestUserPage = async ({ params }: GuestUserPageProps) => {
  const { phone } = await params;

  const guest = await getGuestProfile(phone);

  if (!guest) {
    notFound();
  }

  const [orders, returns, summary] = await Promise.all([
    getGuestOrders(phone),
    getGuestReturns(phone),
    getGuestSummary(phone),
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
            label: guest.customerName,
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">{guest.customerName}</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تفاصيل الضيف وطلباته ومرتجعاته
        </p>
      </div>

      <UserDetailView
        name={guest.customerName}
        phone={guest.customerPhone}
        email={guest.customerEmail}
        isGuest
        ordersCount={summary.ordersCount}
        totalSpent={summary.totalSpent}
        returnsCount={summary.returnsCount}
        orders={orders}
        returns={returns}
      />
    </div>
  );
};

export default GuestUserPage;
