import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { verificationEmail } from "@/lib/emails/verification-email";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is missing");

    return NextResponse.json(
      { message: "Email service is not configured." },
      { status: 500 },
    );
  }

  if (!resendFromEmail) {
    console.error("RESEND_FROM_EMAIL is missing");

    return NextResponse.json(
      { message: "Email service is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    const { fName, lName, phone, email, password } = body;

    if (!fName || !lName || !phone || !email || !password) {
      return NextResponse.json(
        {
          message:
            "First name, last name, phone, email and password are required.",
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
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Check phone
     */
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

    /*
     * Check email
     */
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

    /*
     * Hash password
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /*
     * Verification code
     */
    const code = generateCode();
    const codeHash = hashCode(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    /*
     * Create user
     */
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
      from: resendFromEmail,
      to: [normalizedEmail],
      subject: "تأكيد البريد الإلكتروني - الطنطاوي",
      html: verificationEmail({
        name: user.fName,
        code,
      }),
    });

    console.log("RESEND DEBUG:", {
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      fromEmail: process.env.RESEND_FROM_EMAIL,
    });

    if (error) {
      console.error("RESEND ERROR:", JSON.stringify(error, null, 2));

      console.error("RESEND FROM:", resendFromEmail);
      console.error(
        "RESEND API KEY EXISTS:",
        Boolean(process.env.RESEND_API_KEY),
      );

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

    /*
     * Create response
     */
    const response = NextResponse.json(
      {
        message: "Account created. Verification code sent to your email.",
        requiresEmailVerification: true,
      },
      { status: 201 },
    );

    /*
     * Save verification information
     */
    response.cookies.set("pending_verification_email", normalizedEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    response.cookies.set("pending_verification_name", user.fName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    return response;
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
