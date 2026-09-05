"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { CartService } from "@/lib/cart/service";
import { withOrderNumberRetry } from "@/lib/order/generateOrderNumber";

import { checkoutSchema } from "../schema";

/**
 * لو المستخدم مسجل دخول، بنربط الطلب بحسابه. لو مش مسجل (Guest)،
 * الطلب بيتم عادي وبتتخزن بياناته من الفورم فقط.
 */
const getCurrentUser = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
    },
  });
};

export const createOrderAction = async (values: unknown) => {
  const result = checkoutSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صحيحة",
    };
  }

  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryZoneId,
    addressLine,
    notes,
  } = result.data;

  try {
    const cart = await CartService.getHydratedCart();

    if (!cart.items.length) {
      return {
        success: false,
        message: "السلة فارغة",
      };
    }

    const zone = await prisma.deliveryZone.findUnique({
      where: {
        id: deliveryZoneId,
      },
      select: {
        id: true,
        title: true,
        cost: true,
        isActive: true,
      },
    });

    if (!zone || !zone.isActive || zone.cost === null) {
      return {
        success: false,
        message: "منطقة التوصيل غير متاحة حاليًا",
      };
    }

    const deliveryFee = zone.cost;

    const total =
      cart.subtotal - cart.discount - cart.discountAmount + deliveryFee;

    const currentUser = await getCurrentUser();

    const order = await withOrderNumberRetry((orderNumber) =>
      prisma.order.create({
        data: {
          orderNumber,

          userId: currentUser?.id ?? null,

          customerName,
          customerPhone,
          customerEmail: customerEmail || null,

          deliveryZoneId: zone.id,
          deliveryZoneTitle: zone.title,
          deliveryFee,

          addressLine,
          notes: notes || null,

          subtotal: cart.subtotal,
          productsDiscount: cart.discount,
          couponCode: cart.couponCode,
          discountAmount: cart.discountAmount,
          appliedDiscountSource: cart.appliedDiscountSource,
          total,

          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              title: item.product.title,
              image: item.product.image,
              unit: item.unit,
              price: item.price,
              qty: item.qty,
              weightOptionId: item.weightOptionId ?? null,
              weightOptionName: item.weightOption?.name ?? null,
              isApprox: item.isApprox,
              minTotal: item.minTotal ?? null,
              maxTotal: item.maxTotal ?? null,
              total: item.total,
            })),
          },
        },
        select: {
          orderNumber: true,
        },
      }),
    );

    await CartService.clear();

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء الطلب",
    };
  }
};
