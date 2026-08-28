"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const deleteCategoryTree = async (categoryId: string) => {
  const children = await prisma.category.findMany({
    where: {
      parentId: categoryId,
    },
    select: {
      id: true,
    },
  });

  for (const child of children) {
    await deleteCategoryTree(child.id);
  }

  await prisma.product.updateMany({
    where: {
      categoryId,
    },
    data: {
      categoryId: null,
    },
  });

  await prisma.category.delete({
    where: {
      id: categoryId,
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

    await deleteCategoryTree(id);

    revalidatePath("/admin/products/categories");

    return {
      success: true,
      message: "تم حذف التصنيف وجميع التصنيفات الفرعية",
    };
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف التصنيف",
    };
  }
};
