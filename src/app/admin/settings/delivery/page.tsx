import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Table } from "@/components/table";
import { DeliveryZonesTable } from "@/features/admin/settings/delivery/table";
import { deliveryZonesTableColumns } from "@/features/admin/settings/delivery/table/DeliveryZonesTableColumns";

const DeliveryZonesPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "مناطق التوصيل",
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مناطق التوصيل</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة مناطق التوصيل وتكلفة كل منطقة
          </p>
        </div>

        <Link
          href="/admin/settings/delivery/create"
          className="mr-auto self-end"
        >
          <Button color="SUCCESS" size="sm" variant="soft">
            <Plus className="size-4" />
            <span>إنشاء منطقة</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={deliveryZonesTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <DeliveryZonesTable />
      </Suspense>
    </div>
  );
};

export default DeliveryZonesPage;
