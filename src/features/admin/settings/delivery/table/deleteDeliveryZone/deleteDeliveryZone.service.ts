"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const deleteDeliveryZoneTree = async (zoneId: string) => {
  const children = await prisma.deliveryZone.findMany({
    where: {
      parentId: zoneId,
    },
    select: {
      id: true,
    },
  });

  for (const child of children) {
    await deleteDeliveryZoneTree(child.id);
  }

  await prisma.deliveryZone.delete({
    where: {
      id: zoneId,
    },
  });
};

export const deleteDeliveryZoneAction = async (id: string) => {
  try {
    const zone = await prisma.deliveryZone.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!zone) {
      return {
        success: false,
        message: "المنطقة غير موجودة",
      };
    }

    await deleteDeliveryZoneTree(id);

    revalidatePath("/admin/settings/delivery");

    return {
      success: true,
      message: "تم حذف المنطقة وجميع المناطق الفرعية التابعة لها",
    };
  } catch (error) {
    console.error("DELETE_DELIVERY_ZONE_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف المنطقة",
    };
  }
};
