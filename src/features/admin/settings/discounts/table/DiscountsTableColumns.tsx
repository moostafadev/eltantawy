"use client";

import Link from "next/link";
import { Eye, Pen } from "lucide-react";

import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { discountTypeLabels } from "../types";
import { Discount } from "./types";
import { DeleteDiscountButton } from "./deleteDiscount";

export const discountsTableColumns: TableColumn<Discount>[] = [
  {
    key: "type",
    title: "نوع الخصم",
    render: (discount) => (
      <Tag
        color={discount.type === "COUPON" ? "MAIN" : "INFO"}
        variant="soft"
        size="sm"
      >
        {discountTypeLabels[discount.type]}
      </Tag>
    ),
  },

  {
    key: "code",
    title: "الكود",
    render: (discount) => (
      <span dir="ltr" className="font-mono font-medium">
        {discount.code ?? "—"}
      </span>
    ),
  },

  {
    key: "value",
    title: <div className="flex justify-center">القيمة</div>,
    render: (discount) => (
      <span className="flex justify-center font-medium">
        {discount.valueType === "PERCENTAGE"
          ? `${toArabicNums(String(discount.value))}%`
          : `${toArabicNums(String(discount.value))} ج.م`}
      </span>
    ),
  },

  {
    key: "usage",
    title: <div className="flex justify-center">الاستخدام</div>,
    render: (discount) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(discount.usageCount)}
        {discount.usageLimit ? ` / ${toArabicNums(discount.usageLimit)}` : ""}
      </span>
    ),
  },

  {
    key: "isActive",
    title: <div className="flex justify-center">الحالة</div>,
    render: (discount) => (
      <div className="flex justify-center">
        <Tag
          color={discount.isActive ? "SUCCESS" : "DANGER"}
          variant="soft"
          size="sm"
        >
          {discount.isActive ? "مفعّل" : "معطّل"}
        </Tag>
      </div>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ الإنشاء</div>,
    render: (discount) => (
      <span className="flex justify-end">
        {new Date(discount.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },

  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (discount) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/settings/discounts/${discount.id}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>

        <Link href={`/admin/settings/discounts/${discount.id}/edit`}>
          <Button size="icon" color="INFO" variant="soft">
            <Pen className="size-4 lg:size-5" />
          </Button>
        </Link>

        <DeleteDiscountButton id={discount.id} />
      </div>
    ),
  },
];
