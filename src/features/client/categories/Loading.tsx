import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

const CategoriesLoading = () => (
  <main role="status" aria-label="جاري تحميل الصفحة" className="flex flex-col">
    <div className="container pt-6 lg:pt-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Skeleton width={44} height={44} className="shrink-0 lg:hidden" />
          <Skeleton
            width={48}
            height={48}
            className="hidden shrink-0 lg:block"
          />
          <div className="flex flex-col gap-2">
            <Skeleton width={100} height={28} className="lg:hidden" />
            <Skeleton width={110} height={32} className="hidden lg:block" />
            <Skeleton width={200} height={20} className="max-w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton width={100} height={30} />
          <Skeleton width={90} height={30} />
        </div>
      </header>
    </div>
    <div className="sticky top-0 z-20 bg-background/50 backdrop-blur-sm lg:top-16">
      <div className="container">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              width={110}
              height={36}
              className="shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
    <div className="container flex flex-col gap-10 py-8 lg:gap-14 lg:py-10">
      {Array.from({ length: 3 }).map((_, index) => (
        <section key={index} className="flex flex-col">
          <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-3 lg:mb-5">
            <div className="flex items-center gap-2.5">
              <Skeleton width={36} height={36} className="lg:hidden" />
              <Skeleton width={40} height={40} className="hidden lg:block" />
              <Skeleton width={120} height={28} className="lg:hidden" />
              <Skeleton width={130} height={32} className="hidden lg:block" />
            </div>
            <Skeleton width={56} height={16} />
          </div>
          <ProductCardsSkeleton
            count={8}
            className="grid-cols-2 gap-3 lg:grid-cols-4"
          />
        </section>
      ))}
    </div>
  </main>
);

export default CategoriesLoading;
