import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

const CatalogLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container py-6 lg:py-8"
  >
    <div className="flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <Skeleton width={48} height={48} />
        <Skeleton width={220} height={32} className="max-w-full lg:hidden" />
        <Skeleton
          width={230}
          height={36}
          className="hidden max-w-full lg:block"
        />
        <Skeleton width={440} height={20} className="max-w-full lg:hidden" />
        <Skeleton
          width={440}
          height={24}
          className="hidden max-w-full lg:block"
        />
      </header>
      <ProductCardsSkeleton count={24} />
    </div>
  </main>
);

export default CatalogLoading;
