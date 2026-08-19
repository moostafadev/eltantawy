import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 },
      );
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
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

    if (!user || !user.isVerified) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 },
    );
  }
}
