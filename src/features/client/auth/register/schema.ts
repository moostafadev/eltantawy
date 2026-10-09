import z from "zod";

export const registerSchema = z.object({
  fName: z.string().trim().min(1, "الاسم الأول مطلوب"),

  lName: z.string().trim().min(1, "اسم العائلة مطلوب"),

  phone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),

  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
    .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
