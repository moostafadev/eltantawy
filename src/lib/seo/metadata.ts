import type { Metadata } from "next";

import { SITE_CONFIG } from "./config";

interface BuildMetadataParams {
  /** عنوان الصفحة (بدون اسم الموقع، بيتضاف تلقائيًا عبر title.template في الـ layout) */
  title: string;
  /** وصف الصفحة، لازم يكون فريد لكل صفحة قدر الإمكان */
  description: string;
  /** المسار النسبي للصفحة، مثال: "/products" أو "/products/123" */
  path: string;
  /** صورة مخصصة للصفحة (OG/Twitter)، لو مش موجودة بتستخدم اللوجو الافتراضي */
  image?: string;
  /** كلمات مفتاحية إضافية خاصة بالصفحة */
  keywords?: string[];
  /** امنع الفهرسة (صفحات زي السلة، الدفع، تسجيل الدخول) */
  noIndex?: boolean;
  /**
   * نوع محتوى Open Graph. النوع المدعوم في تايبات Next.js هو
   * "website" | "article" فقط. صفحات المنتجات بتاخد "website" هنا،
   * وبيانات المنتج الفعلية (سعر/توفر) بتتغطى عبر JSON-LD Product schema
   * (راجع src/lib/seo/structuredData.ts) اللي هو المعيار الفعلي اللي
   * جوجل بيعتمد عليه لعرض الـ Rich Snippets
   */
  type?: "website" | "article";
  /**
   * لو true، العنوان بيتحط كما هو بدون دمجه مع اسم الموقع في OG/Twitter
   * (مستخدم للصفحة الرئيسية اللي عايزة العنوان يكون "الطنطاوي" فقط)
   */
  isHome?: boolean;
}

const BASE_KEYWORDS = [
  "الطنطاوي",
  "لحوم طازجة",
  "دواجن طازجة",
  "توصيل لحوم",
  "6 أكتوبر",
  "الشيخ زايد",
  "لحوم مصرية",
];

/**
 * بيبني object الـ Metadata الموحّد لأي صفحة في الـ client، مع تطبيق
 * نفس القواعد (Open Graph, Twitter Card, Canonical, Robots) على كل الموقع
 *
 * ملاحظة مهمة: `title` بيترجع كـ string خام بدون اسم الموقع، عشان
 * `title.template` في الـ Root Layout هو المسؤول عن إضافة "| الطنطاوي"
 * تلقائيًا. لو بنيناه هنا بالكامل، هيتكرر اسم الموقع مرتين
 * (مثال: "برجر فراخ | الطنطاوي | الطنطاوي")
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: "المنتجات",
 *   description: "تصفح جميع منتجاتنا من اللحوم والدواجن الطازجة",
 *   path: "/products",
 * });
 */
export const buildMetadata = ({
  title,
  description,
  path,
  image,
  keywords = [],
  noIndex = false,
  type = "website",
  isHome = false,
}: BuildMetadataParams): Metadata => {
  // بنستخدمه يدويًا بس في OG/Twitter لأنهم مش بياخدوا title.template تلقائيًا
  const fullTitle = isHome ? title : `${title} | ${SITE_CONFIG.name}`;
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImage = image ?? SITE_CONFIG.defaultImage;

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],

    alternates: {
      canonical: url,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: SITE_CONFIG.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
};

/**
 * Metadata أساسي للـ Root Layout (بيتطبق كـ fallback على كل الصفحات
 * اللي مش عاملة override بمتادata خاص بيها، بما فيهم الصفحة الرئيسية)
 */
export const rootMetadata: Metadata = {
  ...buildMetadata({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    path: "/",
    isHome: true,
  }),
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    // لما يتعمل حساب Google Search Console، حط الكود هنا:
    // google: "YOUR_VERIFICATION_CODE",
  },
};
