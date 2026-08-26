"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const deleteChildren = async (parentId: string) => {
  const children = await prisma.category.findMany({
    where: {
      parentId,
    },
    select: {
      id: true,
    },
  });

  for (const child of children) {
    await deleteChildren(child.id);
  }

  await prisma.category.delete({
    where: {
      id: parentId,
    },
  });
};

export const deleteCategoryAction = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "التصنيف غير موجود",
      };
    }

    await deleteChildren(id);

    revalidatePath("/admin/products/categories");

    return {
      success: true,
      message: "تم حذف التصنيف وجميع التصنيفات التابعة له",
    };
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف التصنيف",
    };
  }
};
