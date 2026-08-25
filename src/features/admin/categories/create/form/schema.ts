import { z } from "zod";

export const createCategorySchema = z.object({
  title: z
    .string()
    .min(2, "اسم التصنيف يجب أن يكون حرفين على الأقل")
    .max(100, "اسم التصنيف طويل جدًا"),

  desc: z.string().max(500, "الوصف طويل جدًا").optional(),

  parentId: z.string().optional(),

  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
});
