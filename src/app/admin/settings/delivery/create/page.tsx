import { Breadcrumb } from "@/components/breadcrumb";
import { Create } from "@/features/admin/settings/delivery/create";
import { getDeliveryZonesForParentSelect } from "@/features/admin/settings/delivery/table";

const CreateDeliveryZonePage = async () => {
  const zones = await getDeliveryZonesForParentSelect();

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
            label: "إنشاء منطقة",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">إنشاء منطقة توصيل</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إضافة منطقة توصيل جديدة أو منطقة فرعية داخل منطقة موجودة
        </p>
      </div>

      <div className="border border-background-second bg-background p-3 md:p-4 lg:p-6 shadow-sm">
        <Create zones={zones} />
      </div>
    </div>
  );
};

export default CreateDeliveryZonePage;
