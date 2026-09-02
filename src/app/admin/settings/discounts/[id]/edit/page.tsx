import { Breadcrumb } from "@/components/breadcrumb";
import { Edit } from "@/features/admin/settings/discounts/edit";
import { getOneDiscount } from "@/features/admin/settings/discounts/table";
import { discountTypeLabels } from "@/features/admin/settings/discounts/types";

interface EditDiscountPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditDiscountPage = async ({ params }: EditDiscountPageProps) => {
  const { id } = await params;

  const discount = await getOneDiscount(id);

  if (!discount) {
    return (
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-sm text-muted-foreground">الخصم غير موجود</p>
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
            label: "الخصومات",
            href: "/admin/settings/discounts",
          },
          {
            label: discount.code ?? discountTypeLabels[discount.type],
            href: `/admin/settings/discounts/${discount.id}`,
          },
          {
            label: "تعديل",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">تعديل الخصم</h1>

        <p className="mt-1 text-sm text-muted-foreground">تعديل بيانات الخصم</p>
      </div>

      <Edit discount={discount} />
    </div>
  );
};

export default EditDiscountPage;
