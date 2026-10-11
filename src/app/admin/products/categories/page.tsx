import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/button";
import { CategoriesTable } from "@/features/admin/categories/table";
import { Table } from "@/components/table";
import { categoriesTableColumns } from "@/features/admin/categories/table/CategoriesTableColumns";

const Categories = async () => {
  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">التصنيفات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة تصنيفات المنتجات
          </p>
        </div>

        <Link
          href="/admin/products/categories/create"
          className="mr-auto self-end"
        >
          <Button color="SUCCESS" size="sm" variant="soft">
            <Plus className="size-4" />
            <span>إنشاء تصنيف</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={categoriesTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <CategoriesTable />
      </Suspense>
    </div>
  );
};

export default Categories;
