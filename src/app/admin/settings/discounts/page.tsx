import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Table } from "@/components/table";
import { DiscountsTable } from "@/features/admin/settings/discounts/table";
import { discountsTableColumns } from "@/features/admin/settings/discounts/table/DiscountsTableColumns";

const DiscountsPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "الخصومات",
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الخصومات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة كوبونات الخصم والخصومات السريعة على العملاء
          </p>
        </div>

        <Link
          href="/admin/settings/discounts/create"
          className="mr-auto self-end"
        >
          <Button color="SUCCESS" size="sm" variant="soft">
            <Plus className="size-4" />
            <span>إنشاء خصم</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={discountsTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <DiscountsTable />
      </Suspense>
    </div>
  );
};

export default DiscountsPage;
