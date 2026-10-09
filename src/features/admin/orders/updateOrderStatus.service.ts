"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  pusherServer,
  ADMIN_ORDERS_CHANNEL,
  ORDER_EVENTS,
} from "@/lib/realtime";

import {
  OrderStatusEnum,
  orderStatusTransitions,
  WEIGHT_CONFIRMATION_REQUIRED_BEFORE,
} from "./types";
import { getUserOrdersChannel } from "@/lib/realtime/constants";

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
        orderNumber: true,
        userId: true,
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

    /*
     * ================================
     * Require actual weights before dispatch
     * ================================
     *
     * Every weight-range item must have a confirmed actual weight before
     * the order moves to "out for delivery", so its final price is accurate.
     */
    if (nextStatus === WEIGHT_CONFIRMATION_REQUIRED_BEFORE) {
      const unconfirmedCount = await prisma.orderItem.count({
        where: {
          orderId: id,
          isApprox: true,
          weightConfirmed: false,
        },
      });

      if (unconfirmedCount > 0) {
        return {
          success: false,
          message: `يوجد ${unconfirmedCount} منتج بوزن تقريبي لم يتم تحديد الوزن الفعلي له بعد، يرجى تأكيد الوزن أولًا`,
        };
      }
    }

    await prisma.$transaction([
      prisma.order.update({
        where: {
          id,
        },
        data: {
          status: nextStatus,
        },
      }),

      prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: nextStatus,
        },
      }),
    ]);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");
    revalidatePath("/profile/orders");

    /*
     * ================================
     * Notify the admin of the order status change in real time.
     * ================================
     *
     * A notification failure must not affect the successful status update.
     */
    try {
      await pusherServer.trigger(
        ADMIN_ORDERS_CHANNEL,
        ORDER_EVENTS.STATUS_UPDATED,
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: nextStatus,
        },
      );

      /* Notify the customer who owns the order, when it is linked to an account. */
      if (order.userId) {
        await pusherServer.trigger(
          getUserOrdersChannel(order.userId),
          ORDER_EVENTS.STATUS_UPDATED,
          {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: nextStatus,
          },
        );
      }
    } catch (realtimeError) {
      console.error("ORDER_STATUS_REALTIME_ERROR:", realtimeError);
    }

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
