"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { ReturnStatusEnum, returnStatusTransitions } from "./types";

export const updateReturnStatusAction = async (
  id: string,
  nextStatus: ReturnStatusEnum,
) => {
  try {
    const orderReturn = await prisma.orderReturn.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!orderReturn) {
      return {
        success: false,
        message: "المرتجع غير موجود",
      };
    }

    const allowedTransitions =
      returnStatusTransitions[orderReturn.status as ReturnStatusEnum];

    if (!allowedTransitions.includes(nextStatus)) {
      return {
        success: false,
        message: "لا يمكن تغيير حالة المرتجع إلى هذه الحالة",
      };
    }

    /*
     * When a return is completed (`REFUNDED`), update the returned quantity
     * for each affected order item and the order's refunded amount, which is
     * used to calculate net sales. Keep all updates in one transaction.
     */
    if (nextStatus === "REFUNDED") {
      await prisma.$transaction(async (tx) => {
        for (const item of orderReturn.items) {
          await tx.orderItem.update({
            where: {
              id: item.orderItemId,
            },
            data: {
              returnedQty: {
                increment: item.qty,
              },
            },
          });
        }

        await tx.order.update({
          where: {
            id: orderReturn.orderId,
          },
          data: {
            refundedAmount: {
              increment: orderReturn.refundAmount,
            },
          },
        });

        await tx.orderReturn.update({
          where: {
            id,
          },
          data: {
            status: nextStatus,
          },
        });
      });
    } else {
      await prisma.orderReturn.update({
        where: {
          id,
        },
        data: {
          status: nextStatus,
        },
      });
    }

    revalidatePath(`/admin/orders/${orderReturn.orderId}`);
    revalidatePath("/admin/returns");
    revalidatePath("/admin");

    return {
      success: true,
      message: "تم تحديث حالة المرتجع بنجاح",
    };
  } catch (error) {
    console.error("UPDATE_RETURN_STATUS_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء تحديث حالة المرتجع",
    };
  }
};
