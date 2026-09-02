export const FAVORITES_COOKIE_NAME = "favorites";

export const FAVORITES_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const FAVORITES_COOKIE_OPTIONS = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite: "lax" as const,

  path: "/",

  maxAge: FAVORITES_COOKIE_MAX_AGE,
};
