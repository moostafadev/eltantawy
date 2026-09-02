import { z } from "zod";

export const productWeightOptionSchema = z
  .object({
    name: z
      .string()
      .min(1, "اسم الخيار مطلوب")
      .max(100, "اسم الخيار طويل جدًا"),

    minWeight: z
      .string()
      .min(1, "الوزن الأدنى مطلوب")
      .refine((value) => Number(value) >= 0, "الوزن الأدنى غير صحيح"),

    maxWeight: z
      .string()
      .min(1, "الوزن الأعلى مطلوب")
      .refine((value) => Number(value) > 0, "الوزن الأعلى غير صحيح"),
  })
  .refine((data) => Number(data.maxWeight) > Number(data.minWeight), {
    message: "الوزن الأعلى يجب أن يكون أكبر من الوزن الأدنى",
    path: ["maxWeight"],
  });

export const createProductSchema = z
  .object({
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
