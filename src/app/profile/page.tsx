import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/button";
import { LogoutButton } from "@/components/logoutButton";
import { verifyAccessToken } from "@/lib/auth";
import { ProfileCard, ProfileSkeleton } from "@/features/client/profile";
import { RecentOrders } from "@/features/client/orders";
import { Skeleton } from "@/components/skeleton";

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
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>

            <p className="text-sm text-muted-foreground">
              إدارة بيانات حسابك الشخصي
            </p>
          </div>

          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileCard userId={payload.userId} />
          </Suspense>

          <Suspense fallback={<RecentOrdersSkeleton />}>
            <RecentOrders userId={payload.userId} />
          </Suspense>

          <div className="flex flex-wrap justify-between gap-2 lg:items-center">
            <LogoutButton />

            {payload.role === "ADMIN" && (
              <Link href="/admin" className="mr-auto">
                <Button className="flex items-center justify-center gap-4">
                  <LayoutDashboard className="size-5" />
                  <span>الداشبورد</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
