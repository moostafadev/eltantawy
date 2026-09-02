"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createDiscountSchema } from "./schema";

export const createDiscountAction = async (values: unknown) => {
  const result = createDiscountSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const {
    type,
    code,
    valueType,
    value,
    minOrderAmount,
    maxDiscountAmount,
    usageLimit,
    startDate,
    endDate,
    isActive,
  } = result.data;

  try {
    if (type === "COUPON") {
      const normalizedCode = code!.trim().toUpperCase();

      const existingCode = await prisma.discount.findUnique({
        where: {
          code: normalizedCode,
        },
        select: {
          id: true,
        },
      });

      if (existingCode) {
        return {
          success: false,
          message: "هذا الكود مستخدم بالفعل",
        };
      }

      await prisma.discount.create({
        data: {
          type,
          code: normalizedCode,
          valueType,
          value: Number(value),
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
          maxDiscountAmount: maxDiscountAmount
            ? Number(maxDiscountAmount)
            : null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          isActive,
        },
      });
    } else {
      // خصم سريع (كل العملاء / المسجلين فقط): لا يُسمح بأكثر من خصم مفعّل واحد من نفس النوع في نفس الوقت
      if (isActive) {
        const existingActive = await prisma.discount.findFirst({
          where: {
            type,
            isActive: true,
          },
          select: {
            id: true,
          },
        });

        if (existingActive) {
          return {
            success: false,
            message:
              "يوجد بالفعل خصم مفعّل من هذا النوع، قم بتعطيله أولًا قبل إضافة خصم جديد",
          };
        }
      }

      await prisma.discount.create({
        data: {
          type,
          code: null,
          valueType,
          value: Number(value),
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
          maxDiscountAmount: maxDiscountAmount
            ? Number(maxDiscountAmount)
            : null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          isActive,
        },
      });
    }

    revalidatePath("/admin/settings/discounts");
    revalidatePath("/admin/settings/discounts/create");

    return {
      success: true,
      message: "تم إنشاء الخصم بنجاح",
    };
  } catch (error) {
    console.error("CREATE_DISCOUNT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء الخصم",
    };
  }
};
