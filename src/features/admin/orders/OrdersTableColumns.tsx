"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { Order, orderStatusColors, orderStatusLabels } from "./types";

type OrderRow = Pick<
  Order,
  | "id"
  | "orderNumber"
  | "customerName"
  | "customerPhone"
  | "deliveryZoneTitle"
  | "total"
  | "status"
  | "paymentMethod"
  | "createdAt"
>;

export const ordersTableColumns: TableColumn<OrderRow>[] = [
  {
    key: "orderNumber",
    title: "رقم الطلب",
    render: (order) => (
      <span dir="ltr" className="font-bold text-main">
        {toArabicNums(order.orderNumber)}#
      </span>
    ),
  },

  {
    key: "customerName",
    title: "العميل",
    render: (order) => (
      <div className="flex flex-col">
        <span className="font-medium">{order.customerName}</span>
        <span dir="ltr" className="text-xs text-muted-foreground">
          {toArabicNums(order.customerPhone)}
        </span>
      </div>
    ),
  },

  {
    key: "deliveryZoneTitle",
    title: "منطقة التوصيل",
    render: (order) => <span>{order.deliveryZoneTitle}</span>,
  },

  {
    key: "total",
    title: <div className="flex justify-center">الإجمالي</div>,
    render: (order) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(String(order.total))} ج.م
      </span>
    ),
  },

  {
    key: "status",
    title: <div className="flex justify-center">الحالة</div>,
    render: (order) => (
      <div className="flex justify-center">
        <Tag color={orderStatusColors[order.status]} variant="soft" size="sm">
          {orderStatusLabels[order.status]}
        </Tag>
      </div>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ الطلب</div>,
    render: (order) => (
      <span className="flex justify-end">
        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },

  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (order) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/orders/${order.id}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>
      </div>
    ),
  },
];
