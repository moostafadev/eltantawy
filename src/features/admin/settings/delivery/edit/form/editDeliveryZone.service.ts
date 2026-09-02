"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { editDeliveryZoneSchema } from "./schema";

export const editDeliveryZoneAction = async (id: string, values: unknown) => {
  const result = editDeliveryZoneSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات غير صحيحة",
    };
  }

  const { title, parentId, cost, isActive } = result.data;

  try {
    const zone = await prisma.deliveryZone.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    if (!zone) {
      return {
        success: false,
        message: "المنطقة غير موجودة",
      };
    }

    if (parentId === id) {
      return {
        success: false,
        message: "لا يمكن أن تكون المنطقة أبًا لنفسها",
      };
    }

    if (cost && zone._count.children > 0) {
      return {
        success: false,
        message: "لا يمكن تحديد تكلفة توصيل لمنطقة تحتوي على مناطق فرعية",
      };
    }

    const exists = await prisma.deliveryZone.findFirst({
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
          message: "لا يمكن نقل المنطقة داخل منطقة عليها تكلفة توصيل بالفعل",
        };
      }
    }

    await prisma.deliveryZone.update({
      where: {
        id,
      },
      data: {
        title,
        cost: cost ? Number(cost) : null,
        parentId: parentId || null,
        isActive,
      },
    });

    revalidatePath("/admin/settings/delivery");
    revalidatePath(`/admin/settings/delivery/${id}`);

    return {
      success: true,
      message: "تم تعديل المنطقة بنجاح",
    };
  } catch (error) {
    console.error("EDIT_DELIVERY_ZONE_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تعديل المنطقة",
    };
  }
};
