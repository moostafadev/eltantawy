import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/button";
import { Table, parsePage } from "@/components/table";
import { ProductsTable } from "@/features/admin/products/table";
import { productsTableColumns } from "@/features/admin/products/table/ProductsTableColumns";

const Products = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}) => {
  const params = await searchParams;
  const page = parsePage(params.page);

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">المنتجات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة منتجات الموقع
          </p>
        </div>

        <Link href="/admin/products/create" className="mr-auto self-end">
          <Button color="SUCCESS" size="sm" variant="soft">
            <Plus className="size-4" />
            <span>إنشاء منتج</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={productsTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <ProductsTable
          page={page}
          sort={params.sort}
          direction={params.direction}
        />
      </Suspense>
    </div>
  );
};

export default Products;
