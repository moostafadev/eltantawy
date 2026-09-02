"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createDeliveryZoneSchema } from "./schema";

export const createDeliveryZoneAction = async (values: unknown) => {
  const result = createDeliveryZoneSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const { title, parentId, cost, isActive } = result.data;

  try {
    const existingZone = await prisma.deliveryZone.findFirst({
      where: {
        title,
        parentId: parentId || null,
      },
      select: {
        id: true,
      },
    });

    if (existingZone) {
      return {
        success: false,
        message: "هذه المنطقة موجودة بالفعل",
      };
    }

    if (parentId) {
      const parentZone = await prisma.deliveryZone.findUnique({
        where: {
          id: parentId,
        },
        select: {
          id: true,
          cost: true,
        },
      });

      if (!parentZone) {
        return {
          success: false,
          message: "المنطقة الأب غير موجودة",
        };
      }

      if (parentZone.cost !== null) {
        return {
          success: false,
          message:
            "لا يمكن إضافة منطقة فرعية داخل منطقة عليها تكلفة توصيل بالفعل",
        };
      }
    }

    await prisma.deliveryZone.create({
      data: {
        title,
        cost: cost ? Number(cost) : null,
        parentId: parentId || null,
        isActive,
      },
    });

    revalidatePath("/admin/settings/delivery");
    revalidatePath("/admin/settings/delivery/create");

    return {
      success: true,
      message: "تم إنشاء منطقة التوصيل بنجاح",
    };
  } catch (error) {
    console.error("CREATE_DELIVERY_ZONE_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء المنطقة",
    };
  }
};
