import { Suspense } from "react";

import { Table, parsePage } from "@/components/table";
import { ReturnsTable } from "@/features/admin/returns";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";

const ReturnsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}) => {
  const params = await searchParams;
  const page = parsePage(params.page);

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold">المرتجعات</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          مراجعة طلبات الإرجاع واعتمادها أو رفضها
        </p>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={returnsTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <ReturnsTable
          page={page}
          sort={params.sort}
          direction={params.direction}
        />
      </Suspense>
    </div>
  );
};

export default ReturnsPage;
