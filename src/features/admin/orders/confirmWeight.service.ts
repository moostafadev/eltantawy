"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

/**
 * تأكيد الوزن الفعلي لعنصر طلب واحد من نوع "نطاق وزن".
 *
 * بيحسب السعر النهائي الدقيق = سعر الوحدة × الوزن الفعلي × عدد العبوات،
 * وبيعدّل إجمالي الطلب (subtotal / total) بمقدار الفرق بين السعر
 * القديم (التقريبي) والسعر الجديد (الدقيق)، من غير ما يمس قيمة
 * الخصومات المطبّقة أصلًا وقت الطلب.
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
     * تعديل إجمالي الطلب بمقدار الفرق فقط، بدون إعادة حساب الخصومات
     * (الكوبون/الخصم التلقائي متجمّد بقيمته وقت إنشاء الطلب)
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
 * هل الطلب فيه عناصر نطاق وزن لسه محتاجة تأكيد الوزن الفعلي؟
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
