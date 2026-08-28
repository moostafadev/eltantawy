import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/button";
import { LogoutButton } from "@/components/logoutButton";
import { verifyAccessToken } from "@/lib/auth";
import { ProfileCard, ProfileSkeleton } from "@/features/client/profile";

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
    <div className="flex flex-1 items-stretch bg-background-second/20 py-8">
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
