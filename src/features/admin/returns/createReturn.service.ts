"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createReturnSchema } from "./schema";

export const createReturnAction = async (values: unknown) => {
  const result = createReturnSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const { orderId, reason, items } = result.data;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        status: true,
        items: {
          select: {
            id: true,
            price: true,
            qty: true,
            returnedQty: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "الطلب غير موجود",
      };
    }

    if (order.status !== "DELIVERED") {
      return {
        success: false,
        message: "لا يمكن إنشاء مرتجع إلا لطلب تم توصيله بالفعل",
      };
    }

    const orderItemsMap = new Map(order.items.map((item) => [item.id, item]));

    let refundAmount = 0;

    const returnItemsData: {
      orderItemId: string;
      qty: number;
      amount: number;
    }[] = [];

    for (const requestedItem of items) {
      const orderItem = orderItemsMap.get(requestedItem.orderItemId);

      if (!orderItem) {
        return {
          success: false,
          message: "أحد العناصر المحددة غير موجود في هذا الطلب",
        };
      }

      const availableQty = orderItem.qty - orderItem.returnedQty;

      if (requestedItem.qty > availableQty) {
        return {
          success: false,
          message: "الكمية المطلوب إرجاعها أكبر من الكمية المتاحة للإرجاع",
        };
      }

      const amount = orderItem.price * requestedItem.qty;

      refundAmount += amount;

      returnItemsData.push({
        orderItemId: requestedItem.orderItemId,
        qty: requestedItem.qty,
        amount,
      });
    }

    await prisma.orderReturn.create({
      data: {
        orderId,
        reason,
        refundAmount,
        items: {
          create: returnItemsData,
        },
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/returns");

    return {
      success: true,
      message: "تم إنشاء طلب الإرجاع بنجاح، بانتظار المراجعة",
    };
  } catch (error) {
    console.error("CREATE_RETURN_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء المرتجع",
    };
  }
};
