import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { phone, password } = body;

    /*
     * Validate input
     */
    if (typeof phone !== "string" || typeof password !== "string") {
      return NextResponse.json(
        {
          message: "Phone number and password are required.",
        },
        { status: 400 },
      );
    }

    const normalizedPhone = phone.trim();

    if (!/^01[0125][0-9]{8}$/.test(normalizedPhone)) {
      return NextResponse.json(
        {
          message: "Phone number is invalid.",
        },
        { status: 400 },
      );
    }

    /*
     * Find user
     */
    const user = await prisma.user.findUnique({
      where: {
        phone: normalizedPhone,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid phone number or password.",
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
          message: "Invalid phone number or password.",
        },
        { status: 401 },
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
        phone: user.phone,
        role: user.role,
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
