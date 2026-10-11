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

const CartLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container">
      <div className="flex flex-col gap-4">
        <Skeleton width={40} height={40} />
        <div className="grid gap-3 lg:grid-cols-[1fr_360px] lg:gap-4">
          <section className="flex h-fit flex-col border border-border bg-background px-3 lg:px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-border py-4 last:border-0"
              >
                <Skeleton width={88} height={88} className="shrink-0" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton width={170} height={18} className="max-w-full" />
                  <Skeleton width={90} height={14} />
                  <Skeleton width={110} height={16} />
                </div>
              </div>
            ))}
          </section>
          <CartSummaryLoading />
        </div>
      </div>
    </div>
  </main>
);

export default CartLoading;
