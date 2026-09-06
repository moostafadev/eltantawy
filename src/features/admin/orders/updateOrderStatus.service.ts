"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { orderStatusEmail } from "@/lib/emails/order-status-email";
import {
  pusherServer,
  ADMIN_ORDERS_CHANNEL,
  ORDER_EVENTS,
} from "@/lib/realtime";

import {
  OrderStatusEnum,
  orderStatusLabels,
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
        customerName: true,
        customerEmail: true,
        total: true,
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
     * منع الخروج للتوصيل قبل تأكيد الوزن الفعلي
     * ================================
     *
     * أي عنصر "نطاق وزن" في الطلب لازم يكون له وزن فعلي مؤكّد
     * قبل ما الطلب يوصل لحالة "خرج للتوصيل"، عشان السعر النهائي
     * يبقى دقيق وليس تقريبي
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
     * إشعار الأدمن Real-time بتغيير حالة الطلب
     * ================================
     *
     * فشل إرسال الإشعار لا يجب أن يؤثر على نجاح تحديث الحالة
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

      /*
       * إشعار المستخدم صاحب الطلب نفسه (لو الطلب مرتبط بحساب)
       */
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
