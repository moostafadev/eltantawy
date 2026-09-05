import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "الاسم مطلوب"),

  customerPhone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),

  customerEmail: z
    .string()
    .trim()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),

  deliveryZoneId: z.string().min(1, "يرجى اختيار منطقة التوصيل"),

  addressLine: z
    .string()
    .trim()
    .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
    .max(300, "العنوان طويل جدًا"),

  notes: z.string().max(300, "الملاحظات طويلة جدًا").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
