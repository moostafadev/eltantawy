import { Skeleton } from "@/components/skeleton";
import {
  AdminBreadcrumb,
  AdminPageHeader,
} from "@/features/admin/Loading";

const ProductDetailLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <AdminPageHeader action />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
      <section className="overflow-hidden border border-border bg-background">
        <div className="border-b border-border bg-muted/30 p-3 lg:p-4">
          <Skeleton width={150} height={18} />
          <Skeleton width={220} height={14} className="mt-2 max-w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-border/60 p-3 lg:p-4"
            >
              <Skeleton width={90} height={14} />
              <Skeleton width={150} height={18} className="max-w-full" />
            </div>
          ))}
        </div>
      </section>
      <section className="flex min-h-64 flex-col gap-3 border border-border bg-background p-3 lg:p-4">
        <Skeleton width={140} height={18} />
        <Skeleton aspectRatio={1} />
      </section>
    </div>
  </div>
);

export default ProductDetailLoading;
