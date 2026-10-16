import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  Package,
  PackageCheck,
  Percent,
  Plus,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Tags,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/button";
import { COLOR } from "@/constants/types";
import { prisma } from "@/lib/prisma";
import { toArabicNums } from "@/utils/toArabicNums";

import PageViewsTable from "./page-views/PageViewsTable";
import { getPageViewStatistics } from "./page-views";
import { getStatColorClasses } from "./statColors";
import { getSalesSummary } from "./sales";
import {
  getOrderStatusDistribution,
  orderStatusColors,
  orderStatusLabels,
  type OrderStatusEnum,
} from "./orders";

const orderStatusIcons: Record<OrderStatusEnum, LucideIcon> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PREPARING: Package,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: PackageCheck,
  CANCELLED: XCircle,
};

const AdminDashboard = async () => {
  const [
    usersCount,
    productsCount,
    categoriesCount,
    deliveryZonesCount,
    discountsCount,
    activeDiscountsCount,
    salesSummary,
    pageViewStatistics,
    orderStatusDistribution,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.deliveryZone.count(),
    prisma.discount.count(),
    prisma.discount.count({ where: { isActive: true } }),
    getSalesSummary(),
    getPageViewStatistics(1),
    getOrderStatusDistribution(),
  ]);
  const pageViews = pageViewStatistics.pages;
  const totalPageViews = pageViewStatistics.totalViews;
  const trackedPages = pageViewStatistics.trackedPages;

  const totalOrders = orderStatusDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const orderStatusStats = orderStatusDistribution.map(({ status, count }) => ({
    status,
    count,
    label: orderStatusLabels[status],
    icon: orderStatusIcons[status],
    color: orderStatusColors[status] as COLOR,
  }));

  /*
   * Financial performance: highlight key sales and return metrics at the
   * top of the page because they are the most important business indicators.
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
   * Highlight the three key metrics that reflect overall site activity.
   */
  const featuredStats: {
    title: string;
    value: number;
    icon: typeof Users;
    description: string;
    color: COLOR;
  }[] = [
    {
      title: "المستخدمين",
      value: usersCount,
      icon: Users,
      description: "إجمالي المستخدمين المسجلين",
      color: "INFO",
    },
    {
      title: "المنتجات",
      value: productsCount,
      icon: Package,
      description: "إجمالي منتجات المتجر",
      color: "SUCCESS",
    },
    {
      title: "الخصومات",
      value: discountsCount,
      icon: Percent,
      description: `منها ${toArabicNums(activeDiscountsCount)} مفعّل حاليًا`,
      color: "DANGER",
    },
  ];

  /*
   * Structural / configuration data about the site. These four items fill
   * the 2x2 grid so the section does not appear sparse.
   */
  const secondaryStats: {
    title: string;
    value: number;
    icon: typeof Tags;
    color: COLOR;
    description: string;
  }[] = [
    {
      title: "التصنيفات",
      value: categoriesCount,
      icon: Tags,
      color: "WARNING",
      description: "إجمالي تصنيفات المنتجات",
    },
    {
      title: "مناطق التوصيل",
      value: deliveryZonesCount,
      icon: Truck,
      color: "MAIN",
      description: "المناطق المسجلة حاليًا",
    },
    {
      title: "إجمالي الطلبات",
      value: totalOrders,
      icon: ShoppingCart,
      color: "INFO",
      description: "جميع الطلبات في النظام",
    },
    {
      title: "الصفحات المتتبعة",
      value: trackedPages,
      icon: Eye,
      color: "SUCCESS",
      description: `${toArabicNums(totalPageViews)} مشاهدة إجمالًا`,
    },
  ];

  /* Provide direct links to each data table in the dashboard. */
  const tableShortcuts: {
    title: string;
    href: string;
    icon: typeof Users;
    color: COLOR;
    count?: number;
    description: string;
  }[] = [
    {
      title: "المستخدمين",
      href: "/admin/users",
      icon: Users,
      color: "INFO",
      count: usersCount,
      description: "المسجلين والزوار",
    },
    {
      title: "المنتجات",
      href: "/admin/products",
      icon: Package,
      color: "SUCCESS",
      count: productsCount,
      description: "كتالوج المتجر",
    },
    {
      title: "التصنيفات",
      href: "/admin/products/categories",
      icon: Tags,
      color: "WARNING",
      count: categoriesCount,
      description: "هيكل الأقسام",
    },
    {
      title: "مناطق التوصيل",
      href: "/admin/settings/delivery",
      icon: Truck,
      color: "MAIN",
      count: deliveryZonesCount,
      description: "تكلفة ومناطق",
    },
    {
      title: "الخصومات",
      href: "/admin/settings/discounts",
      icon: Percent,
      color: "DANGER",
      count: discountsCount,
      description: "الكوبونات والعروض",
    },
    {
      title: "الطلبات",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "SECONDARY",
      count: totalOrders,
      description: "إدارة ومتابعة",
    },
  ];

  const quickActions: {
    title: string;
    description: string;
    href: string;
    icon: typeof Package;
    color: COLOR;
  }[] = [
    {
      title: "إضافة منتج",
      description: "أضف منتجًا جديدًا إلى الموقع",
      href: "/admin/products/create",
      icon: Package,
      color: "SUCCESS",
    },
    {
      title: "إضافة تصنيف",
      description: "أنشئ تصنيفًا جديدًا للمنتجات",
      href: "/admin/products/categories/create",
      icon: Tags,
      color: "WARNING",
    },
    {
      title: "إضافة منطقة توصيل",
      description: "أضف منطقة توصيل جديدة",
      href: "/admin/settings/delivery/create",
      icon: Truck,
      color: "MAIN",
    },
    {
      title: "إضافة خصم",
      description: "أنشئ كوبون خصم أو خصم سريع",
      href: "/admin/settings/discounts/create",
      icon: Percent,
      color: "DANGER",
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>

        <p className="text-sm text-muted-foreground">
          نظرة عامة على أداء الموقع وإحصائياته
        </p>
      </div>

      {/* Order Status Distribution */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-info/10 text-info">
              <ShoppingCart className="size-4.5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold">حالة الطلبات</h2>

              <p className="text-xs text-muted-foreground">
                إجمالي {toArabicNums(totalOrders)} طلب موزعة حسب الحالة
              </p>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-medium text-main hover:underline"
          >
            <span>عرض كل الطلبات</span>
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {orderStatusStats.map(
            ({ status, count, label, icon: Icon, color }) => {
              const styles = getStatColorClasses(color);

              return (
                <Link
                  key={status}
                  href="/admin/orders"
                  className={`group relative flex min-w-0 flex-col gap-2 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${styles.hoverBorder} ${styles.hoverShadow}`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`flex size-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xl font-bold tabular-nums lg:text-2xl">
                      {toArabicNums(count)}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* Financial Performance (Sales & Returns) */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-success/10 text-success">
              <ReceiptText className="size-4.5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold">الأداء المالي</h2>

              <p className="text-xs text-muted-foreground">
                مؤشرات المبيعات والمرتجعات
              </p>
            </div>
          </div>

          <Link
            href="/admin/sales"
            className="flex items-center gap-1 text-xs font-medium text-main hover:underline"
          >
            <span>عرض تفاصيل المبيعات</span>
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {financialStats.map(
            ({ title, value, icon: Icon, description, color }) => {
              const styles = getStatColorClasses(color);

              return (
                <div
                  key={title}
                  className={`group relative flex min-w-0 items-center gap-3 overflow-hidden border border-border bg-background p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md lg:p-4 ${styles.hoverBorder} ${styles.hoverShadow}`}
                >
                  <span
                    className={`absolute inset-y-0 right-0 w-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`flex size-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {title}
                    </p>

                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground lg:text-2xl">
                      {value}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Featured Stats */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-info/10 text-info">
              <TrendingUp className="size-4.5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold">نشاط الموقع</h2>

              <p className="text-xs text-muted-foreground">
                أهم مؤشرات المستخدمين والمنتجات والخصومات
              </p>
            </div>
          </div>

          <span className="shrink-0 bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
            {toArabicNums(featuredStats.length)} مؤشرات
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {featuredStats.map(
            ({ title, value, icon: Icon, description, color }) => {
              const styles = getStatColorClasses(color);

              return (
                <div
                  key={title}
                  className={`group relative flex min-w-0 items-center gap-3 overflow-hidden border border-border bg-background p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md lg:p-4 ${styles.hoverBorder} ${styles.hoverShadow}`}
                >
                  <span
                    className={`absolute inset-y-0 right-0 w-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`flex size-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {title}
                    </p>

                    <p className="mt-1 text-2xl font-bold tabular-nums text-foreground lg:text-3xl">
                      {toArabicNums(value)}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Page Views */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1.5 border-b border-border pb-3 sm:flex sm:items-center sm:gap-2.5 lg:pb-4">
          <div className="row-span-2 flex size-8 shrink-0 items-center justify-center bg-info/10 text-info sm:size-9">
            <Eye className="size-4 sm:size-4.5" />
          </div>

          <div className="col-start-2 row-start-1 min-w-0 sm:flex-1">
            <h2 className="text-sm font-bold sm:text-base">مشاهدات الصفحات</h2>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              إجمالي {toArabicNums(totalPageViews)} مشاهدة؛ تُحتسب زيارة واحدة
              لكل عنوان IP على الصفحة يوميًا
            </p>
          </div>
          <Link
            href="/admin/page-views"
            className="col-start-2 row-start-2 mr-auto flex w-fit shrink-0 items-center gap-1 text-xs font-medium text-main hover:underline sm:col-auto sm:row-auto"
          >
            <span>عرض الإحصائيات</span>
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        <PageViewsTable data={pageViews} />
      </section>

      {/* Tables Shortcuts */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-main/10 text-main">
              <Package className="size-4.5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold">الجداول</h2>

              <p className="text-xs text-muted-foreground">
                انتقل مباشرة لأي جدول بيانات في الموقع
              </p>
            </div>
          </div>

          <span className="shrink-0 bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
            {toArabicNums(tableShortcuts.length)} جداول
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {tableShortcuts.map(
            ({ title, href, icon: Icon, color, count, description }) => {
              const styles = getStatColorClasses(color);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex min-w-0 items-center gap-3 overflow-hidden border border-border bg-background p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md lg:p-4 ${styles.hoverBorder} ${styles.hoverShadow}`}
                >
                  <span
                    className={`absolute inset-y-0 right-0 w-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`flex size-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {description}
                    </p>

                    {count !== undefined && (
                      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                        {toArabicNums(count)}
                        <span className="mr-1 text-xs font-medium text-muted-foreground">
                          عنصر
                        </span>
                      </p>
                    )}
                  </div>

                  <ArrowLeft
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-x-1 ${styles.iconText}`}
                  />
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Site Summary */}
        <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:gap-4 lg:pb-4">
            <div className="min-w-0">
              <h2 className="font-bold">ملخص الموقع</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                بيانات إضافية عن هيكل الموقع
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
              <TrendingUp className="size-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
            {secondaryStats.map(
              ({ title, value, icon: Icon, color, description }) => {
                const styles = getStatColorClasses(color);

                return (
                  <div
                    key={title}
                    className={`group relative flex min-w-0 items-center gap-3 overflow-hidden border border-border bg-background p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md lg:p-4 ${styles.hoverBorder} ${styles.hoverShadow}`}
                  >
                    <span
                      className={`absolute inset-y-0 right-0 w-1 ${styles.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    <div
                      className={`flex size-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {title}
                      </p>

                      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                        {toArabicNums(value)}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="border-b border-border pb-3 lg:pb-4">
            <h2 className="font-bold">إجراءات سريعة</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              الوصول السريع لأهم العمليات
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:gap-3">
            {quickActions.map(
              ({ title, description, href, icon: Icon, color }) => {
                const styles = getStatColorClasses(color);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex items-center gap-3 border border-border p-3 transition-all duration-300 hover:bg-muted/40 ${styles.hoverBorder}`}
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{title}</p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>

                    <ArrowLeft
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1 ${styles.iconText}`}
                    />
                  </Link>
                );
              },
            )}
          </div>
        </section>
      </div>

      {/* Welcome */}
      <section className="relative overflow-hidden border border-main/20 bg-main/5 p-3 lg:p-4">
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <div className="flex min-w-0 flex-col gap-1 lg:gap-1.5">
            <div className="mb-1 flex items-center gap-2 text-main lg:mb-2">
              <TrendingUp className="size-5" />

              <span className="text-sm font-semibold">إدارة الموقع</span>
            </div>

            <h2 className="text-lg font-bold">
              تحكم كامل في الموقع من مكان واحد
            </h2>

            <p className="max-w-xl text-sm text-muted-foreground">
              يمكنك إدارة المنتجات والتصنيفات والمستخدمين ومناطق التوصيل
              والخصومات بسهولة من لوحة التحكم.
            </p>
          </div>

          <Link href="/admin/products/create" className="self-end sm:self-auto">
            <Button color="MAIN">
              <Plus className="size-4 lg:size-5" />
              إضافة منتج
            </Button>
          </Link>
        </div>

        <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-main/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full bg-success/10 blur-2xl" />

        <div className="pointer-events-none absolute right-1/3 top-1/2 size-24 -translate-y-1/2 rounded-full bg-info/10 blur-2xl" />
      </section>
    </div>
  );
};

export default AdminDashboard;
