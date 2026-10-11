import { Skeleton } from "@/components/skeleton";

const CartSummaryLoading = () => (
  <aside className="flex h-fit flex-col gap-4 border border-border bg-background p-3 lg:p-4">
    <Skeleton width={110} height={22} />
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex justify-between gap-4">
        <Skeleton width={90} height={15} />
        <Skeleton width={75} height={15} />
      </div>
    ))}
    <Skeleton height={42} />
    <Skeleton height={42} />
  </aside>
);

const CheckoutLoading = () => (
  <main
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
      <div className="grid gap-3 lg:grid-cols-[1fr_360px] lg:gap-4">
        <section className="flex flex-col gap-4 border border-border bg-background p-4 lg:p-6">
          <Skeleton width={180} height={24} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton width={90} height={14} />
                <Skeleton height={44} />
              </div>
            ))}
          </div>
          <Skeleton height={48} />
        </section>
        <CartSummaryLoading />
      </div>
    </div>
  </main>
);

export default CheckoutLoading;
