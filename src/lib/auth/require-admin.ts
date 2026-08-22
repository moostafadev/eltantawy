// lib/auth/require-admin.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "../auth";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    redirect("/login");
  }

  if (!payload?.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.isVerified) {
    redirect("/verify-email");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}
