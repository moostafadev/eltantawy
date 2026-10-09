import { prisma } from "@/lib/prisma";

export const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fName: true,
      lName: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};
