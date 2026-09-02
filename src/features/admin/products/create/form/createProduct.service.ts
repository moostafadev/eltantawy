"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { createProductSchema } from "./schema";

export const createProductAction = async (values: unknown) => {
  const result = createProductSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
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

    await prisma.product.create({
      data: {
        title,
        desc: desc || null,
        image: image || null,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        unit,
        categoryId: categoryId || null,
        saleType,
        weightOptions:
          saleType === "WEIGHT_RANGE" && weightOptions?.length
            ? {
                create: weightOptions.map((option) => ({
                  name: option.name,
                  minWeight: Number(option.minWeight),
                  maxWeight: Number(option.maxWeight),
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "تم إنشاء المنتج بنجاح",
    };
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء المنتج",
    };
  }
};
