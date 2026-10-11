import { Suspense } from "react";

import { Table, parsePage } from "@/components/table";
import { OrdersTable, OrdersRealtimeListener } from "@/features/admin/orders";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}) => {
  const params = await searchParams;
  const page = parsePage(params.page);

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <OrdersRealtimeListener />

      <div className="min-w-0">
        <h1 className="text-2xl font-bold">الطلبات</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة طلبات العملاء ومتابعة حالتها
        </p>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={ordersTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <OrdersTable
          page={page}
          sort={params.sort}
          direction={params.direction}
        />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
