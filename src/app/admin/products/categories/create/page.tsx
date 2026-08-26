import { Breadcrumb } from "@/components/breadcrumb";
import { Create } from "@/features/admin/categories/create";
import { getCategoriesForParentSelect } from "@/features/admin/categories/table";

const CreateCategoryPage = async () => {
  const categories = await getCategoriesForParentSelect();

  return (
    <div dir="rtl" className="space-y-6">
      <Breadcrumb
        items={[
          {
            label: "التصنيفات",
            href: "/admin/products/categories",
          },
          {
            label: "انشاء تصنيف",
          },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">إنشاء تصنيف</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إضافة تصنيف جديد للمنتجات
        </p>
      </div>

      <div className="border border-background-second bg-background p-3 md:p-4 lg:p-6 shadow-sm">
        <Create categories={categories} />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
