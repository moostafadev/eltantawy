import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const body = await request.json();

    const { fName, lName, phone, email, password } = body;

    if (!fName || !lName || !phone || !password) {
      return NextResponse.json(
        {
          message: "First name, last name, phone and password are required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    const normalizedPhone = phone.trim();

    const normalizedEmail = email ? email.trim().toLowerCase() : null;

    // Check phone
    const existingPhone = await prisma.user.findUnique({
      where: {
        phone: normalizedPhone,
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        {
          message: "This phone number is already registered.",
        },
        { status: 409 },
      );
    }

    // Check email
    if (normalizedEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            message: "This email is already registered.",
          },
          { status: 409 },
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    /*
     * ================================
     * Email provided
     * ================================
     */

    const code = generateCode();

    const codeHash = hashCode(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        fName: fName.trim(),
        lName: lName.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        password: hashedPassword,

        isVerified: false,

        emailVerificationCodeHash: codeHash,

        emailVerificationExpiresAt: expiresAt,
      },
    });

    /*
     * Send verification email
     */
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [normalizedEmail],
      subject: "تأكيد البريد الإلكتروني - الطنطاوي",
      html: verificationEmail({
        name: user.fName,
        code,
      }),
    });

    if (error) {
      console.error("Resend error:", error);

      // Remove user if email could not be sent
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      return NextResponse.json(
        {
          message: "Unable to send verification email. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Account created. Verification code sent to your email.",
        requiresEmailVerification: true,
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        message: "Unable to create account.",
      },
      { status: 500 },
    );
  }
}
