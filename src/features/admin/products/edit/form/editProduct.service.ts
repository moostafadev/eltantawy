"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { editProductSchema } from "./schema";

export const editProductAction = async (id: string, values: unknown) => {
  const result = editProductSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
    };
  }

  const {
    title,
    desc,
    image,
    price,
    discountPrice,
    unit,
    categoryId,
    saleType,
    weightOptions,
  } = result.data;

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

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
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
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        title,
        desc: desc || null,
        image: image || null,
        price,
        discountPrice:
          discountPrice === "" || discountPrice === undefined
            ? null
            : discountPrice,
        unit,
        categoryId: categoryId || null,
        saleType,
        weightOptions: {
          deleteMany: {},
          create:
            saleType === "WEIGHT_RANGE" && weightOptions?.length
              ? weightOptions.map((option) => ({
                  name: option.name,
                  minWeight: option.minWeight,
                  maxWeight: option.maxWeight,
                }))
              : [],
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/admin/products/${id}/edit`);

    return {
      success: true,
      message: "تم تعديل المنتج بنجاح",
    };
  } catch (error) {
    console.error("EDIT_PRODUCT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تعديل المنتج",
    };
  }
};
