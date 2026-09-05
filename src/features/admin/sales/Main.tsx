import {
  Package,
  PercentCircle,
  ReceiptText,
  RotateCcw,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Table } from "@/components/table";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import { COLOR } from "@/constants/types";

import { getStatColorClasses } from "../statColors";
import {
  getMonthlySales,
  getSalesSummary,
  getTopProducts,
} from "./sales.service";
import { buildMonthlyRows } from "./lib";
import MonthlyCards from "./MonthlyCards";
import { monthlyTableColumns } from "./MonthlyTableColumns";
import { topProductsColumns } from "./TopProductsColumns";

const Sales = async () => {
  const [summary, monthlySales, topProducts] = await Promise.all([
    getSalesSummary(),
    getMonthlySales(),
    getTopProducts(),
  ]);

  const monthlyRows = buildMonthlyRows(monthlySales);

  const mainStats: {
    title: string;
    value: string;
    icon: typeof Wallet;
    description: string;
    color: COLOR;
  }[] = [
    {
      title: "صافي المبيعات",
      value: `${toArabicNums(String(summary.totalSales))} ج.م`,
      icon: Wallet,
      description: "من الطلبات المكتملة بعد خصم المرتجعات",
      color: "SUCCESS",
    },
    {
      title: "الطلبات المكتملة",
      value: toArabicNums(summary.deliveredOrdersCount),
      icon: Package,
      description: "إجمالي الطلبات التي تم توصيلها",
      color: "INFO",
    },
    {
      title: "متوسط قيمة الطلب",
      value: `${toArabicNums(String(Math.round(summary.averageOrderValue)))} ج.م`,
      icon: TrendingUp,
      description: "متوسط قيمة الطلب الواحد المكتمل",
      color: "MAIN",
    },
    {
      title: "قيمة المرتجعات",
      value: `${toArabicNums(String(summary.totalReturnsAmount))} ج.م`,
      icon: RotateCcw,
      description: "إجمالي المبالغ المستردة فعليًا",
      color: "DANGER",
    },
  ];

  const returnsBreakdown: {
    label: string;
    value: number;
    color: "WARNING" | "INFO" | "SUCCESS" | "DANGER";
  }[] = [
    {
      label: "قيد المراجعة",
      value: summary.pendingReturnsCount,
      color: "WARNING",
    },
    {
      label: "تمت الموافقة",
      value: summary.approvedReturnsCount,
      color: "INFO",
    },
    {
      label: "تم الاسترجاع",
      value: summary.refundedReturnsCount,
      color: "SUCCESS",
    },
    { label: "مرفوض", value: summary.rejectedReturnsCount, color: "DANGER" },
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">المبيعات</h1>

        <p className="text-sm text-muted-foreground">
          نظرة شاملة على أداء المبيعات والمرتجعات
        </p>
      </div>

      {/* Main Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {mainStats.map(({ title, value, icon: Icon, description, color }) => {
          const styles = getStatColorClasses(color);

          return (
            <div
              key={title}
              className={`group relative overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:p-5 ${styles.hoverBorder} ${styles.hoverShadow}`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between gap-3 lg:gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {title}
                  </p>

                  <p className="text-2xl font-bold tracking-tight tabular-nums lg:text-3xl">
                    {value}
                  </p>

                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>

                <div
                  className={`flex size-12 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg} ${styles.iconText}`}
                >
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Monthly Sales Cards */}
        <section className="flex flex-col gap-4 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
            <div>
              <h2 className="font-bold">المبيعات الشهرية</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                صافي المبيعات ونسبة التغيير خلال آخر 6 أشهر
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center bg-success/10 text-success">
              <ReceiptText className="size-5" />
            </div>
          </div>

          <MonthlyCards data={monthlyRows} />
        </section>

        {/* Returns Breakdown */}
        <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
            <div>
              <h2 className="font-bold">حالة المرتجعات</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {toArabicNums(summary.returnsRequestsCount)} طلب إرجاع إجمالًا
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center bg-danger/10 text-danger">
              <PercentCircle className="size-5" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {returnsBreakdown.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 bg-muted p-2.5"
              >
                <span className="text-sm text-muted-foreground">{label}</span>

                <Tag color={color} variant="soft" size="sm">
                  {toArabicNums(value)}
                </Tag>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Monthly Sales Detail Table */}
      <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">تفاصيل المبيعات الشهرية</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            صافي كل شهر ونسبة تغيّره عن الشهر السابق
          </p>
        </div>

        <Table
          data={monthlyRows}
          columns={monthlyTableColumns}
          emptyMessage="لا توجد بيانات مبيعات بعد"
        />
      </section>

      {/* Top Products */}
      <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">الأكثر مبيعًا</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            أفضل المنتجات من حيث إجمالي المبيعات (طلبات مكتملة فقط)
          </p>
        </div>

        <Table
          data={topProducts}
          columns={topProductsColumns}
          emptyMessage="لا توجد بيانات مبيعات بعد"
        />
      </section>
    </div>
  );
};

export default Sales;
