"use client";

import Link from "next/link";
import { Eye, Pen } from "lucide-react";

import { TableColumn } from "@/components/table/types";
import { Tag } from "@/components/tag";
import { Button } from "@/components/button";
import { toArabicNums } from "@/utils/toArabicNums";

import { DeliveryZone } from "./types";
import { DeleteDeliveryZoneButton } from "./deleteDeliveryZone";

export const deliveryZonesTableColumns: TableColumn<DeliveryZone>[] = [
  {
    key: "title",
    title: "المنطقة",
    render: (zone) => <span className="font-medium">{zone.title}</span>,
  },

  {
    key: "parent",
    title: "المنطقة الأب",
    render: (zone) => <span>{zone.parent?.title || "منطقة رئيسية"}</span>,
  },

  {
    key: "cost",
    title: <div className="flex justify-center">تكلفة التوصيل</div>,
    render: (zone) => (
      <span className="flex justify-center font-medium">
        {zone.cost !== null
          ? `${toArabicNums(String(zone.cost))} ج.م`
          : "بدون تكلفة (منطقة أب)"}
      </span>
    ),
  },

  {
    key: "children",
    title: <div className="flex justify-center">المناطق الفرعية</div>,
    render: (zone) => (
      <span className="font-medium flex justify-center">
        {String(toArabicNums(zone._count.children))}
      </span>
    ),
  },

  {
    key: "isActive",
    title: <div className="flex justify-center">الحالة</div>,
    render: (zone) => (
      <div className="flex justify-center">
        <Tag
          color={zone.isActive ? "SUCCESS" : "DANGER"}
          variant="soft"
          size="sm"
        >
          {zone.isActive ? "نشطة" : "متوقفة"}
        </Tag>
      </div>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ الإنشاء</div>,
    render: (zone) => (
      <span className="flex justify-end">
        {new Date(zone.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },
  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (zone) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/settings/delivery/${zone.id}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>
        <Link href={`/admin/settings/delivery/${zone.id}/edit`}>
          <Button size="icon" color="INFO" variant="soft">
            <Pen className="size-4 lg:size-5" />
          </Button>
        </Link>
        <DeleteDeliveryZoneButton id={zone.id} />
      </div>
    ),
  },
];
