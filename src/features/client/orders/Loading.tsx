import { Skeleton } from "@/components/skeleton";

const OrdersLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container flex flex-col gap-4">
      <nav aria-label="مسار التنقل" className="flex items-center gap-2">
        <Skeleton width={72} height={14} />
        <Skeleton width={12} height={14} />
        <Skeleton width={96} height={14} />
      </nav>
      <div className="flex flex-col gap-2">
        <Skeleton width={150} height={28} className="max-w-full" />
        <Skeleton width={300} height={16} className="max-w-full" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border border-border bg-background p-3 sm:flex-row sm:items-center lg:p-4"
          >
            <Skeleton width={56} height={56} className="shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton width={180} height={18} className="max-w-full" />
              <Skeleton width={130} height={14} />
            </div>
            <Skeleton width={100} height={28} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrdersLoading;
