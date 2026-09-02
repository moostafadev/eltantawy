import { Breadcrumb } from "@/components/breadcrumb";
import { Create } from "@/features/admin/settings/discounts/create";

const CreateDiscountPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "الخصومات",
            href: "/admin/settings/discounts",
          },
          {
            label: "إنشاء خصم",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">إنشاء خصم</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إضافة كوبون خصم أو خصم سريع على العملاء
        </p>
      </div>

      <div className="border border-background-second bg-background p-3 md:p-4 lg:p-6 shadow-sm">
        <Create />
      </div>
    </div>
  );
};

export default CreateDiscountPage;
