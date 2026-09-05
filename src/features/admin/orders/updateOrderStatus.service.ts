"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { OrderStatusEnum, orderStatusTransitions } from "./types";

export const updateOrderStatusAction = async (
  id: string,
  nextStatus: OrderStatusEnum,
) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!order) {
      return {
        success: false,
        message: "الطلب غير موجود",
      };
    }

    const allowedTransitions =
      orderStatusTransitions[order.status as OrderStatusEnum];

    if (!allowedTransitions.includes(nextStatus)) {
      return {
        success: false,
        message: "لا يمكن تغيير حالة الطلب إلى هذه الحالة",
      };
    }

    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: nextStatus,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");

    return {
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
    };
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تحديث حالة الطلب",
    };
  }
};
