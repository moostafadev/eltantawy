import { createHmac } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "بيانات غير صالحة" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("path" in body) ||
    typeof body.path !== "string"
  ) {
    return NextResponse.json({ message: "مسار الصفحة غير صالح" }, { status: 400 });
  }

  const { path } = body;

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#") ||
    path.length > 512 ||
    path === "/admin" ||
    path.startsWith("/admin/")
  ) {
    return NextResponse.json({ message: "مسار الصفحة غير صالح" }, { status: 400 });
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim();

  if (!ipAddress) {
    return NextResponse.json(
      { message: "تعذر تحديد عنوان IP" },
      { status: 400 },
    );
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined.");
    }

    const ipHash = createHmac("sha256", secret).update(ipAddress).digest("hex");
    const dateKey = new Date().toISOString().slice(0, 10);

    await prisma.pageView.create({
      data: {
        path,
        ipHash,
        dateKey,
      },
    });

    return NextResponse.json({ recorded: true }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ recorded: false });
    }

    console.error("Record page view error:", error);

    return NextResponse.json(
      { message: "تعذر تسجيل مشاهدة الصفحة" },
      { status: 500 },
    );
  }
}
