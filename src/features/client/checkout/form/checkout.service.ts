"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { CartService } from "@/lib/cart/service";
import { HydratedCart } from "@/lib/cart/types";
import { withOrderNumberRetry } from "@/lib/order/generateOrderNumber";
import {
  pusherServer,
  ADMIN_ORDERS_CHANNEL,
  ORDER_EVENTS,
} from "@/lib/realtime";

import { checkoutSchema } from "../schema";
import { getUserOrdersChannel } from "@/lib/realtime/constants";

type CreateOrderResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      message: string;
      orderNumber: number;
      cart: HydratedCart;
    };

/**
 * Links the order to the current account when the customer is signed in.
 * Guest orders are created using only the submitted checkout details.
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

export const createOrderAction = async (
  values: unknown,
): Promise<CreateOrderResult> => {
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

    const currentUser = await getCurrentUser();

    /*
     * ================================
     * Prevent orders from using another account's registered phone number.
     * ================================
     *
     * Reject the order when the number belongs to a different user, whether
     * the customer is a guest or is signed in to another account.
     */
    const existingPhoneOwner = await prisma.user.findUnique({
      where: {
        phone: customerPhone,
      },
      select: {
        id: true,
      },
    });

    if (existingPhoneOwner && existingPhoneOwner.id !== currentUser?.id) {
      return {
        success: false,
        message:
          "رقم الهاتف هذا مسجل بحساب بالفعل، يرجى تسجيل الدخول لإتمام الطلب",
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

    const order = await withOrderNumberRetry((orderNumber) =>
      prisma.order.create({
        data: {
          orderNumber,

          userId: currentUser?.id ?? null,

          customerName,
          customerPhone,
          customerEmail: null,

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
              minWeight: item.weightOption?.minWeight ?? null,
              maxWeight: item.weightOption?.maxWeight ?? null,
              minTotal: item.minTotal ?? null,
              maxTotal: item.maxTotal ?? null,
              total: item.total,
            })),
          },

          statusHistory: {
            create: {
              status: "PENDING",
            },
          },
        },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          deliveryZoneTitle: true,
          total: true,
          items: {
            select: {
              title: true,
              qty: true,
              unit: true,
              weightOptionName: true,
              isApprox: true,
              total: true,
              minTotal: true,
              maxTotal: true,
            },
          },
        },
      }),
    );

    const clearedCart = await CartService.clear();

    revalidatePath("/admin/orders");
    revalidatePath("/profile/orders");

    /*
     * ================================
     * Notify the admin about the new order in real time.
     * ================================
     *
     * A notification failure must not affect the successful order creation.
     */
    try {
      await pusherServer.trigger(ADMIN_ORDERS_CHANNEL, ORDER_EVENTS.CREATED, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
      });

      /*
       * Notify the account owner so the new order appears on their orders
       * page immediately without requiring a manual refresh.
       */
      if (currentUser) {
        await pusherServer.trigger(
          getUserOrdersChannel(currentUser.id),
          ORDER_EVENTS.CREATED,
          {
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
        );
      }
    } catch (realtimeError) {
      console.error("ORDER_CREATED_REALTIME_ERROR:", realtimeError);
    }

    return {
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      orderNumber: order.orderNumber,
      cart: clearedCart,
    };
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء الطلب",
    };
  }
};
