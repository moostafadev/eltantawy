import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { code } = body;

    if (!code) {
      return NextResponse.json(
        {
          message: "Verification code is required.",
        },
        { status: 400 },
      );
    }

    /*
     * ================================
     * Get pending verification email
     * ================================
     */

    const cookieStore = await cookies();

    const email = cookieStore.get("pending_verification_email")?.value;

    if (!email) {
      return NextResponse.json(
        {
          message: "Verification session has expired. Please register again.",
        },
        { status: 401 },
      );
    }

    /*
     * ================================
     * Find user
     * ================================
     */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    /*
     * ================================
     * Already verified
     * ================================
     */

    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Email is already verified.",
        },
        { status: 400 },
      );
    }

    /*
     * ================================
     * Check verification code
     * ================================
     */

    if (!user.emailVerificationCodeHash) {
      return NextResponse.json(
        {
          message: "Verification code is invalid.",
        },
        { status: 400 },
      );
    }

    const codeHash = hashCode(code);

    if (codeHash !== user.emailVerificationCodeHash) {
      return NextResponse.json(
        {
          message: "رمز التحقق غير صحيح.",
        },
        { status: 400 },
      );
    }

    /*
     * ================================
     * Check expiration
     * ================================
     */

    if (
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      return NextResponse.json(
        {
          message: "انتهت صلاحية رمز التحقق. أرسل رمزًا جديدًا.",
        },
        { status: 400 },
      );
    }

    /*
     * ================================
     * Verify user
     * ================================
     */

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        emailVerificationCodeHash: null,
        emailVerificationExpiresAt: null,
      },
      select: {
        id: true,
        fName: true,
        lName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });

    /*
     * ================================
     * ربط الطلبات القديمة (Guest) بنفس الإيميل بحساب المستخدم
     * ================================
     *
     * بيتم بعد التحقق من الإيميل مش وقت التسجيل مباشرة، عشان
     * نضمن إن الإيميل فعلًا ملك المستخدم قبل ما نربط له بيانات قديمة
     */
    try {
      await prisma.order.updateMany({
        where: {
          userId: null,
          customerEmail: updatedUser.email,
        },
        data: {
          userId: updatedUser.id,
        },
      });
    } catch (linkError) {
      console.error("LINK_GUEST_ORDERS_ERROR:", linkError);
    }

    /*
     * ================================
     * Create authentication tokens
     * ================================
     */

    const accessToken = signAccessToken({
      userId: updatedUser.id,
      role: updatedUser.role,
    });

    const refreshToken = signRefreshToken({
      userId: updatedUser.id,
      role: updatedUser.role,
    });

    /*
     * ================================
     * Response
     * ================================
     */

    const response = NextResponse.json({
      message: "Email verified and login successful.",

      user: updatedUser,
    });

    /*
     * ================================
     * Access Token
     * ================================
     */

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    /*
     * ================================
     * Refresh Token
     * ================================
     */

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    /*
     * ================================
     * Delete pending verification cookies
     * ================================
     */

    response.cookies.delete("pending_verification_email");
    response.cookies.delete("pending_verification_name");

    return response;
  } catch (error) {
    console.error("Verify email error:", error);

    return NextResponse.json(
      {
        message: "Unable to verify email. Please try again.",
      },
      { status: 500 },
    );
  }
}
