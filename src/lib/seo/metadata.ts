import type { Metadata } from "next";

import { SITE_CONFIG } from "./config";

interface BuildMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
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
  "شراء لحوم أونلاين",
  "توصيل دواجن",
  "لحوم ودواجن في 6 أكتوبر",
  "لحوم ودواجن في الشيخ زايد",
];

/**
 * Builds a shared metadata object for a page. When supplied, `extraKeywords`
 * are merged with `BASE_KEYWORDS` and page keywords; extra keywords are
 * provided by admin-managed SEO settings in `src/features/admin/settings/seo`.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: "Products",
 *   description: "Browse our fresh meat and poultry products",
 *   path: "/products",
 * });
 */
export const buildMetadata = (
  {
    title,
    description,
    path,
    image,
    keywords = [],
    noIndex = false,
    type = "website",
    isHome = false,
  }: BuildMetadataParams,
  extraKeywords: string[] = [],
): Metadata => {
  const fullTitle = isHome ? title : `${title} | ${SITE_CONFIG.name}`;
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImage = image ?? SITE_CONFIG.defaultImage;

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...extraKeywords, ...keywords],

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
          alt: `${SITE_CONFIG.name} - لحوم ودواجن`,
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
