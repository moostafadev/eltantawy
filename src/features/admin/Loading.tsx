import type { ReactNode } from "react";
import { Skeleton } from "@/components/skeleton";

export const PageTitle = ({
  width = 180,
  descriptionWidth = 300,
}: {
  width?: number;
  descriptionWidth?: number;
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <Skeleton width={width} height={32} className="max-w-full" />
    <Skeleton width={descriptionWidth} height={20} className="max-w-full" />
  </div>
);

export const AdminBreadcrumb = ({ count = 2 }: { count?: number } = {}) => (
  <div className="scrollbar-hide flex min-w-0 items-center gap-1.5 overflow-hidden">
    {Array.from({ length: count + 1 }).map((_, index) => (
      <div key={index} className="flex shrink-0 items-center gap-1.5">
        {index > 0 && <Skeleton width={16} height={16} />}
        <Skeleton
          width={index === 0 ? 36 : index === count ? 100 : 84}
          height={20}
        />
      </div>
    ))}
  </div>
);

export const AdminPageHeader = ({
  action = false,
  actionHeight = 36,
  titleWidth,
  descriptionWidth,
}: {
  action?: boolean;
  actionHeight?: number;
  titleWidth?: number;
  descriptionWidth?: number;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <PageTitle width={titleWidth} descriptionWidth={descriptionWidth} />
    {action && <Skeleton width={120} height={actionHeight} className="self-end" />}
  </div>
);

export const AdminListPageLoading = ({
  children,
  breadcrumb = false,
  action = false,
  actionHeight = 32,
  titleWidth = 150,
  descriptionWidth = 240,
}: {
  children: ReactNode;
  breadcrumb?: boolean;
  action?: boolean;
  actionHeight?: number;
  titleWidth?: number;
  descriptionWidth?: number;
}) => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    {breadcrumb && <AdminBreadcrumb />}
    <AdminPageHeader
      action={action}
      actionHeight={actionHeight}
      titleWidth={titleWidth}
      descriptionWidth={descriptionWidth}
    />
    {children}
  </div>
);

export const AdminTableLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminPageHeader action />
    <section className="min-w-0 overflow-hidden border border-border bg-background">
      <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:p-4">
        <Skeleton width={220} height={38} className="max-w-full" />
        <Skeleton width={120} height={36} className="max-w-full" />
      </div>
      <div className="p-2 sm:p-3 lg:p-4">
        <div className="flex flex-col gap-2 sm:hidden">
          {Array.from({ length: 5 }).map((_, row) => (
            <div
              key={row}
              className="flex min-w-0 flex-col gap-3 border border-border/60 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton width={36} height={36} className="shrink-0" />
                <Skeleton height={16} className="min-w-0 flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/60 pt-3">
                {Array.from({ length: 4 }).map((_, col) => (
                  <div key={col} className="flex min-w-0 flex-col gap-1.5">
                    <Skeleton width={64} height={10} />
                    <Skeleton height={13} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
          <div className="min-w-120">
            <div className="flex gap-3 border-b border-border bg-muted/50 p-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={16} className="flex-1" />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, row) => (
              <div
                key={row}
                className="flex items-center gap-3 border-b border-border/60 p-3 last:border-0"
              >
                {Array.from({ length: 5 }).map((_, col) => (
                  <Skeleton
                    key={col}
                    width={col === 0 ? 120 : undefined}
                    height={col === 0 ? 34 : 16}
                    className={col === 0 ? "shrink-0" : "flex-1"}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 border-t border-border p-3 sm:justify-end">
        <Skeleton width={80} height={32} className="max-w-full" />
        <Skeleton width={80} height={32} className="max-w-full" />
      </div>
    </section>
  </div>
);

export const AdminFormLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <AdminPageHeader />
    <section className="flex flex-col gap-4 border border-border bg-background p-3 lg:gap-5 lg:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 ${index > 3 ? "sm:col-span-2" : ""}`}
          >
            <Skeleton width={110} height={14} />
            <Skeleton height={42} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
        <Skeleton width={100} height={40} />
        <Skeleton width={110} height={40} />
      </div>
    </section>
  </div>
);
