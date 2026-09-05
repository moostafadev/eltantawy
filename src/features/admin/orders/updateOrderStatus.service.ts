"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { orderStatusEmail } from "@/lib/emails/order-status-email";

import {
  OrderStatusEnum,
  orderStatusLabels,
  orderStatusTransitions,
} from "./types";

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
        customerName: true,
        customerEmail: true,
        total: true,
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
     * إشعار إيميل عند التوصيل فقط
     * ================================
     *
     * فشل الإرسال هنا لا يجب أن يؤثر على نجاح تحديث الحالة
     */
    if (nextStatus === "DELIVERED" && order.customerEmail) {
      try {
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: [order.customerEmail],
          subject: `تم توصيل طلبك #${order.orderNumber} - الطنطاوي`,
          html: orderStatusEmail({
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            statusLabel: orderStatusLabels.DELIVERED,
            total: order.total,
          }),
        });

        if (error) {
          console.error("ORDER_STATUS_EMAIL_ERROR:", error);
        }
      } catch (emailError) {
        console.error("ORDER_STATUS_EMAIL_ERROR:", emailError);
      }
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
