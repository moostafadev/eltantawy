import { Skeleton } from "@/components/skeleton";

const ProductCards = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="flex min-w-0 flex-col overflow-hidden border border-border bg-background"
      >
        <Skeleton aspectRatio={1} />
        <div className="flex flex-col gap-2 p-2 lg:p-3">
          <Skeleton width={140} height={18} className="max-w-full" />
          <Skeleton width={80} height={14} className="max-w-full" />
          <Skeleton width={100} height={18} className="max-w-full" />
        </div>
      </div>
    ))}
  </div>
);

const PageTitle = ({ width = 180 }: { width?: number }) => (
  <div className="flex flex-col gap-2">
    <Skeleton width={width} height={28} className="max-w-full" />
    <Skeleton width={300} height={16} className="max-w-full" />
  </div>
);

const AdminBreadcrumb = () => (
  <div className="flex items-center gap-2">
    <Skeleton width={72} height={14} />
    <Skeleton width={12} height={14} />
    <Skeleton width={96} height={14} />
  </div>
);

const AdminPageHeader = ({ action = false }: { action?: boolean }) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <PageTitle />
    {action && <Skeleton width={120} height={36} />}
  </div>
);

export const ClientCatalogLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container py-6 lg:py-8"
  >
    <div className="flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <Skeleton width={48} height={48} />
        <Skeleton width={220} height={32} className="max-w-full" />
        <Skeleton width={440} height={18} className="max-w-full" />
      </header>
      <ProductCards />
    </div>
  </main>
);

export const ClientCategoriesLoading = () => (
  <main role="status" aria-label="جاري تحميل الصفحة" className="flex flex-col">
    <div className="container pt-6 lg:pt-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Skeleton width={48} height={48} />
          <div className="flex flex-col gap-2">
            <Skeleton width={150} height={24} />
            <Skeleton width={300} height={16} className="max-w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton width={90} height={30} />
          <Skeleton width={90} height={30} />
        </div>
      </header>
    </div>
    <div className="bg-background">
      <div className="container flex gap-2 overflow-hidden py-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} width={110} height={36} className="shrink-0" />
        ))}
      </div>
    </div>
    <div className="container flex flex-col gap-10 py-8 lg:gap-14 lg:py-10">
      {Array.from({ length: 3 }).map((_, index) => (
        <section key={index} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Skeleton width={52} height={52} className="shrink-0" />
            <div className="flex flex-col gap-2">
              <Skeleton width={150} height={20} />
              <Skeleton width={90} height={14} />
            </div>
          </div>
          <ProductCards count={4} />
        </section>
      ))}
    </div>
  </main>
);

export const ClientProductLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8"
  >
    <AdminBreadcrumb />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
      <Skeleton aspectRatio={1} className="w-full" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton width={100} height={14} />
          <Skeleton width={240} height={32} className="max-w-full" />
          <Skeleton width={70} height={16} />
        </div>
        <Skeleton width={120} height={24} />
        <Skeleton height={16} count={3} />
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <Skeleton height={44} />
          <Skeleton height={44} />
          <Skeleton width={160} height={44} />
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <Skeleton width={180} height={26} />
      <ProductCards count={4} />
    </div>
  </main>
);

export const ClientCartLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container">
      <div className="flex flex-col gap-4">
        <Skeleton width={40} height={40} />
        <div className="grid gap-3 lg:grid-cols-[1fr_360px] lg:gap-4">
          <section className="flex h-fit flex-col border border-border bg-background px-3 lg:px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-border py-4 last:border-0"
              >
                <Skeleton width={88} height={88} className="shrink-0" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton width={170} height={18} className="max-w-full" />
                  <Skeleton width={90} height={14} />
                  <Skeleton width={110} height={16} />
                </div>
              </div>
            ))}
          </section>
          <CartSummaryLoading />
        </div>
      </div>
    </div>
  </main>
);

const CartSummaryLoading = () => (
  <aside className="flex h-fit flex-col gap-4 border border-border bg-background p-3 lg:p-4">
    <Skeleton width={110} height={22} />
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex justify-between gap-4">
        <Skeleton width={90} height={15} />
        <Skeleton width={75} height={15} />
      </div>
    ))}
    <Skeleton height={42} />
    <Skeleton height={42} />
  </aside>
);

export const ClientCheckoutLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container flex flex-col gap-4">
      <AdminBreadcrumb />
      <div className="grid gap-3 lg:grid-cols-[1fr_360px] lg:gap-4">
        <section className="flex flex-col gap-4 border border-border bg-background p-4 lg:p-6">
          <Skeleton width={180} height={24} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton width={90} height={14} />
                <Skeleton height={44} />
              </div>
            ))}
          </div>
          <Skeleton height={48} />
        </section>
        <CartSummaryLoading />
      </div>
    </div>
  </main>
);

export const ClientProfileLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container flex flex-col gap-4">
      <PageTitle width={190} />
      <section className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
        <div className="flex items-center gap-4 border-b border-background-second/60 p-3 lg:p-4">
          <Skeleton width={64} height={64} className="shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton width={180} height={24} />
            <Skeleton width={120} height={16} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b border-background-second/60 p-3 sm:odd:border-l lg:p-4"
            >
              <Skeleton width={90} height={14} />
              <Skeleton width={150} height={18} />
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3 border border-background-second/60 bg-background p-3 lg:p-4">
        <Skeleton width={150} height={20} />
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} height={54} />
        ))}
      </section>
    </div>
  </div>
);

export const ClientOrdersLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container flex flex-col gap-4">
      <AdminBreadcrumb />
      <PageTitle width={150} />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border border-border bg-background p-3 sm:flex-row sm:items-center lg:p-4"
          >
            <Skeleton width={56} height={56} className="shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton width={180} height={18} className="max-w-full" />
              <Skeleton width={130} height={14} />
            </div>
            <Skeleton width={100} height={28} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ClientOffersLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8"
  >
    <header className="flex flex-col items-center gap-2 text-center">
      <Skeleton width={48} height={48} />
      <Skeleton width={220} height={32} className="max-w-full" />
      <Skeleton width={440} height={18} className="max-w-full" />
    </header>
    <Skeleton height={140} className="w-full" />
    <div className="flex flex-col gap-4">
      <Skeleton width={260} height={24} className="max-w-full" />
      <ProductCards />
    </div>
  </main>
);

export const AdminTableLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
  >
    <AdminPageHeader action />
    <section className="overflow-hidden border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3 lg:p-4">
        <Skeleton width={220} height={38} className="max-w-full" />
        <Skeleton width={120} height={36} />
      </div>
      <div className="overflow-hidden p-3 lg:p-4">
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
      <div className="flex justify-end gap-2 border-t border-border p-3">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </section>
  </div>
);

export const AdminFormLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
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

export const AdminDetailLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
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

export const AdminCategoryDetailLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
  >
    <AdminDetailLoading />
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

export const AdminRecordLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
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

export const AdminOrderLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
  >
    <AdminBreadcrumb />
    <AdminPageHeader action />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
      <section className="h-fit overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <Skeleton width={120} height={18} />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-b border-background-second/60 p-3 lg:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton width={190} height={18} className="max-w-full" />
                <Skeleton width={260} height={14} className="max-w-full" />
              </div>
              <Skeleton width={90} height={20} />
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-3 border border-border bg-background p-3 lg:p-4">
        <Skeleton width={150} height={20} />
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between gap-3 border-b border-border/60 py-2"
          >
            <Skeleton width={90} height={14} />
            <Skeleton width={120} height={14} />
          </div>
        ))}
        <Skeleton height={40} />
        <Skeleton height={40} />
      </section>
    </div>
  </div>
);

export const AdminUserLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
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

export const AdminSettingsLoading = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-col gap-3 lg:gap-4"
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
