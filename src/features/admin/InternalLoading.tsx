import { Skeleton } from "@/components/skeleton";
import { Table } from "@/components/table";
import { productsTableColumns } from "@/features/admin/products/table/ProductsTableColumns";

type RecordKind = "product" | "category" | "delivery" | "discount";
type FormKind = "product" | "category" | "delivery" | "discount";

const BreadcrumbSkeleton = ({ count = 2 }: { count?: number }) => (
  <div className="scrollbar-hide flex min-w-0 items-center gap-1.5 overflow-hidden">
    {Array.from({ length: count + 1 }).map((_, index) => (
      <div key={index} className="flex shrink-0 items-center gap-1.5">
        {index > 0 && <Skeleton width={16} height={16} />}
        <Skeleton width={index === 0 ? 36 : index === count ? 100 : 84} height={20} />
      </div>
    ))}
  </div>
);

const PageHeadingSkeleton = ({
  titleWidth,
  descriptionWidth = 220,
  action = false,
}: {
  titleWidth: number;
  descriptionWidth?: number;
  action?: boolean;
}) => (
  <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
    <div className="min-w-0">
      <Skeleton width={titleWidth} height={32} className="max-w-full" />
      <Skeleton
        width={descriptionWidth}
        height={20}
        className="mt-1 max-w-full"
      />
    </div>
    {action && <Skeleton width={132} height={36} className="mr-auto self-end" />}
  </div>
);

const RecordSectionHeading = ({
  titleWidth = 150,
  descriptionWidth = 220,
}: {
  titleWidth?: number;
  descriptionWidth?: number;
}) => (
  <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
    <Skeleton width={titleWidth} height={20} />
    <Skeleton
      width={descriptionWidth}
      height={16}
      className="mt-1 max-w-full"
    />
  </div>
);

const RecordFields = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="flex min-w-0 flex-col gap-1.5 border-b border-background-second/60 p-3 lg:p-4"
      >
        <Skeleton width={92} height={16} />
        <Skeleton
          width={index === 0 ? 180 : 124}
          height={20}
          className="max-w-full"
        />
      </div>
    ))}
  </div>
);

const DescriptionField = () => (
  <div className="flex min-h-24 flex-col gap-1.5 border-b border-background-second/60 p-3 sm:col-span-2 lg:p-4">
    <Skeleton width={56} height={16} />
    <Skeleton height={20} />
    <Skeleton height={20} className="w-4/5" />
  </div>
);

const ImagePanel = ({ category = false }: { category?: boolean }) => (
  <section className="min-w-0 overflow-hidden border border-background-second bg-background shadow-sm">
    <RecordSectionHeading
      titleWidth={category ? 110 : 100}
      descriptionWidth={category ? 190 : 180}
    />
    <div className="flex min-h-64 items-center justify-center p-4 lg:min-h-full lg:p-6">
      <Skeleton
        height={category ? 256 : 224}
        className="w-full max-w-full lg:h-72"
      />
    </div>
  </section>
);

const TreePanel = ({ titleWidth = 160 }: { titleWidth?: number }) => (
  <section className="min-w-0 flex-1 overflow-hidden border border-background-second bg-background shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-background-second bg-muted/30 p-3 lg:p-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        <Skeleton width={titleWidth} height={20} />
        <Skeleton width={220} height={16} className="max-w-full" />
      </div>
      <Skeleton width={36} height={36} className="mr-auto shrink-0" />
    </div>
    <div className="h-64 overflow-hidden p-4 sm:h-72 lg:h-80 lg:p-8">
      <div className="flex h-full items-start justify-center">
        <div className="flex min-w-36 flex-col items-center gap-3 border border-border p-3">
          <Skeleton width={112} height={32} />
          <div className="flex gap-2">
            <Skeleton width={76} height={28} />
            <Skeleton width={76} height={28} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const AdminRecordPageLoading = ({
  kind,
}: {
  kind: RecordKind;
}) => {
  const config = {
    product: {
      breadcrumbCount: 2,
      titleWidth: 180,
      fields: 7,
      graph: true,
      image: true,
      description: true,
    },
    category: {
      breadcrumbCount: 2,
      titleWidth: 180,
      fields: 3,
      graph: true,
      image: true,
      description: true,
    },
    delivery: {
      breadcrumbCount: 3,
      titleWidth: 180,
      fields: 6,
      graph: true,
      image: false,
      description: false,
    },
    discount: {
      breadcrumbCount: 3,
      titleWidth: 140,
      fields: 11,
      graph: false,
      image: false,
      description: false,
    },
  }[kind];

  const hasSidePanel = config.image;

  return (
    <div
      role="status"
      aria-label="جاري تحميل الصفحة"
      className="flex min-w-0 flex-col gap-3 lg:gap-4"
    >
      <BreadcrumbSkeleton count={config.breadcrumbCount} />
      <PageHeadingSkeleton
        titleWidth={config.titleWidth}
        action
        descriptionWidth={200}
      />
      <div
        className={`grid min-w-0 grid-cols-1 gap-3 lg:gap-4 ${
          hasSidePanel ? "lg:grid-cols-[minmax(0,1fr)_24rem]" : ""
        }`}
      >
        <section className="min-w-0 overflow-hidden border border-background-second bg-background shadow-sm">
          <RecordSectionHeading titleWidth={145} descriptionWidth={215} />
          <RecordFields count={config.fields} />
          {config.description && <DescriptionField />}
          {kind === "product" && (
            <div className="flex flex-col gap-2 border-b border-background-second/60 p-3 sm:col-span-2 lg:p-4">
              <Skeleton width={92} height={16} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </div>
          )}
        </section>
        {config.image && <ImagePanel category={kind === "category"} />}
      </div>
      {kind === "category" && (
        <section className="flex min-w-0 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="border-b border-border pb-3 lg:pb-4">
            <Skeleton width={120} height={24} />
            <Skeleton width={230} height={20} className="mt-1 max-w-full" />
          </div>
          <Table
            data={[]}
            columns={productsTableColumns}
            loading
            loadingRows={5}
          />
        </section>
      )}
      {config.graph && (
        <TreePanel titleWidth={kind === "delivery" ? 190 : 150} />
      )}
    </div>
  );
};

const FormFieldSkeleton = ({
  labelWidth = 110,
  height = 42,
}: {
  labelWidth?: number;
  height?: number;
}) => (
  <div className="flex min-w-0 flex-col gap-2">
    <Skeleton width={labelWidth} height={16} className="max-w-full" />
    <Skeleton height={height} />
  </div>
);

const FormCard = ({
  kind,
  edit,
}: {
  kind: FormKind;
  edit: boolean;
}) => {
  if (kind === "product") {
    return (
      <section
        className={`flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4 ${
          edit ? "lg:max-w-96" : ""
        }`}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <FormFieldSkeleton
            key={index}
            labelWidth={[72, 100, 58, 60, 82, 75, 76, 72, 85][index]}
            height={index === 3 ? 88 : 42}
          />
        ))}
        <div className="flex flex-col gap-1">
          <Skeleton width={190} height={16} />
          <Skeleton width={270} height={16} className="max-w-full" />
        </div>
        <FormFieldSkeleton labelWidth={60} />
        <FormFieldSkeleton labelWidth={78} />
        <Skeleton width={130} height={40} className="mr-auto" />
      </section>
    );
  }

  if (kind === "category") {
    return (
      <section className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4">
        <FormFieldSkeleton labelWidth={100} />
        <FormFieldSkeleton labelWidth={100} />
        <FormFieldSkeleton labelWidth={54} />
        <div className="flex flex-col gap-3">
          <FormFieldSkeleton labelWidth={150} height={20} />
          <FormFieldSkeleton labelWidth={46} height={88} />
        </div>
        <Skeleton width={140} height={40} className="mr-auto" />
      </section>
    );
  }

  if (kind === "delivery") {
    return (
      <section className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4">
        <FormFieldSkeleton labelWidth={98} />
        <FormFieldSkeleton labelWidth={92} />
        <FormFieldSkeleton labelWidth={150} />
        <FormFieldSkeleton labelWidth={95} height={24} />
        <Skeleton width={140} height={40} className="mr-auto" />
      </section>
    );
  }

  return (
    <section className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4">
      {edit && <Skeleton width={110} height={24} />}
      {Array.from({ length: 7 }).map((_, index) => (
        <FormFieldSkeleton key={index} />
      ))}
      <div className="grid grid-cols-2 gap-2">
        <FormFieldSkeleton labelWidth={76} />
        <FormFieldSkeleton labelWidth={76} />
      </div>
      <FormFieldSkeleton labelWidth={100} height={24} />
      <Skeleton width={140} height={40} className="mr-auto" />
    </section>
  );
};

export const AdminFormPageLoading = ({
  kind,
  edit = false,
  breadcrumbCount = edit ? 3 : 2,
  outerCard = false,
}: {
  kind: FormKind;
  edit?: boolean;
  breadcrumbCount?: number;
  outerCard?: boolean;
}) => {
  const titleWidth = {
    product: edit ? 130 : 135,
    category: edit ? 140 : 135,
    delivery: edit ? 200 : 145,
    discount: edit ? 130 : 135,
  }[kind];
  const descriptionWidth = {
    product: edit ? 145 : 200,
    category: edit ? 145 : 200,
    delivery: edit ? 160 : 200,
    discount: edit ? 135 : 200,
  }[kind];
  const hasGraph = kind !== "discount";

  const content = (
    <div
      className={`flex min-w-0 flex-col gap-3 lg:gap-4 ${
        hasGraph ? "lg:flex-row" : ""
      }`}
    >
      <FormCard kind={kind} edit={edit} />
      {hasGraph && <TreePanel />}
    </div>
  );

  return (
    <div
      role="status"
      aria-label="جاري تحميل الصفحة"
      className="flex min-w-0 flex-col gap-3 lg:gap-4"
    >
      <BreadcrumbSkeleton count={breadcrumbCount} />
      <PageHeadingSkeleton
        titleWidth={titleWidth}
        descriptionWidth={descriptionWidth}
      />
      {outerCard ? (
        <div className="border border-background-second bg-background p-3 shadow-sm md:p-4 lg:p-6">
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
};
