"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { CartService } from "@/lib/cart/service";
import { withOrderNumberRetry } from "@/lib/order/generateOrderNumber";
import { resend } from "@/lib/resend";
import { orderConfirmationEmail } from "@/lib/emails/order-confirmation-email";

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

    const currentUser = await getCurrentUser();

    /*
     * ================================
     * منع الطلب برقم هاتف مسجل لحساب مستخدم آخر
     * ================================
     *
     * لو الرقم المُدخل مسجل بالفعل لحساب، ومش نفس المستخدم الحالي
     * (سواء كان Guest أو مسجل دخول بحساب مختلف)، نرفض الطلب
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
          customerEmail: true,
          deliveryZoneTitle: true,
          addressLine: true,
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

    await CartService.clear();

    revalidatePath("/admin/orders");
    revalidatePath("/profile/orders");

    /*
     * ================================
     * إرسال إيميل تأكيد الطلب
     * ================================
     *
     * لو فشل الإرسال، الطلب يفضل ناجح ومنرجعش خطأ للمستخدم،
     * الإيميل مجرد إشعار إضافي مش جزء أساسي من نجاح العملية
     */
    if (order.customerEmail) {
      try {
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: [order.customerEmail],
          subject: `تم استلام طلبك #${order.orderNumber} - الطنطاوي`,
          html: orderConfirmationEmail({
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            items: order.items,
            subtotal: cart.subtotal,
            productsDiscount: cart.discount,
            discountAmount: cart.discountAmount,
            couponCode: cart.couponCode,
            deliveryFee,
            total: order.total,
            addressLine: order.addressLine,
            deliveryZoneTitle: order.deliveryZoneTitle,
            hasAccount: Boolean(currentUser),
          }),
        });

        if (error) {
          console.error("ORDER_CONFIRMATION_EMAIL_ERROR:", error);
        }
      } catch (emailError) {
        console.error("ORDER_CONFIRMATION_EMAIL_ERROR:", emailError);
      }
    }

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
