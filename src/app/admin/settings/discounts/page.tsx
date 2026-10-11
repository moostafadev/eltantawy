import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Table, parsePage } from "@/components/table";
import { DiscountsTable } from "@/features/admin/settings/discounts/table";
import { discountsTableColumns } from "@/features/admin/settings/discounts/table/DiscountsTableColumns";

const DiscountsPage = async ({
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
            label: "الخصومات",
          },
        ]}
      />

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
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
        <DiscountsTable
          page={page}
          sort={params.sort}
          direction={params.direction}
        />
      </Suspense>
    </div>
  );
};

export default DiscountsPage;
