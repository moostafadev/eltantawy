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
    const exists = await prisma.category.findFirst({
      where: {
        title,
        parentId: parentId || null,
        NOT: {
          id,
        },
      },
    });

    if (exists) {
      return {
        success: false,
        message: "هذا التصنيف موجود بالفعل",
      };
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
  } catch {
    return {
      success: false,
      message: "حدث خطأ أثناء تعديل التصنيف",
    };
  }
};
