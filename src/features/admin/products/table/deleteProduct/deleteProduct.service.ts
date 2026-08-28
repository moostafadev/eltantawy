"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export const deleteProductAction = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return {
        success: false,
        message: "المنتج غير موجود",
      };
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    return {
      success: true,
      message: "تم حذف المنتج بنجاح",
    };
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف المنتج",
    };
  }
};
