import { z } from "zod";

export const createReturnSchema = z.object({
  orderId: z.string().min(1, "الطلب مطلوب"),

  reason: z
    .string()
    .trim()
    .min(3, "سبب الإرجاع مطلوب ويجب أن يكون 3 أحرف على الأقل")
    .max(300, "السبب طويل جدًا"),

  items: z
    .array(
      z.object({
        orderItemId: z.string().min(1),
        qty: z.number().positive("الكمية يجب أن تكون أكبر من صفر"),
      }),
    )
    .min(1, "يجب اختيار عنصر واحد على الأقل للإرجاع"),
});

export type CreateReturnValues = z.infer<typeof createReturnSchema>;
