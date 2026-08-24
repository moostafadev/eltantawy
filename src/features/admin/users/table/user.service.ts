"use server";

import { prisma } from "@/lib/prisma";

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fName: true,
      lName: true,
      phone: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};
