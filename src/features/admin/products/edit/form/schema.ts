import { z } from "zod";

export const productWeightOptionSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "اسم الخيار مطلوب")
      .max(100, "اسم الخيار طويل جدًا"),
    minWeight: z.coerce.number().min(0, "الوزن الأدنى غير صحيح"),
    maxWeight: z.coerce.number().positive("الوزن الأعلى غير صحيح"),
  })
  .refine((data) => data.maxWeight > data.minWeight, {
    message: "الوزن الأعلى يجب أن يكون أكبر من الوزن الأدنى",
    path: ["maxWeight"],
  });

export const editProductSchema = z
  .object({
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
    saleType: z.enum(["NORMAL", "WEIGHT_RANGE"]),
    weightOptions: z.array(productWeightOptionSchema).optional(),
  })
  .refine(
    (data) =>
      data.saleType !== "WEIGHT_RANGE" ||
      (data.weightOptions && data.weightOptions.length > 0),
    {
      message: "يجب إضافة خيار وزن واحد على الأقل",
      path: ["weightOptions"],
    },
  );
