import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { signAccessToken, verifyRefreshToken } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token is missing.",
        },
        { status: 401 },
      );
    }

    /*
     * Verify refresh token
     */
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      const response = NextResponse.json(
        {
          message: "Invalid or expired refresh token.",
        },
        { status: 401 },
      );

      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");

      return response;
    }

    /*
     * Create new access token
     */
    const accessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    /*
     * Create response
     */
    const response = NextResponse.json({
      message: "Access token refreshed successfully.",
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);

    const response = NextResponse.json(
      {
        message: "Unable to refresh access token.",
      },
      { status: 500 },
    );

    response.cookies.delete("access_token");

    return response;
  }
}
