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
    <AdminPageHeader titleWidth={120} descriptionWidth={180} />
    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
      <section className="overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <Skeleton width={140} height={20} />
        </div>
        <div className="flex h-fit flex-col">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-background-second/60 p-3 last:border-b-0 lg:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton width={180} height={20} className="max-w-full" />
                  <Skeleton width={240} height={16} className="max-w-full" />
                </div>
                <Skeleton width={72} height={24} className="shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <Skeleton width={90} height={20} />
          </div>
          <div className="p-3 lg:p-4">
            <Skeleton height={40} />
          </div>
        </section>
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <Skeleton width={100} height={20} />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-1.5 border-b border-background-second/60 p-3 last:border-b-0 lg:p-4"
            >
              <Skeleton width={90} height={16} />
              <Skeleton width={180} height={20} className="max-w-full" />
            </div>
          ))}
        </section>
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <Skeleton width={100} height={20} />
          </div>
          <div className="flex flex-col gap-3 p-3 lg:p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-3">
                <Skeleton width={110} height={16} />
                <Skeleton width={96} height={16} />
              </div>
            ))}
            <Skeleton height={24} />
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default OrderLoading;
