import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import { verifyAccessToken } from "@/lib/auth";
import {
  OrdersList,
  OrdersRealtimeListener,
  getAllOrdersForUser,
} from "@/features/client/orders";

const ProfileOrdersPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    redirect("/login");
  }

  const orders = await getAllOrdersForUser(payload.userId);

  return (
    <div className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8">
      <div className="container">
        <div className="flex w-full flex-col gap-4">
          <OrdersRealtimeListener userId={payload.userId} />

          <Breadcrumb
            items={[
              {
                label: "الملف الشخصي",
                href: "/profile",
              },
              {
                label: "طلباتي",
              },
            ]}
          />

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              طلباتي
            </h1>

            <p className="text-sm text-muted-foreground">
              تابع حالة طلباتك وتفاصيل كل طلب أولًا بأول
            </p>
          </div>

          <OrdersList orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOrdersPage;
