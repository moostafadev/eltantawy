"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export const deleteDiscountAction = async (id: string) => {
  try {
    const discount = await prisma.discount.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!discount) {
      return {
        success: false,
        message: "الخصم غير موجود",
      };
    }

    await prisma.discount.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/settings/discounts");

    return {
      success: true,
      message: "تم حذف الخصم بنجاح",
    };
  } catch (error) {
    console.error("DELETE_DISCOUNT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف الخصم",
    };
  }
};
