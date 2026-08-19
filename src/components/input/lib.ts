export const INPUT_TYPES = {
  PASSWORD: "password",
  PHONE: ["tel", "number"],
} as const;

export const isPasswordType = (type: string) => {
  return type === INPUT_TYPES.PASSWORD;
};

export const isPhoneType = (type: string) => {
  return INPUT_TYPES.PHONE.includes(type as (typeof INPUT_TYPES.PHONE)[number]);
};

export const getInputType = (type: string, showPassword: boolean) => {
  return isPasswordType(type) && showPassword ? "text" : type;
};

export const sanitizePhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};
