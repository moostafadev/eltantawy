import { z } from "zod";

export const createDeliveryZoneSchema = z.object({
  title: z
    .string()
    .min(2, "اسم المنطقة يجب أن يكون حرفين على الأقل")
    .max(100, "اسم المنطقة طويل جدًا"),

  parentId: z.string().optional(),

  cost: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) >= 0, "تكلفة التوصيل غير صحيحة"),

  isActive: z.boolean(),
});
