import { Skeleton } from "@/components/skeleton";

interface ProductCardsSkeletonProps {
  count?: number;
  className?: string;
}

const ProductCardSkeleton = () => (
  <div className="flex min-w-0 flex-col overflow-hidden border border-border bg-background shadow-sm">
    <div className="relative aspect-square w-full overflow-hidden bg-muted">
      <Skeleton aspectRatio={1} />
      <Skeleton width={40} height={24} className="absolute right-2 top-2" />
      <Skeleton
        width={28}
        height={28}
        className="absolute bottom-2 left-2 lg:hidden"
      />
      <Skeleton
        width={32}
        height={32}
        className="absolute bottom-2 left-2 hidden lg:block"
      />
    </div>
    <div className="flex flex-1 flex-col gap-1 p-2 lg:gap-2 lg:p-3">
      <div className="min-w-0 flex flex-col gap-0.5 lg:gap-1.5">
        <div className="w-3/4 lg:hidden">
          <Skeleton height={24} />
        </div>
        <div className="hidden w-3/4 lg:block">
          <Skeleton height={28} />
        </div>
        <Skeleton width={48} height={16} />
      </div>
      <div className="flex flex-wrap items-baseline gap-1 lg:gap-2">
        <Skeleton width={90} height={24} />
        <Skeleton width={70} height={16} />
      </div>
    </div>
  </div>
);

const ProductCardsSkeleton = ({
  count = 8,
  className = "grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5",
}: ProductCardsSkeletonProps) => (
  <div className={`grid ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export default ProductCardsSkeleton;
