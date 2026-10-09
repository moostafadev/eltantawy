import z from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),

  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
