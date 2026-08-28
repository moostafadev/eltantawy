import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { CategoryGraph } from "@/features/admin/categories/create/Graph";
import {
  getCategoriesForGraph,
  getOneCategory,
} from "@/features/admin/categories/table";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface CategoryProps {
  params: Promise<{
    id: string;
  }>;
}

const Category = async ({ params }: CategoryProps) => {
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
          },
        ]}
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{category.title}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تفاصيل التصنيف وإدارته
          </p>
        </div>

        <Link
          href={`/admin/products/categories/${category.id}/edit`}
          className="mr-auto self-end"
        >
          <Button color="INFO" size="sm" variant="soft">
            <Pencil className="size-4" />
            <span>تعديل التصنيف</span>
          </Button>
        </Link>
      </div>

      <CategoryGraph categories={categories} selectedId={category.id} />
    </div>
  );
};

export default Category;
