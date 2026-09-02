import { Pencil } from "lucide-react";
import Link from "next/link";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import { DeliveryZoneGraph } from "@/features/admin/settings/delivery/create/Graph";
import {
  getDeliveryZonesForGraph,
  getOneDeliveryZone,
} from "@/features/admin/settings/delivery/table";

interface DeliveryZoneProps {
  params: Promise<{
    id: string;
  }>;
}

const DeliveryZonePage = async ({ params }: DeliveryZoneProps) => {
  const { id } = await params;

  const [zone, zones] = await Promise.all([
    getOneDeliveryZone(id),
    getDeliveryZonesForGraph(),
  ]);

  if (!zone) {
    return (
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-sm text-muted-foreground">المنطقة غير موجودة</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "مناطق التوصيل",
            href: "/admin/settings/delivery",
          },
          {
            label: zone.title,
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{zone.title}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تفاصيل منطقة التوصيل وإدارتها
          </p>
        </div>

        <Link
          href={`/admin/settings/delivery/${zone.id}/edit`}
          className="mr-auto self-end"
        >
          <Button color="INFO" size="sm" variant="soft">
            <Pencil className="size-4" />
            <span>تعديل المنطقة</span>
          </Button>
        </Link>
      </div>

      <section className="overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <h2 className="text-sm font-semibold">بيانات المنطقة</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            المعلومات الأساسية الخاصة بمنطقة التوصيل
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <DeliveryZoneItem label="اسم المنطقة" value={zone.title} />

          <DeliveryZoneItem
            label="المنطقة الأب"
            value={zone.parent?.title ?? "منطقة رئيسية"}
          />

          <DeliveryZoneItem
            label="تكلفة التوصيل"
            value={
              zone.cost !== null
                ? `${toArabicNums(String(zone.cost))} ج.م`
                : "بدون تكلفة (منطقة أب)"
            }
          />

          <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
            <p className="text-xs font-medium text-muted-foreground">الحالة</p>

            <Tag
              color={zone.isActive ? "SUCCESS" : "DANGER"}
              variant="soft"
              size="sm"
              className="w-fit"
            >
              {zone.isActive ? "نشطة" : "متوقفة"}
            </Tag>
          </div>

          <DeliveryZoneItem
            label="عدد المناطق الفرعية"
            value={String(toArabicNums(zone._count.children))}
          />

          <DeliveryZoneItem
            label="تاريخ الإنشاء"
            value={new Date(zone.createdAt).toLocaleDateString("ar-EG")}
          />
        </div>
      </section>

      <DeliveryZoneGraph zones={zones} selectedId={zone.id} />
    </div>
  );
};

interface DeliveryZoneItemProps {
  label: string;
  value: string;
}

const DeliveryZoneItem = ({ label, value }: DeliveryZoneItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default DeliveryZonePage;
