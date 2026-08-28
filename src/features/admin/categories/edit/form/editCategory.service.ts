"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { editCategorySchema } from "./schema";

export const editCategoryAction = async (id: string, values: unknown) => {
  const result = editCategorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
    };
  }

  const { title, desc, image, parentId } = result.data;

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

    if (parentId === id) {
      return {
        success: false,
        message: "لا يمكن أن يكون التصنيف أبًا لنفسه",
      };
    }

    const exists = await prisma.category.findFirst({
      where: {
        title,
        parentId: parentId || null,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (exists) {
      return {
        success: false,
        message: "هذا التصنيف موجود بالفعل",
      };
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
        select: {
          id: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (!parentCategory) {
        return {
          success: false,
          message: "التصنيف الأب غير موجود",
        };
      }

      if (parentCategory._count.products > 0) {
        return {
          success: false,
          message: "لا يمكن وضع التصنيف داخل تصنيف يحتوي على منتجات",
        };
      }
    }

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        title,
        desc: desc || null,
        image: image || null,
        parentId: parentId || null,
      },
    });

    revalidatePath("/admin/products/categories");
    revalidatePath(`/admin/products/categories/${id}`);

    return {
      success: true,
      message: "تم تعديل التصنيف بنجاح",
    };
  } catch (error) {
    console.error("EDIT_CATEGORY_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تعديل التصنيف",
    };
  }
};
