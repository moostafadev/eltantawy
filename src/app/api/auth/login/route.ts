import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    /*
     * Validate input
     */
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Find user
     */
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    /*
     * Check password
     */
    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    /*
     * Check email verification
     */
    if (!user.isVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in.",
          requiresEmailVerification: true,
        },
        { status: 403 },
      );
    }

    /*
     * Create tokens
     */
    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      role: user.role,
    });

    /*
     * Create response
     */
    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

    /*
     * Access Token
     */
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    /*
     * Refresh Token
     */
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Unable to login. Please try again.",
      },
      { status: 500 },
    );
  }
}
