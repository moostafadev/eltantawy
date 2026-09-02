"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { editDiscountSchema } from "./schema";

export const editDiscountAction = async (id: string, values: unknown) => {
  const result = editDiscountSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
    };
  }

  const {
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
    const discount = await prisma.discount.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!discount) {
      return {
        success: false,
        message: "الخصم غير موجود",
      };
    }

    if (discount.type === "COUPON") {
      if (!code || code.trim().length < 3) {
        return {
          success: false,
          message: "كود الخصم مطلوب ويجب أن يكون 3 أحرف على الأقل",
        };
      }

      const normalizedCode = code.trim().toUpperCase();

      const existingCode = await prisma.discount.findFirst({
        where: {
          code: normalizedCode,
          NOT: {
            id,
          },
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

      await prisma.discount.update({
        where: {
          id,
        },
        data: {
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
      // خصم سريع: امنع تفعيل أكتر من خصم واحد من نفس النوع في نفس الوقت
      if (isActive) {
        const existingActive = await prisma.discount.findFirst({
          where: {
            type: discount.type,
            isActive: true,
            NOT: {
              id,
            },
          },
          select: {
            id: true,
          },
        });

        if (existingActive) {
          return {
            success: false,
            message:
              "يوجد بالفعل خصم مفعّل من هذا النوع، قم بتعطيله أولًا قبل تفعيل هذا الخصم",
          };
        }
      }

      await prisma.discount.update({
        where: {
          id,
        },
        data: {
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
    revalidatePath(`/admin/settings/discounts/${id}`);

    return {
      success: true,
      message: "تم تعديل الخصم بنجاح",
    };
  } catch (error) {
    console.error("EDIT_DISCOUNT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تعديل الخصم",
    };
  }
};
