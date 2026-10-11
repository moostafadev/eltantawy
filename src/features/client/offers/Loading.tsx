import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

const OffersLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8"
  >
    <header className="flex flex-col items-center gap-2 text-center">
      <Skeleton width={48} height={48} />
      <Skeleton width={220} height={32} className="max-w-full lg:hidden" />
      <Skeleton
        width={230}
        height={36}
        className="hidden max-w-full lg:block"
      />
      <div className="flex flex-col items-center sm:hidden">
        <Skeleton width={300} height={20} />
        <Skeleton width={180} height={20} />
      </div>
      <Skeleton
        width={440}
        height={24}
        className="hidden max-w-full sm:block"
      />
    </header>
    <div className="flex flex-col gap-4">
      <Skeleton width={260} height={28} className="max-w-full" />
      <ProductCardsSkeleton />
    </div>
  </main>
);

export default OffersLoading;
