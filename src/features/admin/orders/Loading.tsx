import { Skeleton } from "@/components/skeleton";
import {
  AdminBreadcrumb,
  AdminPageHeader,
} from "@/features/admin/Loading";

const OrderLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <AdminPageHeader action />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
      <section className="h-fit overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <Skeleton width={120} height={18} />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-b border-background-second/60 p-3 lg:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton width={190} height={18} className="max-w-full" />
                <Skeleton width={260} height={14} className="max-w-full" />
              </div>
              <Skeleton width={90} height={20} />
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-3 border border-border bg-background p-3 lg:p-4">
        <Skeleton width={150} height={20} />
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between gap-3 border-b border-border/60 py-2"
          >
            <Skeleton width={90} height={14} />
            <Skeleton width={120} height={14} />
          </div>
        ))}
        <Skeleton height={40} />
        <Skeleton height={40} />
      </section>
    </div>
  </div>
);

export default OrderLoading;
