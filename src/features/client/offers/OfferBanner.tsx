import { BadgePercent } from "lucide-react";

interface Props {
  type: "ALL_CUSTOMERS" | "REGISTERED_ONLY";
  valueType: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmount: number | null;
}

const discountTypeLabels: Record<Props["type"], string> = {
  ALL_CUSTOMERS: "جميع العملاء",
  REGISTERED_ONLY: "العملاء المسجلين",
};

/**
 * بانر يعرض الخصم التلقائي الحالي المفعّل على الموقع (لو موجود)،
 * بيُستخدم أعلى صفحة العروض
 */
const OfferBanner = ({ type, valueType, value, minOrderAmount }: Props) => {
  const valueLabel = valueType === "PERCENTAGE" ? `${value}%` : `${value} ج.م`;

  return (
    <div className="relative overflow-hidden border border-main/20 bg-main/5 p-5 lg:p-8">
      <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-main/10 blur-2xl" />

      <div className="relative flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center bg-main/10 text-main">
          <BadgePercent className="size-7" />
        </div>

        <h2 className="text-2xl font-bold lg:text-3xl">
          خصم {valueLabel} على {discountTypeLabels[type]}
        </h2>

        <p className="text-sm text-muted-foreground lg:text-base">
          {type === "REGISTERED_ONLY"
            ? "سجّل الدخول قبل إتمام الطلب ليُطبّق الخصم تلقائيًا على سلتك"
            : "يُطبّق الخصم تلقائيًا على سلتك عند إتمام الطلب، دون الحاجة إلى كود"}
          {minOrderAmount ? ` (بحد أدنى ${minOrderAmount} ج.م للطلب)` : ""}
        </p>
      </div>
    </div>
  );
};

export default OfferBanner;
