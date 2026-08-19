import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { verificationEmail } from "@/lib/emails/verification-email";

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST() {
  try {
    /*
     * Get email from verification cookie
     */
    const cookieStore = await cookies();

    const email = cookieStore.get("pending_verification_email")?.value;

    if (!email) {
      return NextResponse.json(
        {
          message: "Verification session has expired.",
        },
        { status: 401 },
      );
    }

    /*
     * Find user by email
     */
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
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

    /*
     * Check if already verified
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
     * Generate new verification code
     */
    const code = generateCode();

    const codeHash = hashCode(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    /*
     * Update verification code
     */
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationCodeHash: codeHash,
        emailVerificationExpiresAt: expiresAt,
      },
    });

    /*
     * Send new verification email
     */
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [user.email],
      subject: "تأكيد البريد الإلكتروني - الطنطاوي",
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

    /*
     * Refresh verification cookies
     */
    const response = NextResponse.json({
      message: "A new verification code has been sent.",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 10 * 60,
      path: "/",
    };

    response.cookies.set(
      "pending_verification_email",
      user.email,
      cookieOptions,
    );

    response.cookies.set(
      "pending_verification_name",
      user.fName,
      cookieOptions,
    );

    return response;
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
