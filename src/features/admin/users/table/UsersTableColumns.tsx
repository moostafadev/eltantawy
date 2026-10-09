"use client";

import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";

import { Tag } from "@/components/tag";
import { Button } from "@/components/button";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";
import { getWhatsAppLink } from "@/utils/whatsapp";

import { UserRow } from "./types";

export const usersTableColumns: TableColumn<UserRow>[] = [
  {
    key: "name",
    title: "الاسم",
    render: (row) => (
      <span className="font-medium">
        {row.kind === "REGISTERED"
          ? `${row.data.fName} ${row.data.lName}`
          : row.data.customerName}
      </span>
    ),
  },

  {
    key: "phone",
    title: "رقم الهاتف",
    render: (row) => (
      <span dir="ltr">
        {toArabicNums(
          row.kind === "REGISTERED" ? row.data.phone : row.data.customerPhone,
        )}
      </span>
    ),
  },

  {
    key: "type",
    title: <div className="flex justify-center">نوع الحساب</div>,
    render: (row) => (
      <div className="flex justify-center">
        <Tag
          color={row.kind === "REGISTERED" ? "MAIN" : "SECONDARY"}
          variant="soft"
          size="sm"
        >
          {row.kind === "REGISTERED"
            ? row.data.role === "ADMIN"
              ? "مدير"
              : "مستخدم مسجل"
            : "ضيف"}
        </Tag>
      </div>
    ),
  },

  {
    key: "ordersCount",
    title: <div className="flex justify-center">عدد الطلبات</div>,
    render: (row) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(
          row.kind === "REGISTERED"
            ? row.data._count.orders
            : row.data.ordersCount,
        )}
      </span>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">آخر نشاط</div>,
    render: (row) => (
      <span className="flex justify-end">
        {new Date(row.data.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },

  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (row) => {
      const phone =
        row.kind === "REGISTERED" ? row.data.phone : row.data.customerPhone;

      const name =
        row.kind === "REGISTERED"
          ? `${row.data.fName} ${row.data.lName}`
          : row.data.customerName;

      return (
        <div className="flex justify-center gap-1">
          <Link
            href={getWhatsAppLink(phone, `مرحبًا ${name}`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="التواصل عبر واتساب"
          >
            <Button size="icon" color="SUCCESS" variant="soft">
              <MessageCircle aria-hidden="true" className="size-4 lg:size-5" />
            </Button>
          </Link>

          <Link
            href={
              row.kind === "REGISTERED"
                ? `/admin/users/${row.data.id}`
                : `/admin/users/guest/${row.data.customerPhone}`
            }
            aria-label="عرض تفاصيل المستخدم"
          >
            <Button size="icon" color="NEUTRAL" variant="outline">
              <Eye aria-hidden="true" className="size-4 lg:size-5" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
