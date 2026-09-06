// src/features/admin/settings/seo/schema.ts
import { z } from "zod";

export const seoSettingsSchema = z.object({
  siteTitle: z
    .string()
    .min(2, "عنوان الموقع يجب أن يكون حرفين على الأقل")
    .max(70, "عنوان الموقع طويل جدًا (الأفضل أقل من 60 حرف)"),

  siteDescription: z
    .string()
    .min(20, "الوصف يجب أن يكون 20 حرف على الأقل")
    .max(300, "الوصف طويل جدًا (الأفضل بين 150-160 حرف)"),

  keywords: z.string().max(1000, "الكلمات المفتاحية طويلة جدًا"),

  ogImage: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
});

export type SeoSettingsForm = z.infer<typeof seoSettingsSchema>;
