import {
  Package,
  PercentCircle,
  ReceiptText,
  RotateCcw,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { toArabicNums } from "@/utils/toArabicNums";
import { COLOR } from "@/constants/types";
import {
  ChartCard,
  LineChart,
  DonutChart,
  BarChart,
  DonutChartDataPoint,
} from "@/components/charts";

import { getStatColorClasses } from "../statColors";
import {
  getMonthlySales,
  getSalesSummary,
  getTopProducts,
} from "./sales.service";

const Sales = async () => {
  const [summary, monthlySales, topProducts] = await Promise.all([
    getSalesSummary(),
    getMonthlySales(),
    getTopProducts(),
  ]);

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

  /*
   * بيانات الرسم البياني الدائري لتوزيع حالات المرتجعات
   */
  const returnsChartData: DonutChartDataPoint[] = (
    [
      {
        label: "قيد المراجعة",
        value: summary.pendingReturnsCount,
        color: "WARNING" as COLOR,
      },
      {
        label: "تمت الموافقة",
        value: summary.approvedReturnsCount,
        color: "INFO" as COLOR,
      },
      {
        label: "تم الاسترجاع",
        value: summary.refundedReturnsCount,
        color: "SUCCESS" as COLOR,
      },
      {
        label: "مرفوض",
        value: summary.rejectedReturnsCount,
        color: "DANGER" as COLOR,
      },
    ] satisfies DonutChartDataPoint[]
  ).filter((item) => item.value > 0);

  /*
   * بيانات الرسم البياني العمودي لأفضل المنتجات مبيعًا
   */
  const topProductsChartData = topProducts.map((product) => ({
    label: product.title,
    value: product.total,
  }));

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
        {/* Monthly Sales Chart */}
        <ChartCard
          title="المبيعات الشهرية"
          description="صافي المبيعات خلال آخر 6 أشهر"
          icon={ReceiptText}
          color="SUCCESS"
          className="lg:col-span-2"
        >
          <LineChart
            data={monthlySales}
            color="SUCCESS"
            height={240}
            suffix=" ج.م"
          />
        </ChartCard>

        {/* Returns Breakdown */}
        <ChartCard
          title="حالة المرتجعات"
          description={`${toArabicNums(summary.returnsRequestsCount)} طلب إرجاع إجمالًا`}
          icon={PercentCircle}
          color="DANGER"
        >
          <DonutChart data={returnsChartData} />
        </ChartCard>
      </div>

      {/* Top Products */}
      <ChartCard
        title="الأكثر مبيعًا"
        description="أفضل 5 منتجات من حيث إجمالي المبيعات (طلبات مكتملة فقط)"
        icon={TrendingUp}
        color="MAIN"
      >
        <BarChart
          data={topProductsChartData}
          color="MAIN"
          height={220}
          suffix=" ج.م"
        />
      </ChartCard>
    </div>
  );
};

export default Sales;
