import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Table, parsePage } from "@/components/table";
import { DeliveryZonesTable } from "@/features/admin/settings/delivery/table";
import { deliveryZonesTableColumns } from "@/features/admin/settings/delivery/table/DeliveryZonesTableColumns";

const DeliveryZonesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}) => {
  const params = await searchParams;
  const page = parsePage(params.page);

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
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

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
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
        <DeliveryZonesTable
          page={page}
          sort={params.sort}
          direction={params.direction}
        />
      </Suspense>
    </div>
  );
};

export default DeliveryZonesPage;
