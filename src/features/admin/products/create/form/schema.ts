import { z } from "zod";

export const createProductSchema = z.object({
  title: z
    .string()
    .min(2, "اسم المنتج يجب أن يكون حرفين على الأقل")
    .max(150, "اسم المنتج طويل جدًا"),

  desc: z.string().max(1000, "الوصف طويل جدًا").optional(),

  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),

  price: z
    .string()
    .min(1, "السعر مطلوب")
    .refine((value) => Number(value) > 0, "السعر يجب أن يكون أكبر من صفر"),

  discountPrice: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) >= 0, "سعر الخصم غير صحيح"),

  unit: z.enum(["KG", "PIECE"]),

  categoryId: z.string().optional(),
});
