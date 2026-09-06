"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/seo/config";
import { seoSettingsSchema } from "./schema";

/**
 * إعدادات SEO محفوظة كسجل واحد فقط (Singleton) في الداتابيز.
 * لو مفيش سجل بعد (أول مرة)، بترجع القيم الافتراضية من SITE_CONFIG
 */
export const getSeoSettings = async () => {
  const settings = await prisma.siteSeoSettings.findFirst();

  return {
    siteTitle: settings?.siteTitle ?? SITE_CONFIG.name,
    siteDescription: settings?.siteDescription ?? SITE_CONFIG.description,
    keywords: settings?.keywords ?? [],
    ogImage: settings?.ogImage ?? SITE_CONFIG.defaultImage,
  };
};

export const updateSeoSettingsAction = async (values: unknown) => {
  const result = seoSettingsSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const { siteTitle, siteDescription, keywords, ogImage } = result.data;

  const keywordsArray = keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  try {
    const existing = await prisma.siteSeoSettings.findFirst({
      select: { id: true },
    });

    if (existing) {
      await prisma.siteSeoSettings.update({
        where: { id: existing.id },
        data: {
          siteTitle,
          siteDescription,
          keywords: keywordsArray,
          ogImage: ogImage || null,
        },
      });
    } else {
      await prisma.siteSeoSettings.create({
        data: {
          siteTitle,
          siteDescription,
          keywords: keywordsArray,
          ogImage: ogImage || null,
        },
      });
    }

    revalidatePath("/admin/settings/seo");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "تم حفظ إعدادات SEO بنجاح",
    };
  } catch (error) {
    console.error("UPDATE_SEO_SETTINGS_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حفظ الإعدادات",
    };
  }
};
