import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fName, lName, phone, password } = body;

    if (
      typeof fName !== "string" ||
      typeof lName !== "string" ||
      typeof phone !== "string" ||
      typeof password !== "string" ||
      !fName.trim() ||
      !lName.trim() ||
      !phone.trim() ||
      !password
    ) {
      return NextResponse.json(
        {
          message: "First name, last name, phone and password are required.",
        },
        { status: 400 },
      );
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          message: "Password does not meet the required strength.",
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

    const generatedEmail = `${normalizedPhone}@eltantawymeats.com`;
    const existingGeneratedEmail = await prisma.user.findUnique({
      where: {
        email: generatedEmail,
      },
    });

    if (existingGeneratedEmail) {
      return NextResponse.json(
        {
          message: "This phone number cannot be used to create an account.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fName: fName.trim(),
          lName: lName.trim(),
          phone: normalizedPhone,
          email: generatedEmail,
          password: hashedPassword,
        },
        select: {
          id: true,
          fName: true,
          lName: true,
          phone: true,
          role: true,
        },
      });

      await tx.order.updateMany({
        where: {
          customerPhone: normalizedPhone,
          userId: null,
        },
        data: {
          userId: createdUser.id,
        },
      });

      return createdUser;
    });

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 },
    );

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "This phone number is already registered.",
        },
        { status: 409 },
      );
    }

    console.error("Signup error:", error);

    return NextResponse.json(
      {
        message: "Unable to create account.",
      },
      { status: 500 },
    );
  }
}
