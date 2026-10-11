import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

const BreadcrumbSkeleton = () => (
  <nav
    aria-label="مسار التنقل"
    className="scrollbar-hide w-full overflow-x-auto overscroll-x-contain"
  >
    <div className="flex w-max min-w-full items-center gap-1.5 sm:gap-2">
      <Skeleton width={32} height={32} className="shrink-0 sm:hidden" />
      <Skeleton width={36} height={36} className="hidden shrink-0 sm:block" />
      <Skeleton width={16} height={16} className="shrink-0" />
      <Skeleton width={72} height={16} />
      <Skeleton width={16} height={16} className="shrink-0" />
      <Skeleton width={96} height={16} />
    </div>
  </nav>
);

const DetailLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8"
  >
    <BreadcrumbSkeleton />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="relative aspect-square w-full overflow-hidden border border-background-second/60 bg-muted">
        <Skeleton aspectRatio={1} />
        <Skeleton width={48} height={28} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton width={100} height={16} />
          <Skeleton width={240} height={32} className="max-w-full lg:hidden" />
          <Skeleton
            width={260}
            height={36}
            className="hidden max-w-full lg:block"
          />
          <Skeleton width={56} height={20} />
        </div>
        <div className="flex flex-wrap items-baseline gap-1 lg:gap-2">
          <Skeleton width={100} height={24} />
          <Skeleton width={76} height={16} />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton height={28} />
        </div>
        <div className="flex flex-col gap-3 border-t border-background-second/60 pt-4">
          <div className="flex flex-col gap-2.5">
            <Skeleton width={100} height={20} />
            <div className="grid grid-cols-2 gap-2.5">
              <Skeleton height={48} />
              <Skeleton height={48} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton width={72} height={20} />
            <div className="flex items-center gap-4">
              <Skeleton width={40} height={40} />
              <Skeleton width={96} height={32} />
              <Skeleton width={40} height={40} />
            </div>
          </div>
          <Skeleton height={48} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 border border-background-second/60 bg-background p-2.5"
              >
                <Skeleton width={32} height={32} className="shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton width={120} height={14} className="max-w-full" />
                  <Skeleton height={14} />
                  <Skeleton width={160} height={14} className="max-w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-4 border-t border-background-second/60 pt-6 lg:pt-8">
      <Skeleton width={180} height={28} />
      <ProductCardsSkeleton
        count={4}
        className="grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      />
    </div>
  </main>
);

export default DetailLoading;
