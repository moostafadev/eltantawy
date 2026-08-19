import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/lib/auth";

const protectedRoutes = ["/admin", "/profile"];

const authRoutes = ["/login", "/register", "/verify-email"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string) {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Ignore Next.js internals and public files
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  /*
   * ================================
   * Protected routes
   * ================================
   */

  if (isProtectedRoute(pathname)) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = verifyAccessToken(accessToken);

    /*
     * Access token is valid
     */
    if (payload) {
      return NextResponse.next();
    }

    /*
     * Access token expired/invalid
     *
     * Try refresh token
     */
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");

      return response;
    }

    /*
     * Refresh through internal API
     */
    try {
      const refreshResponse = await fetch(
        new URL("/api/auth/refresh-token", request.url),
        {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
          cache: "no-store",
        },
      );

      if (!refreshResponse.ok) {
        const response = NextResponse.redirect(new URL("/login", request.url));

        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");

        return response;
      }

      /*
       * The refresh API created a new access token.
       *
       * Copy the Set-Cookie header to the browser response.
       */
      const response = NextResponse.next();

      const setCookie = refreshResponse.headers.get("set-cookie");

      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }

      return response;
    } catch (error) {
      console.error("Proxy refresh token error:", error);

      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");

      return response;
    }
  }

  /*
   * ================================
   * Auth routes
   * ================================
   *
   * If the user is already logged in,
   * don't allow login/register pages.
   */

  if (isAuthRoute(pathname)) {
    if (!accessToken) {
      return NextResponse.next();
    }

    const payload = verifyAccessToken(accessToken);

    if (payload) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run Proxy on application routes.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
