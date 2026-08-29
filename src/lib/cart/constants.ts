export const CART_COOKIE_NAME = "cart";

export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: CART_COOKIE_MAX_AGE,
};
