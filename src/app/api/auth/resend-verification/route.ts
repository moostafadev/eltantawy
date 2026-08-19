import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { verificationEmail } from "@/lib/emails/verification-email";

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        {
          message: "User or email not found.",
        },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Email is already verified.",
        },
        { status: 400 },
      );
    }

    const code = generateCode();

    const codeHash = hashCode(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationCodeHash: codeHash,

        emailVerificationExpiresAt: expiresAt,
      },
    });

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [user.email],
      subject: "Your new verification code",
      html: verificationEmail({
        name: user.fName,
        code,
      }),
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          message: "Unable to send verification email.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      {
        message: "Unable to resend verification code.",
      },
      { status: 500 },
    );
  }
}
