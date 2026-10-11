import { Table } from "@/components/table";
import { Skeleton } from "@/components/skeleton";
import {
  AdminBreadcrumb,
  AdminPageHeader,
} from "@/features/admin/Loading";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";

const UserDetailLoading = ({ guest = false }: { guest?: boolean }) => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb count={2} />
    <AdminPageHeader
      titleWidth={190}
      descriptionWidth={guest ? 220 : 260}
    />
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <section className="min-w-0 overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <Skeleton width={140} height={20} />
          <Skeleton width={220} height={16} className="mt-1 max-w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: guest ? 3 : 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-col gap-1.5 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:p-4"
            >
              <Skeleton width={20} height={16} />
              <Skeleton width={index === 0 ? 180 : 130} height={20} className="max-w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border border-background-second bg-background p-3 shadow-sm lg:p-4"
          >
            <Skeleton width={20} height={16} />
            <Skeleton width={110} height={28} className="mt-1 max-w-full" />
          </div>
        ))}
      </section>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <Skeleton width={80} height={24} />
          <Skeleton width={230} height={20} className="mt-1 max-w-full" />
        </div>
        <Table data={[]} columns={ordersTableColumns} loading loadingRows={4} />
      </section>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <Skeleton width={80} height={24} />
          <Skeleton width={250} height={20} className="mt-1 max-w-full" />
        </div>
        <Table data={[]} columns={returnsTableColumns} loading loadingRows={4} />
      </section>
    </div>
  </div>
);

export default UserDetailLoading;
export { UserDetailLoading };

export const GuestDetailLoading = () => <UserDetailLoading guest />;
