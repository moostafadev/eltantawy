import { TableColumn } from "@/components/table/types";
import { User } from "./types";
import { toArabicNums } from "@/utils/toArabicNums";

export const usersTableColumns: TableColumn<User>[] = [
  {
    key: "name",
    title: "الاسم",
    render: (user) => (
      <span className="font-medium">
        {user.fName} {user.lName}
      </span>
    ),
  },

  {
    key: "email",
    title: "البريد الإلكتروني",
    render: (user) => <span dir="ltr">{user.email}</span>,
  },

  {
    key: "phone",
    title: "رقم الهاتف",
    render: (user) => <span dir="ltr">{toArabicNums(String(user.phone))}</span>,
  },

  {
    key: "role",
    title: "الصلاحية",
    render: (user) => (
      <span
        className={`
          inline-flex
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          ${
            user.role === "ADMIN"
              ? "bg-main/10 text-main"
              : "bg-muted text-muted-foreground"
          }
        `}
      >
        {user.role === "ADMIN" ? "مدير" : "مستخدم"}
      </span>
    ),
  },

  {
    key: "isVerified",
    title: "الحالة",
    render: (user) => (
      <span
        className={`
          inline-flex
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          ${
            user.isVerified
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        `}
      >
        {user.isVerified ? "موثق" : "غير موثق"}
      </span>
    ),
  },

  {
    key: "createdAt",
    title: "تاريخ التسجيل",
    render: (user) => (
      <span>{new Date(user.createdAt).toLocaleDateString("ar-EG")}</span>
    ),
  },
];
