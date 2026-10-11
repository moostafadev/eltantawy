import { Skeleton } from "@/components/skeleton";
import {
  AdminBreadcrumb,
  AdminPageHeader,
} from "@/features/admin/Loading";

export const SettingRecordLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <AdminPageHeader action />
    <section className="overflow-hidden border border-background-second bg-background shadow-sm">
      <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
        <Skeleton width={150} height={18} />
        <Skeleton width={240} height={14} className="mt-2 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-b border-background-second/60 p-3 lg:p-4"
          >
            <Skeleton width={100} height={14} />
            <Skeleton width={160} height={18} className="max-w-full" />
          </div>
        ))}
      </div>
    </section>
    <section className="flex flex-col gap-3 border border-border bg-background p-3 lg:p-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Skeleton width={160} height={18} />
        <Skeleton width={100} height={32} />
      </div>
      <Skeleton height={220} />
    </section>
  </div>
);

export const AdminSettingsLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminPageHeader />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border border-background-second bg-background p-3 lg:p-4"
        >
          <Skeleton width={44} height={44} className="shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton width={120} height={18} />
            <Skeleton width={210} height={14} className="max-w-full" />
          </div>
          <Skeleton width={16} height={16} className="shrink-0" />
        </div>
      ))}
    </div>
  </div>
);
