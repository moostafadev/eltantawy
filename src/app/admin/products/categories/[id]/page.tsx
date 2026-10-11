import { LoadingImage as Image } from "@/components/loading-image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Table, parsePage } from "@/components/table";
import { CategoryGraph } from "@/features/admin/categories/create/Graph";
import { productsTableColumns } from "@/features/admin/products/table/ProductsTableColumns";
import { getProductsByCategory } from "@/features/admin/products/table";
import {
  getCategoriesForGraph,
  getOneCategory,
} from "@/features/admin/categories/table";

interface CategoryProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}

const Category = async ({ params, searchParams }: CategoryProps) => {
  const { id } = await params;
  const query = await searchParams;
  const page = parsePage(query.page);

  const [category, categories, productsPage] = await Promise.all([
    getOneCategory(id),
    getCategoriesForGraph(),
    getProductsByCategory(id, page, query.sort, query.direction),
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

      <div className="flex flex-wrap items-center justify-between gap-4">
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

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
        {/* Category Details */}
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <h2 className="text-sm font-semibold">بيانات التصنيف</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              المعلومات الأساسية الخاصة بالتصنيف
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <CategoryItem label="اسم التصنيف" value={category.title} />

            <CategoryItem
              label="التصنيف الأب"
              value={category.parent?.title ?? "تصنيف رئيسي"}
            />

            <CategoryItem
              label="تاريخ الإنشاء"
              value={new Date(category.createdAt).toLocaleDateString("ar-EG")}
            />

            <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 sm:col-span-2 lg:gap-1.5 lg:p-4">
              <p className="text-xs font-medium text-muted-foreground">الوصف</p>

              <p className="text-sm font-medium leading-6 text-foreground">
                {category.desc || "لا يوجد وصف للتصنيف"}
              </p>
            </div>
          </div>
        </section>

        {/* Category Image */}
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <h2 className="text-sm font-semibold">صورة التصنيف</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              الصورة المستخدمة لعرض التصنيف
            </p>
          </div>

          <div className="flex min-h-64 items-center justify-center p-4 lg:min-h-full lg:p-6">
            {category.image ? (
              <div className="relative h-64 w-full lg:h-full lg:min-h-72">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-muted/30 lg:h-full lg:min-h-72">
                <p className="text-sm text-muted-foreground">
                  لا توجد صورة للتصنيف
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">منتجات التصنيف</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            المنتجات المرتبطة بهذا التصنيف
          </p>
        </div>
        <Table
          data={productsPage.data}
          columns={productsTableColumns}
          emptyMessage="لا توجد منتجات مرتبطة بهذا التصنيف"
          pagination={{
            ...productsPage.pagination,
            basePath: `/admin/products/categories/${category.id}`,
          }}
          sorting={productsPage.sorting}
        />
      </section>

      {/* Category Graph */}
      <CategoryGraph categories={categories} selectedId={category.id} />
    </div>
  );
};

interface CategoryItemProps {
  label: string;
  value: string;
}

const CategoryItem = ({ label, value }: CategoryItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default Category;
