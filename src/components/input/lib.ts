export const INPUT_TYPES = {
  PASSWORD: "password",
  PHONE: "tel",
  NUMBER: "number",
} as const;

export const isPasswordType = (type: string) => {
  return type === INPUT_TYPES.PASSWORD;
};

export const isPhoneType = (type: string) => {
  return type === INPUT_TYPES.PHONE;
};

export const isNumberType = (type: string) => {
  return type === INPUT_TYPES.NUMBER;
};

export const getInputType = (type: string, showPassword: boolean) => {
  if (isPasswordType(type)) {
    return showPassword ? "text" : "password";
  }

  // نستخدم text بدل number الأصلي عشان نتفادى الـ native validation
  // بتاع المتصفح اللي بيرفض النقطة العشرية حسب لغة النظام
  if (isNumberType(type)) {
    return "text";
  }

  return type;
};

export const sanitizePhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

export const sanitizeNumber = (value: string) => {
  // اسمح بالأرقام، إشارة سالب في البداية فقط، ونقطة عشرية واحدة فقط
  let sanitized = value.replace(/[^\d.-]/g, "");

  // اسمح بإشارة السالب في البداية فقط
  sanitized =
    sanitized[0] === "-"
      ? "-" + sanitized.slice(1).replace(/-/g, "")
      : sanitized.replace(/-/g, "");

  // اسمح بنقطة عشرية واحدة فقط
  const firstDotIndex = sanitized.indexOf(".");

  if (firstDotIndex !== -1) {
    sanitized =
      sanitized.slice(0, firstDotIndex + 1) +
      sanitized.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  return sanitized;
};
