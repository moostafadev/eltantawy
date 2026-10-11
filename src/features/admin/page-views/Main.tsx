import { CalendarDays, Eye, Files, TrendingUp } from "lucide-react";

import { COLOR } from "@/constants/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { getStatColorClasses } from "../statColors";
import MonthlyViewsTable from "./MonthlyViewsTable";
import PageViewsTable from "./PageViewsTable";
import { getPageViewStatistics } from "./pageViews.service";

const PageViews = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const stats = await getPageViewStatistics(page, sort, direction);

  const mainStats: {
    title: string;
    value: string;
    icon: typeof Eye;
    description: string;
    color: COLOR;
  }[] = [
    {
      title: "إجمالي المشاهدات",
      value: toArabicNums(stats.totalViews),
      icon: Eye,
      description: "منذ بدء تسجيل الزيارات",
      color: "INFO",
    },
    {
      title: "مشاهدات هذا الشهر",
      value: toArabicNums(stats.currentMonthViews),
      icon: CalendarDays,
      description: "عدد مشاهدات الشهر الحالي",
      color: "SUCCESS",
    },
    {
      title: "متوسط المشاهدات اليومية",
      value: toArabicNums(stats.averageDailyViews),
      icon: TrendingUp,
      description: "متوسط الشهر الحالي حتى اليوم",
      color: "MAIN",
    },
    {
      title: "الصفحات المسجلة",
      value: toArabicNums(stats.trackedPages),
      icon: Files,
      description: "عدد الصفحات التي سجلت مشاهدات",
      color: "WARNING",
    },
  ];

  const monthlyCards = stats.monthlyViews.map((month) => ({
    ...month,
    color:
      month.change === null || month.change === 0
        ? "text-muted-foreground"
        : month.change > 0
          ? "text-success"
          : "text-danger",
  }));

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          إحصائيات المشاهدات
        </h1>
        <p className="text-sm text-muted-foreground">
          نظرة شاملة على زيارات صفحات الموقع خلال آخر ٦ أشهر
        </p>
      </div>

      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {mainStats.map(({ title, value, icon: Icon, description, color }) => {
          const styles = getStatColorClasses(color);

          return (
            <div
              key={title}
              className={`group relative min-w-0 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:p-5 ${styles.hoverBorder} ${styles.hoverShadow}`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${styles.accent} opacity-70`}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {title}
                  </p>
                  <p className="wrap-break-word text-2xl font-bold tabular-nums lg:text-3xl">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div
                  className={`flex size-12 shrink-0 items-center justify-center ${styles.iconBg} ${styles.iconText}`}
                >
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">المشاهدات الشهرية</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            مقارنة عدد الزيارات ونسبة التغيير عن الشهر السابق
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {monthlyCards.map(({ label, value, change, color }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-2 border border-background-second/20 bg-background p-3 shadow-sm"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
              <span className="wrap-break-word text-lg font-bold tabular-nums">
                {toArabicNums(value)}
              </span>
              <span className={`text-xs font-semibold ${color}`}>
                {change === null
                  ? "—"
                  : `${change > 0 ? "+" : ""}${toArabicNums(String(Math.round(change)))}%`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">تفاصيل المشاهدات الشهرية</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            إجمالي المشاهدات لكل شهر ومعدل تغيّرها
          </p>
        </div>
        <MonthlyViewsTable data={stats.monthlyViews} />
      </section>

      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="min-w-0 border-b border-border pb-2.5 sm:pb-3 lg:pb-4">
          <h2 className="text-sm font-bold sm:text-base">مشاهدات الصفحات</h2>
          <p className="mt-1 max-w-full text-xs leading-relaxed text-muted-foreground sm:text-sm">
            إجمالي {toArabicNums(stats.totalViews)} مشاهدة؛ تُحتسب زيارة واحدة
            لكل عنوان IP على الصفحة يوميًا
          </p>
        </div>
        <PageViewsTable
          data={stats.pages}
          pagination={{
            ...stats.pagesPagination,
            basePath: "/admin/page-views",
          }}
          sorting={stats.pagesSorting}
        />
      </section>
    </div>
  );
};

export default PageViews;
