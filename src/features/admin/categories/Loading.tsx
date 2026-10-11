import { Skeleton } from "@/components/skeleton";
import ProductDetailLoading from "@/features/admin/products/Loading";

const CategoryDetailLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <ProductDetailLoading />
    <section className="flex flex-col gap-3 border border-border bg-background p-3 lg:p-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex flex-col gap-2">
          <Skeleton width={150} height={18} />
          <Skeleton width={220} height={14} />
        </div>
        <Skeleton width={100} height={32} />
      </div>
      <Skeleton height={240} />
    </section>
  </div>
);

export default CategoryDetailLoading;
