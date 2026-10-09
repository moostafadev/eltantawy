"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/seo/config";
import { seoSettingsSchema } from "./schema";

const SEO_SETTINGS_CACHE_TAG = "seo-settings";

/**
 * SEO settings are stored as a single database record. If no record exists
 * yet, this returns the default values from `SITE_CONFIG`.
 */
const getCachedSeoSettings = unstable_cache(
  async () => {
    const settings = await prisma.siteSeoSettings.findFirst();

    return {
      siteTitle: settings?.siteTitle ?? SITE_CONFIG.name,
      siteDescription: settings?.siteDescription ?? SITE_CONFIG.description,
      keywords: settings?.keywords ?? [],
      ogImage: settings?.ogImage ?? SITE_CONFIG.defaultImage,
    };
  },
  ["seo-settings"],
  { revalidate: 3600, tags: [SEO_SETTINGS_CACHE_TAG] },
);

export const getSeoSettings = async () => getCachedSeoSettings();

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

    revalidateTag(SEO_SETTINGS_CACHE_TAG, { expire: 0 });
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
