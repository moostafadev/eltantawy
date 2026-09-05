import { Suspense } from "react";

import { Table } from "@/components/table";
import { OrdersTable, OrdersRealtimeListener } from "@/features/admin/orders";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";

const OrdersPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <OrdersRealtimeListener />

      <div>
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
        <OrdersTable />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
