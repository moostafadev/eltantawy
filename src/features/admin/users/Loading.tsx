import { Skeleton } from "@/components/skeleton";
import {
  AdminBreadcrumb,
  PageTitle,
} from "@/features/admin/Loading";

const UserLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <PageTitle width={190} />
    <section className="flex flex-col gap-3 border border-border bg-background p-3 lg:p-4">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Skeleton width={56} height={56} className="shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton width={180} height={20} />
          <Skeleton width={130} height={14} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border border-border p-3"
          >
            <Skeleton width={100} height={14} />
            <Skeleton width={80} height={24} />
          </div>
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <section
          key={index}
          className="flex flex-col gap-3 border-t border-border pt-3"
        >
          <Skeleton width={130} height={20} />
          {Array.from({ length: 3 }).map((_, row) => (
            <div
              key={row}
              className="flex items-center gap-3 border-b border-border/60 py-2"
            >
              <Skeleton width={50} height={34} className="shrink-0" />
              <Skeleton height={16} className="flex-1" />
              <Skeleton width={80} height={16} className="shrink-0" />
            </div>
          ))}
        </section>
      ))}
    </section>
  </div>
);

export default UserLoading;
