import { z } from "zod";

export const editProductSchema = z.object({
  title: z
    .string()
    .min(2, "اسم المنتج يجب أن يكون حرفين على الأقل")
    .max(100, "اسم المنتج طويل جدًا"),

  desc: z.string().max(500, "الوصف طويل جدًا").optional(),

  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),

  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر"),

  discountPrice: z.coerce
    .number()
    .positive("سعر الخصم يجب أن يكون أكبر من صفر")
    .optional()
    .or(z.literal("")),

  unit: z.enum(["KG", "PIECE"]),

  categoryId: z.string().optional(),
});
