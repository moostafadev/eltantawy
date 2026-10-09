"use server";

import { prisma } from "@/lib/prisma";

const MONTHS_TO_SHOW = 6;

export interface MonthlyPageViews {
  label: string;
  value: number;
  change: number | null;
}

export interface PageViewRow {
  path: string;
  name: string;
  views: number;
}

export interface PageViewStatistics {
  totalViews: number;
  trackedPages: number;
  currentMonthViews: number;
  averageDailyViews: number;
  monthlyViews: MonthlyPageViews[];
  pages: PageViewRow[];
}

const isRecord = (
  value: unknown,
): value is Record<string, string | number> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getPageName = (path: string, productTitles: Map<string, string>) => {
  const productId = path.match(/^\/products\/([a-f\d]{24})$/i)?.[1];

  if (productId) {
    return productTitles.get(productId) ?? "منتج";
  }

  const staticNames: Record<string, string> = {
    "/": "الصفحة الرئيسية",
    "/products": "المنتجات",
    "/categories": "التصنيفات",
    "/offers": "العروض والخصومات",
    "/cart": "سلة التسوق",
    "/checkout": "إتمام الطلب",
    "/login": "تسجيل الدخول",
    "/register": "إنشاء حساب جديد",
    "/profile": "الملف الشخصي",
    "/profile/orders": "طلباتي",
  };

  if (staticNames[path]) {
    return staticNames[path];
  }

  if (path.startsWith("/order-success/")) {
    return "تأكيد الطلب";
  }

  return path;
};

export const getPageViewStatistics =
  async (): Promise<PageViewStatistics> => {
    const now = new Date();
    const months: { key: string; label: string; value: number }[] = [];

    for (let offset = MONTHS_TO_SHOW - 1; offset >= 0; offset--) {
      const monthDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
      );
      const key = monthDate.toISOString().slice(0, 7);
      const label = monthDate.toLocaleDateString("ar-EG", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      });

      months.push({ key, label, value: 0 });
    }

    const [pageViewStats, monthlyStats] = await Promise.all([
      prisma.pageView.aggregateRaw({
        pipeline: [
          {
            $group: {
              _id: "$path",
              views: { $sum: 1 },
            },
          },
          { $sort: { views: -1 } },
        ],
      }),
      prisma.pageView.aggregateRaw({
        pipeline: [
          {
            $group: {
              _id: { $substrBytes: ["$dateKey", 0, 7] },
              views: { $sum: 1 },
            },
          },
        ],
      }),
    ]);

    const pageRows = Array.isArray(pageViewStats)
      ? pageViewStats.flatMap((stat) => {
          if (!isRecord(stat)) {
            return [];
          }

          return typeof stat._id === "string" && typeof stat.views === "number"
            ? [{ path: stat._id, views: stat.views }]
            : [];
        })
      : [];

    const productIds = pageRows.flatMap(({ path }) => {
      const match = path.match(/^\/products\/([a-f\d]{24})$/i);
      return match ? [match[1]] : [];
    });
    const products =
      productIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, title: true },
          })
        : [];
    const productTitles = new Map(
      products.map((product) => [product.id, product.title]),
    );

    const monthlyValues = new Map<string, number>();
    if (Array.isArray(monthlyStats)) {
      for (const stat of monthlyStats) {
        if (isRecord(stat) && typeof stat._id === "string" && typeof stat.views === "number") {
          monthlyValues.set(stat._id, stat.views);
        }
      }
    }

    const monthlyViews = months.map(({ key, label }, index) => {
      const value = monthlyValues.get(key) ?? 0;
      const previousValue = index > 0 ? months[index - 1].value : 0;
      months[index].value = value;

      return {
        label,
        value,
        change:
          index === 0 || previousValue === 0
            ? null
            : ((value - previousValue) / previousValue) * 100,
      };
    });

    const totalViews = pageRows.reduce((total, row) => total + row.views, 0);
    const currentMonthViews = months.at(-1)?.value ?? 0;

    return {
      totalViews,
      trackedPages: pageRows.length,
      currentMonthViews,
      averageDailyViews: Math.round(
        currentMonthViews / Math.max(now.getUTCDate(), 1),
      ),
      monthlyViews,
      pages: pageRows.map(({ path, views }) => ({
        path,
        name: getPageName(path, productTitles),
        views,
      })),
    };
  };
