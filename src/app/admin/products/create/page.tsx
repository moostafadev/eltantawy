import { Breadcrumb } from "@/components/breadcrumb";
import { Create } from "@/features/admin/products/create";
import { getCategoriesForParentSelect } from "@/features/admin/categories/table";

const CreateProduct = async () => {
  const categories = await getCategoriesForParentSelect();

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "المنتجات",
            href: "/admin/products",
          },
          {
            label: "إنشاء منتج",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">إنشاء منتج</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إضافة منتج جديد للمتجر
        </p>
      </div>

      <Create categories={categories} />
    </div>
  );
};

export default CreateProduct;
