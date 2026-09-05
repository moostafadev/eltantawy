import {
  Package,
  PercentCircle,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import Link from "next/link";

import { COLOR } from "@/constants/types";
import { prisma } from "@/lib/prisma";
import { toArabicNums } from "@/utils/toArabicNums";
import {
  ChartCard,
  DonutChart,
  DonutChartDataPoint,
} from "@/components/charts";

import { getStatColorClasses } from "./statColors";
import { getSalesSummary } from "./sales";
import {
  getOrderStatusDistribution,
  orderStatusColors,
  orderStatusLabels,
} from "./orders";

const AdminDashboard = async () => {
  const [
    usersCount,
    productsCount,
    discountsCount,
    salesSummary,
    orderStatusDistribution,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.discount.count({ where: { isActive: true } }),
    getSalesSummary(),
    getOrderStatusDistribution(),
  ]);

  /*
   * الأداء المالي: أهم مؤشرات المبيعات والمرتجعات
   */
  const financialStats: {
    title: string;
    value: string;
    icon: typeof Wallet;
    description: string;
    color: COLOR;
  }[] = [
    {
      title: "صافي المبيعات",
      value: `${toArabicNums(String(salesSummary.totalSales))} ج.م`,
      icon: Wallet,
      description: "طلبات تم توصيلها بعد خصم المرتجعات",
      color: "SUCCESS",
    },
    {
      title: "الطلبات المكتملة",
      value: toArabicNums(salesSummary.deliveredOrdersCount),
      icon: Package,
      description: "إجمالي الطلبات التي تم توصيلها",
      color: "INFO",
    },
    {
      title: "متوسط قيمة الطلب",
      value: `${toArabicNums(String(Math.round(salesSummary.averageOrderValue)))} ج.م`,
      icon: TrendingUp,
      description: "متوسط قيمة الطلب الواحد المكتمل",
      color: "MAIN",
    },
    {
      title: "قيمة المرتجعات",
      value: `${toArabicNums(String(salesSummary.totalReturnsAmount))} ج.م`,
      icon: RotateCcw,
      description: `${toArabicNums(salesSummary.returnsRequestsCount)} طلب إرجاع إجمالًا`,
      color: "DANGER",
    },
  ];

  /*
   * إجراءات سريعة مختصرة، أهم 4 وجهات بيحتاجها الأدمن يوميًا
   */
  const quickLinks: {
    title: string;
    href: string;
    icon: typeof Users;
    color: COLOR;
    count?: number;
  }[] = [
    {
      title: "المستخدمين",
      href: "/admin/users",
      icon: Users,
      color: "INFO",
      count: usersCount,
    },
    {
      title: "المنتجات",
      href: "/admin/products",
      icon: Package,
      color: "SUCCESS",
      count: productsCount,
    },
    {
      title: "الطلبات",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "MAIN",
    },
    {
      title: "الخصومات",
      href: "/admin/settings/discounts",
      icon: PercentCircle,
      color: "DANGER",
      count: discountsCount,
    },
  ];

  const orderStatusChartData: DonutChartDataPoint[] = orderStatusDistribution
    .filter((item) => item.count > 0)
    .map((item) => ({
      label: orderStatusLabels[item.status],
      value: item.count,
      color: orderStatusColors[item.status] as COLOR,
    }));

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>

        <p className="text-sm text-muted-foreground">
          نظرة سريعة على أهم مؤشرات الموقع
        </p>
      </div>

      {/* Financial Performance */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {financialStats.map(
          ({ title, value, icon: Icon, description, color }) => {
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
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  <div
                    className={`flex size-12 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-6" />
                  </div>
                </div>
              </div>
            );
          },
        )}
      </section>

      {/* Order Status Chart */}
      <ChartCard
        title="توزيع حالات الطلبات"
        description="نسبة كل حالة من إجمالي الطلبات الحالية"
        icon={ShoppingCart}
        color="MAIN"
      >
        <DonutChart data={orderStatusChartData} />
      </ChartCard>

      {/* Quick Links */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
        {quickLinks.map(({ title, href, icon: Icon, color, count }) => {
          const styles = getStatColorClasses(color);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col items-center gap-2 border border-border bg-background p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/40 ${styles.hoverBorder} ${styles.hoverShadow}`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {count !== undefined ? `${toArabicNums(count)} عنصر` : "عرض"}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default AdminDashboard;
