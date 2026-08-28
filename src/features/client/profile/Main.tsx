import { toArabicNums } from "@/utils/toArabicNums";

import { getProfile } from "./profile.service";

interface Props {
  userId: string;
}

const ProfileCard = async ({ userId }: Props) => {
  const user = await getProfile(userId);

  if (!user || !user.isVerified) {
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

          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <ProfileItem label="الاسم الأول" value={user.fName} />
        <ProfileItem label="اسم العائلة" value={user.lName} />
        <ProfileItem label="البريد الإلكتروني" value={user.email} />

        <ProfileItem label="رقم الهاتف" value={toArabicNums(user.phone)} />

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
  );
};

interface ProfileItemProps {
  label: string;
  value: string;
}

const ProfileItem = ({ label, value }: ProfileItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default ProfileCard;
