import { z } from "zod";

export const editDiscountSchema = z
  .object({
    code: z.string().max(50, "الكود طويل جدًا").optional().or(z.literal("")),

    valueType: z.enum(["PERCENTAGE", "FIXED"]),

    value: z
      .string()
      .min(1, "قيمة الخصم مطلوبة")
      .refine(
        (value) => Number(value) > 0,
        "قيمة الخصم يجب أن تكون أكبر من صفر",
      ),

    minOrderAmount: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, "الحد الأدنى غير صحيح"),

    maxDiscountAmount: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, "الحد الأقصى غير صحيح"),

    usageLimit: z
      .string()
      .optional()
      .refine(
        (value) => !value || Number(value) > 0,
        "عدد مرات الاستخدام غير صحيح",
      ),

    startDate: z.string().optional().or(z.literal("")),

    endDate: z.string().optional().or(z.literal("")),

    isActive: z.boolean(),
  })
  .refine(
    (data) => data.valueType !== "PERCENTAGE" || Number(data.value) <= 100,
    {
      message: "نسبة الخصم يجب ألا تتجاوز 100%",
      path: ["value"],
    },
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.endDate) > new Date(data.startDate),
    {
      message: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية",
      path: ["endDate"],
    },
  );
