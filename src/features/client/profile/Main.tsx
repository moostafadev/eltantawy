import { Tooltip } from "@/components/tooltip";
import { toArabicNums } from "@/utils/toArabicNums";
import { type LucideIcon, Phone, ShieldCheck, UserRound } from "lucide-react";

import { getProfile } from "./profile.service";

interface Props {
  userId: string;
}

const ProfileCard = async ({ userId }: Props) => {
  const user = await getProfile(userId);

  if (!user) {
    return null;
  }

  return (
    <div className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b border-background-second/60 p-3 sm:flex-row sm:items-center lg:p-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-main/10 text-xl font-bold text-main">
          {user.fName.charAt(0)}
          {user.lName.charAt(0)}
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">
            {user.fName} {user.lName}
          </h2>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Tooltip content="رقم الهاتف" focusable={false}>
              <Phone aria-hidden="true" className="size-4 shrink-0" />
            </Tooltip>
            <span dir="ltr">{toArabicNums(user.phone)}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <ProfileItem
          icon={UserRound}
          label="الاسم الأول"
          value={user.fName}
        />
        <ProfileItem
          icon={UserRound}
          label="اسم العائلة"
          value={user.lName}
        />
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
    </div>
  );
};

interface ProfileItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const ProfileItem = ({ icon: Icon, label, value }: ProfileItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Tooltip content={label} focusable={false}>
          <Icon aria-hidden="true" className="size-3.5" />
        </Tooltip>
        <span className="sr-only">{label}</span>
      </p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default ProfileCard;
