"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

/**
 * Confirms the actual weight for one order item sold by weight range.
 *
 * Calculates the final price as unit price × actual weight × package count,
 * then adjusts the order subtotal and total by the difference without
 * changing discounts that were fixed when the order was created.
 */
export const confirmItemActualWeightAction = async (
  orderItemId: string,
  actualWeight: number,
) => {
  try {
    if (!Number.isFinite(actualWeight) || actualWeight <= 0) {
      return {
        success: false,
        message: "الوزن الفعلي غير صحيح",
      };
    }

    const item = await prisma.orderItem.findUnique({
      where: {
        id: orderItemId,
      },
      select: {
        id: true,
        orderId: true,
        isApprox: true,
        price: true,
        qty: true,
        total: true,
        minWeight: true,
        maxWeight: true,
      },
    });

    if (!item) {
      return {
        success: false,
        message: "عنصر الطلب غير موجود",
      };
    }

    if (!item.isApprox) {
      return {
        success: false,
        message: "هذا العنصر ليس من نوع الوزن التقريبي",
      };
    }

    if (
      item.minWeight !== null &&
      item.maxWeight !== null &&
      (actualWeight < item.minWeight || actualWeight > item.maxWeight)
    ) {
      return {
        success: false,
        message: `الوزن الفعلي يجب أن يكون بين ${item.minWeight} و ${item.maxWeight} كجم`,
      };
    }

    const newTotal = item.price * actualWeight * item.qty;

    const delta = newTotal - item.total;

    await prisma.orderItem.update({
      where: {
        id: orderItemId,
      },
      data: {
        actualWeight,
        weightConfirmed: true,
        total: newTotal,
      },
    });

    /*
     * Apply only the price difference; discounts remain fixed at the values
     * recorded when the order was created.
     */
    if (delta !== 0) {
      await prisma.order.update({
        where: {
          id: item.orderId,
        },
        data: {
          subtotal: {
            increment: delta,
          },
          total: {
            increment: delta,
          },
        },
      });
    }

    revalidatePath(`/admin/orders/${item.orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/profile/orders");

    return {
      success: true,
      message: "تم تأكيد الوزن الفعلي وتحديث السعر النهائي بنجاح",
    };
  } catch (error) {
    console.error("CONFIRM_ITEM_WEIGHT_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تأكيد الوزن الفعلي",
    };
  }
};

/**
 * Checks whether an order has any weight-range items awaiting confirmation.
 */
export const hasUnconfirmedWeightItems = async (orderId: string) => {
  const count = await prisma.orderItem.count({
    where: {
      orderId,
      isApprox: true,
      weightConfirmed: false,
    },
  });

  return count > 0;
};
