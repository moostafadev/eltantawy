import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { LogoutButton } from "@/components/logoutButton";
import { verifyAccessToken } from "@/lib/auth";
import { ProfileCard, ProfileSkeleton } from "@/features/client/profile";
import { RecentOrders } from "@/features/client/orders";
import { Skeleton } from "@/components/skeleton";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "الملف الشخصي",
  description: "إدارة بياناتك الشخصية ومتابعة طلباتك السابقة.",
  path: "/profile",
  noIndex: true,
});

const RecentOrdersSkeleton = () => {
  return (
    <div className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-background-second/60 p-3 lg:p-4">
        <Skeleton width={36} height={36} color="MAIN" />

        <div className="flex flex-col gap-1">
          <Skeleton width={80} height={16} />
          <Skeleton width={160} height={12} />
        </div>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 border-b border-background-second/60 p-3 last:border-b-0 lg:p-4"
          >
            <div className="flex flex-col gap-1">
              <Skeleton width={70} height={16} />
              <Skeleton width={120} height={12} />
            </div>

            <Skeleton width={90} height={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8">
      <div className="container">
        <div className="flex w-full flex-col gap-5 lg:gap-6">
          <header className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center bg-main/10 text-main">
              <UserRound className="size-6" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                الملف الشخصي
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                بيانات حسابك وطلباتك في مكان واحد
              </p>
            </div>
          </header>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-5">
            <div className="flex min-w-0 flex-col gap-4">
              <Suspense fallback={<ProfileSkeleton />}>
                <ProfileCard userId={payload.userId} />
              </Suspense>

              <Suspense fallback={<RecentOrdersSkeleton />}>
                <RecentOrders userId={payload.userId} />
              </Suspense>
            </div>

            <aside className="flex flex-col gap-3 border border-background-second/60 bg-background p-3 shadow-sm lg:p-4">
              <div className="border-b border-background-second/60 pb-3">
                <h2 className="font-bold">الوصول السريع</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  تابع مشترياتك أو أكمل التسوق
                </p>
              </div>

              <Link
                href="/profile/orders"
                className="group flex items-center gap-3 border border-background-second/60 p-3 transition-colors hover:border-main/30 hover:bg-main/5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
                  <ShoppingBag className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">طلباتي</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    راجع حالة طلباتك السابقة
                  </span>
                </span>
                <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-main" />
              </Link>

              <Link
                href="/products"
                className="group flex items-center gap-3 border border-background-second/60 p-3 transition-colors hover:border-main/30 hover:bg-main/5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
                  <ShoppingCart className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    تصفح المنتجات
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    اكتشف منتجاتنا وعروضنا
                  </span>
                </span>
                <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-main" />
              </Link>

              {payload.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="group flex items-center gap-3 border border-background-second/60 p-3 transition-colors hover:border-main/30 hover:bg-main/5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
                    <LayoutDashboard className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      لوحة التحكم
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      إدارة المتجر والطلبات
                    </span>
                  </span>
                  <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-main" />
                </Link>
              )}

              <div className="border-t border-background-second/60 pt-3">
                <LogoutButton className="w-full justify-center" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
