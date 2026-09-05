import { Suspense } from "react";

import { Table } from "@/components/table";
import { ReturnsTable } from "@/features/admin/returns";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";

const ReturnsPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div>
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
        <ReturnsTable />
      </Suspense>
    </div>
  );
};

export default ReturnsPage;
