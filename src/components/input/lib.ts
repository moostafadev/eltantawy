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

/**
 * Resolves the native `<input type>` to render.
 *
 * Password fields toggle between "password" and "text" via `showPassword`.
 * Number fields render as "text" instead of the native "number" type to
 * avoid the browser's built-in validation, which rejects decimal points
 * on some system locales.
 */
export const getInputType = (type: string, showPassword: boolean) => {
  if (isPasswordType(type)) {
    return showPassword ? "text" : "password";
  }

  if (isNumberType(type)) {
    return "text";
  }

  return type;
};

export const sanitizePhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

/**
 * Sanitizes free-typed text for a numeric field: keeps digits, allows a
 * single leading minus sign, and allows a single decimal point.
 */
export const sanitizeNumber = (value: string) => {
  let sanitized = value.replace(/[^\d.-]/g, "");

  sanitized =
    sanitized[0] === "-"
      ? "-" + sanitized.slice(1).replace(/-/g, "")
      : sanitized.replace(/-/g, "");

  const firstDotIndex = sanitized.indexOf(".");

  if (firstDotIndex !== -1) {
    sanitized =
      sanitized.slice(0, firstDotIndex + 1) +
      sanitized.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  return sanitized;
};
