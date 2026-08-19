import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        {
          message: "User ID and verification code are required.",
        },
        { status: 400 },
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          message: "Verification code must be 6 digits.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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

    if (user.isVerified) {
      return NextResponse.json({
        message: "Email is already verified.",
      });
    }

    if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
      return NextResponse.json(
        {
          message: "No verification code found.",
        },
        { status: 400 },
      );
    }

    if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        {
          message: "جلسة التحقق غير صالحة.",
        },
        { status: 400 },
      );
    }

    const hashedCode = hashCode(code);

    if (hashedCode !== user.emailVerificationCodeHash) {
      return NextResponse.json(
        {
          message: "رمز التحقق غير صحيح.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,

        emailVerificationCodeHash: null,

        emailVerificationExpiresAt: null,
      },
    });

    return NextResponse.json({
      message: "تم تأكيد البريد الإلكتروني بنجاح.",
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return NextResponse.json(
      {
        message: "Unable to verify email.",
      },
      { status: 500 },
    );
  }
}
