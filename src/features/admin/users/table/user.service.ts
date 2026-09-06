"use server";

import { prisma } from "@/lib/prisma";

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fName: true,
      lName: true,
      phone: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });
};

/**
 * تجميع طلبات الضيوف (userId = null) حسب رقم الهاتف، لعرضهم كـ "مستخدمين"
 * في جدول الأدمن رغم عدم وجود حساب User فعلي لهم.
 *
 * التجميع بيتم في الذاكرة بدل استخدام groupBy، لأن الحجم المتوقع
 * لطلبات الضيوف صغير نسبيًا، وده بيضمن توافق كامل مع MongoDB.
 */
export const getGuestUsers = async () => {
  const guestOrders = await prisma.order.findMany({
    where: {
      userId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      createdAt: true,
    },
  });

  const map = new Map<
    string,
    {
      customerName: string;
      customerPhone: string;
      customerEmail: string | null;
      createdAt: Date;
      ordersCount: number;
    }
  >();

  for (const order of guestOrders) {
    const existing = map.get(order.customerPhone);

    if (existing) {
      existing.ordersCount += 1;

      // نحتفظ ببيانات آخر طلب (الاسم/الإيميل) كأحدث تمثيل للضيف
      if (order.createdAt > existing.createdAt) {
        existing.createdAt = order.createdAt;
        existing.customerName = order.customerName;
        existing.customerEmail = order.customerEmail;
      }

      continue;
    }

    map.set(order.customerPhone, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      createdAt: order.createdAt,
      ordersCount: 1,
    });
  }

  return Array.from(map.values());
};
