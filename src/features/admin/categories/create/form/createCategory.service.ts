"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "./schema";

export const createCategoryAction = async (values: unknown) => {
  const result = createCategorySchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const { title, desc, parentId, image } = result.data;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        title,
        parentId: parentId || null,
      },
      select: {
        id: true,
      },
    });

    if (existingCategory) {
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
        },
      });

      if (!parentCategory) {
        return {
          success: false,
          message: "التصنيف الأب غير موجود",
        };
      }
    }

    await prisma.category.create({
      data: {
        title,
        desc: desc || null,
        image: image || null,
        parentId: parentId || null,
      },
    });

    revalidatePath("/admin/products/categories");
    revalidatePath("/admin/products/categories/create");

    return {
      success: true,
      message: "تم إنشاء التصنيف بنجاح",
    };
  } catch (error) {
    console.error("CREATE_CATEGORY_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء التصنيف",
    };
  }
};
