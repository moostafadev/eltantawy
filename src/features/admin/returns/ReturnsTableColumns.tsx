"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import {
  ReturnStatusEnum,
  returnStatusColors,
  returnStatusLabels,
} from "./types";

interface ReturnRow {
  id: string;
  orderId: string;
  reason: string;
  refundAmount: number;
  status: ReturnStatusEnum;
  createdAt: Date;
  order: {
    orderNumber: number;
    customerName: string;
  };
}

export const returnsTableColumns: TableColumn<ReturnRow>[] = [
  {
    key: "orderNumber",
    title: "رقم الطلب",
    render: (orderReturn) => (
      <Link
        href={`/admin/orders/${orderReturn.orderId}`}
        dir="ltr"
        className="font-bold text-main hover:underline"
      >
        {toArabicNums(orderReturn.order.orderNumber)}#
      </Link>
    ),
  },

  {
    key: "customerName",
    title: "العميل",
    render: (orderReturn) => <span>{orderReturn.order.customerName}</span>,
  },

  {
    key: "reason",
    title: "السبب",
    render: (orderReturn) => (
      <span className="line-clamp-1 text-sm text-muted-foreground">
        {orderReturn.reason}
      </span>
    ),
  },

  {
    key: "refundAmount",
    title: <div className="flex justify-center">القيمة</div>,
    render: (orderReturn) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(String(orderReturn.refundAmount))} ج.م
      </span>
    ),
  },

  {
    key: "status",
    title: <div className="flex justify-center">الحالة</div>,
    render: (orderReturn) => (
      <div className="flex justify-center">
        <Tag
          color={returnStatusColors[orderReturn.status]}
          variant="soft"
          size="sm"
        >
          {returnStatusLabels[orderReturn.status]}
        </Tag>
      </div>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">التاريخ</div>,
    render: (orderReturn) => (
      <span className="flex justify-end">
        {new Date(orderReturn.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },

  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (orderReturn) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/orders/${orderReturn.orderId}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>
      </div>
    ),
  },
];
