import z from "zod";

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "يجب أن يتكون رمز التحقق من 6 أرقام")
    .regex(/^\d{6}$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

export type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;
