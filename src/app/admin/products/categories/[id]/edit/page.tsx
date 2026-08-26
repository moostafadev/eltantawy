import { Breadcrumb } from "@/components/breadcrumb";
import { Edit } from "@/features/admin/categories/edit";
import {
  getCategoriesForGraph,
  getOneCategory,
} from "@/features/admin/categories/table";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCategoryPage = async ({ params }: EditCategoryPageProps) => {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    getOneCategory(id),
    getCategoriesForGraph(),
  ]);

  if (!category) {
    return (
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-sm text-muted-foreground">التصنيف غير موجود</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "التصنيفات",
            href: "/admin/products/categories",
          },
          {
            label: category.title,
            href: `/admin/products/categories/${category.id}`,
          },
          {
            label: "تعديل",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">تعديل التصنيف</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تعديل بيانات التصنيف
        </p>
      </div>

      <Edit category={category} categories={categories} />
    </div>
  );
};

export default EditCategoryPage;
