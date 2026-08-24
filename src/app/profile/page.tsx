import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/button";
import { LogoutButton } from "@/components/logoutButton";
import { LayoutDashboard } from "lucide-react";

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

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      fName: true,
      lName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user || !user.isVerified) {
    redirect("/login");
  }

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              إدارة بيانات حسابك الشخصي
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
            {/* User Header */}
            <div className="flex flex-col gap-4 border-b border-background-second/60 p-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-main/10 text-xl font-bold text-main">
                {user.fName.charAt(0)}
                {user.lName.charAt(0)}
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {user.fName} {user.lName}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Information */}
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
              <ProfileItem label="الاسم الأول" value={user.fName} />

              <ProfileItem label="اسم العائلة" value={user.lName} />

              <ProfileItem label="البريد الإلكتروني" value={user.email ?? ""} />

              <ProfileItem label="رقم الهاتف" value={user.phone} />

              <ProfileItem
                label="حالة البريد الإلكتروني"
                value={user.isVerified ? "تم التحقق" : "غير متحقق"}
              />

              <ProfileItem
                label="نوع الحساب"
                value={user.role === "ADMIN" ? "مدير" : "مستخدم"}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <LogoutButton />
            {payload.role === "ADMIN" ? (
              <Link href={"/admin"}>
                <Button
                  size="lg"
                  className="flex items-center justify-center gap-4"
                >
                  <LayoutDashboard className="size-5" />
                  <span>الداشبورد</span>
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileItemProps {
  label: string;
  value: string;
}

const ProfileItem = ({ label, value }: ProfileItemProps) => {
  return (
    <div className="border-b border-background-second/60 p-5 last:border-b-0 sm:odd:border-l">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default Profile;
