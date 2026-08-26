import { Tag } from "@/components/tag";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { User } from "./types";

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
    title: <div className="flex justify-center">الصلاحية</div>,
    render: (user) => (
      <div className="flex justify-center">
        <Tag
          color={user.role === "ADMIN" ? "MAIN" : "NEUTRAL"}
          variant="soft"
          size="sm"
        >
          {user.role === "ADMIN" ? "مدير" : "مستخدم"}
        </Tag>
      </div>
    ),
  },

  {
    key: "isVerified",
    title: <div className="flex justify-center">الحالة</div>,
    render: (user) => (
      <div className="flex justify-center">
        <Tag
          color={user.isVerified ? "SUCCESS" : "DANGER"}
          variant="soft"
          size="sm"
        >
          {user.isVerified ? "موثق" : "غير موثق"}
        </Tag>
      </div>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ التسجيل</div>,
    render: (user) => (
      <span className="flex justify-end">
        {new Date(user.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },
];
