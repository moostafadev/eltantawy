import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

/**
 * Route-level loading shown on first visit to `/products`.
 * Mirrors the real page structure: header + scrollable category filter +
 * grid + pagination. The category filter scrolls horizontally on mobile
 * (matching the real component) and wraps on larger screens.
 */
const CatalogLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container py-6 lg:py-8"
  >
    <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
      {/* Header */}
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

      {/* Category filter — same structure as the real one */}
      <section className="flex min-w-0 flex-col gap-3 border-y border-background-second/60 py-4">
        <div className="flex items-center gap-2">
          <Skeleton width={14} height={14} />
          <Skeleton width={120} height={14} />
        </div>

        <div className="scrollbar-hide -mx-4 min-w-0 overflow-x-hidden px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max min-w-full items-center gap-2 sm:w-auto sm:flex-wrap">
            {[70, 90, 110, 85, 95, 90].map((w, i) => (
              <Skeleton key={i} width={w} height={34} className="shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <ProductCardsSkeleton count={12} />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <Skeleton width={80} height={38} />
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={38} />
      </div>
    </div>
  </main>
);

export default CatalogLoading;
