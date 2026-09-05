import {
  ArrowLeft,
  Package,
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
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/button";
import { COLOR } from "@/constants/types";
import { prisma } from "@/lib/prisma";
import { toArabicNums } from "@/utils/toArabicNums";

import { getStatColorClasses } from "./statColors";
import { getSalesSummary } from "./sales";

const AdminDashboard = async () => {
  const [
    usersCount,
    productsCount,
    categoriesCount,
    deliveryZonesCount,
    discountsCount,
    activeDiscountsCount,
    salesSummary,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.deliveryZone.count(),
    prisma.discount.count(),
    prisma.discount.count({ where: { isActive: true } }),
    getSalesSummary(),
  ]);

  /*
   * الأداء المالي: أهم مؤشرات المبيعات والمرتجعات، بتتعرض في أعلى
   * الصفحة بشكل بارز لأنها أهم بيانات لصاحب الموقع
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
   * أهم 3 مؤشرات بيعكسوا نشاط الموقع، بتتعرض بشكل بارز
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
      description: "إجمالي المستخدمين",
      color: "INFO",
    },
    {
      title: "المنتجات",
      value: productsCount,
      icon: Package,
      description: "إجمالي المنتجات",
      color: "SUCCESS",
    },
    {
      title: "الخصومات",
      value: discountsCount,
      icon: Percent,
      description: `منها ${activeDiscountsCount} مفعّل`,
      color: "DANGER",
    },
  ];

  /*
   * بيانات هيكلية/إعدادات أقل أهمية، بتتعرض بشكل مختصر
   * في قسم "ملخص الموقع" بدون تكرارها كبطاقات كبيرة
   */
  const secondaryStats: {
    title: string;
    value: number;
    icon: typeof Tags;
    color: COLOR;
  }[] = [
    {
      title: "التصنيفات",
      value: categoriesCount,
      icon: Tags,
      color: "WARNING",
    },
    {
      title: "مناطق التوصيل",
      value: deliveryZonesCount,
      icon: Truck,
      color: "MAIN",
    },
  ];

  /*
   * اختصارات مباشرة لكل جدول بيانات في لوحة التحكم
   */
  const tableShortcuts: {
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
      title: "التصنيفات",
      href: "/admin/products/categories",
      icon: Tags,
      color: "WARNING",
      count: categoriesCount,
    },
    {
      title: "مناطق التوصيل",
      href: "/admin/settings/delivery",
      icon: Truck,
      color: "MAIN",
      count: deliveryZonesCount,
    },
    {
      title: "الخصومات",
      href: "/admin/settings/discounts",
      icon: Percent,
      color: "DANGER",
      count: discountsCount,
    },
    {
      title: "الطلبات",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "SECONDARY",
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
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>

        <p className="text-sm text-muted-foreground">
          نظرة عامة على أداء الموقع وإحصائياته
        </p>
      </div>

      {/* Financial Performance (Sales & Returns) */}
      <section className="flex flex-col gap-3 lg:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center bg-success/10 text-success">
              <ReceiptText className="size-4.5" />
            </div>

            <h2 className="font-bold">الأداء المالي</h2>
          </div>

          <Link
            href="/admin/sales"
            className="flex items-center gap-1 text-xs font-medium text-main hover:underline"
          >
            <span>عرض تفاصيل المبيعات</span>
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
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
        </div>
      </section>

      {/* Featured Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        {featuredStats.map(
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

                    <p className="text-4xl font-bold tracking-tight tabular-nums">
                      {toArabicNums(value)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  <div
                    className={`flex size-13 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-7" />
                  </div>
                </div>
              </div>
            );
          },
        )}
      </section>

      {/* Tables Shortcuts */}
      <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">الجداول</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            انتقل مباشرة لأي جدول بيانات في الموقع
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {tableShortcuts.map(({ title, href, icon: Icon, color, count }) => {
            const styles = getStatColorClasses(color);

            return (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col items-center gap-2 border border-border p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/40 ${styles.hoverBorder} ${styles.hoverShadow}`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{title}</p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {count !== undefined
                      ? `${toArabicNums(count)} عنصر`
                      : "عرض الجدول"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Overview */}
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
            {secondaryStats.map(({ title, value, icon: Icon, color }) => {
              const styles = getStatColorClasses(color);

              return (
                <div
                  key={title}
                  className={`group flex items-center gap-3 bg-muted p-2 transition-colors duration-300 lg:p-3 ${styles.hoverBorder}`}
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 ${styles.iconBg} ${styles.iconText}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">
                      {title}
                    </p>

                    <p className="mt-1 font-bold tabular-nums">
                      {toArabicNums(value)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
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
