import type { Metadata } from "next";

import { SITE_CONFIG } from "./config";
import { buildMetadata } from "./metadata";
import { getSeoSettings } from "@/features/admin/settings/seo";

/**
 * Metadata الأساسي للـ Root Layout والصفحة الرئيسية، بيقرأ العنوان
 * والوصف والكلمات المفتاحية وصورة الـ OG من إعدادات SEO المتحكم فيها
 * الأدمن، مع fallback للقيم الافتراضية في SITE_CONFIG لو مفيش إعدادات
 * محفوظة بعد
 */
export const getRootMetadata = async (): Promise<Metadata> => {
  const settings = await getSeoSettings();

  return {
    ...buildMetadata(
      {
        title: settings.siteTitle,
        description: settings.siteDescription,
        path: "/",
        image: settings.ogImage,
        isHome: true,
      },
      settings.keywords,
    ),
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`,
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
};
