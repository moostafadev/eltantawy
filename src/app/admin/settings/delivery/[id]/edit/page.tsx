import { Breadcrumb } from "@/components/breadcrumb";
import { Edit } from "@/features/admin/settings/delivery/edit";
import {
  getDeliveryZonesForGraph,
  getOneDeliveryZone,
} from "@/features/admin/settings/delivery/table";

interface EditDeliveryZoneProps {
  params: Promise<{
    id: string;
  }>;
}

const EditDeliveryZonePage = async ({ params }: EditDeliveryZoneProps) => {
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
            href: `/admin/settings/delivery/${zone.id}`,
          },
          {
            label: "تعديل",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">تعديل منطقة التوصيل</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تعديل بيانات المنطقة
        </p>
      </div>

      <Edit zone={zone} zones={zones} />
    </div>
  );
};

export default EditDeliveryZonePage;
