import { toArabicNums } from "@/utils/toArabicNums";
import {
  CalendarDays,
  type LucideIcon,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { getProfile } from "./profile.service";

interface Props {
  userId: string;
}

const ProfileCard = async ({ userId }: Props) => {
  const user = await getProfile(userId);

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
      <header className="relative overflow-hidden border-b border-background-second/60 p-4 sm:p-5">
        <div className="pointer-events-none absolute -left-8 -top-12 size-36 rounded-full bg-main/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-main/20 bg-background text-xl font-bold text-main shadow-sm">
            {user.fName.charAt(0)}
            {user.lName.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {user.fName} {user.lName}
              </h2>
              <span className="inline-flex items-center gap-1 bg-main/10 px-2 py-1 text-xs font-medium text-main">
                <ShieldCheck aria-hidden="true" className="size-3.5" />
                {user.role === "ADMIN" ? "مدير" : "حساب عميل"}
              </span>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              <span dir="ltr">{toArabicNums(user.phone)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-background-second/60 pt-3 text-xs text-muted-foreground sm:border-0 sm:pt-0">
            <CalendarDays aria-hidden="true" className="size-4 text-main" />
            <span>عضو منذ {memberSince}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <ProfileItem icon={UserRound} label="الاسم الأول" value={user.fName} />
        <ProfileItem icon={UserRound} label="اسم العائلة" value={user.lName} />
        <ProfileItem
          icon={Phone}
          label="رقم الهاتف"
          value={toArabicNums(user.phone)}
        />

        <ProfileItem
          icon={ShieldCheck}
          label="نوع الحساب"
          value={user.role === "ADMIN" ? "مدير" : "مستخدم"}
        />
      </div>
    </section>
  );
};

interface ProfileItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const ProfileItem = ({ icon: Icon, label, value }: ProfileItemProps) => {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-3.5 lg:p-4">
      <span className="flex size-9 shrink-0 items-center justify-center bg-muted text-main">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="wrap-break-word text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
