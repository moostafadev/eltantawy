import { Skeleton } from "@/components/skeleton";
import ProductCardsSkeleton from "@/features/client/product-card/ProductCardsSkeleton";

/**
 * Skeleton for the products grid + pagination area. Used as the Suspense
 * fallback while the filtered products are being fetched on the server
 * during category/page navigation.
 */
const ProductsGridSkeleton = () => (
  <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
    <ProductCardsSkeleton count={12} />

    <div className="flex items-center justify-center gap-4">
      <Skeleton width={80} height={38} />
      <Skeleton width={120} height={16} />
      <Skeleton width={80} height={38} />
    </div>
  </div>
);

export default ProductsGridSkeleton;
