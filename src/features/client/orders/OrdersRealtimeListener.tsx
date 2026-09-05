"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toaster";
import { pusherClient } from "@/lib/realtime/pusher-client";
import { getUserOrdersChannel, ORDER_EVENTS } from "@/lib/realtime/constants";
import { toArabicNums } from "@/utils/toArabicNums";

import { clientOrderStatusLabels, ClientOrderStatus } from "./types";

interface Props {
  userId: string;
}

interface OrderCreatedPayload {
  orderId: string;
  orderNumber: number;
}

interface OrderStatusUpdatedPayload {
  orderId: string;
  orderNumber: number;
  status: ClientOrderStatus;
}

/**
 * Component غير مرئي، بيستمع لأحداث Pusher الخاصة بطلبات المستخدم الحالي
 * فقط (عبر Private Channel)، وبيعرض Toast + يحدّث الصفحة عند وصول أي حدث.
 *
 * يُستخدم داخل صفحة "طلباتي" (profile/orders) وصفحة البروفايل الرئيسية.
 */
const OrdersRealtimeListener = ({ userId }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const channel = pusherClient.subscribe(getUserOrdersChannel(userId));

    const handleOrderCreated = (payload: OrderCreatedPayload) => {
      toast.success(`تم استلام طلبك #${toArabicNums(payload.orderNumber)}`);

      router.refresh();
    };

    const handleOrderStatusUpdated = (payload: OrderStatusUpdatedPayload) => {
      toast.info(
        `تم تحديث حالة طلبك #${toArabicNums(payload.orderNumber)} إلى ${clientOrderStatusLabels[payload.status]}`,
      );

      router.refresh();
    };

    channel.bind(ORDER_EVENTS.CREATED, handleOrderCreated);
    channel.bind(ORDER_EVENTS.STATUS_UPDATED, handleOrderStatusUpdated);

    return () => {
      channel.unbind(ORDER_EVENTS.CREATED, handleOrderCreated);
      channel.unbind(ORDER_EVENTS.STATUS_UPDATED, handleOrderStatusUpdated);
      pusherClient.unsubscribe(getUserOrdersChannel(userId));
    };
  }, [userId, router, toast]);

  return null;
};

export default OrdersRealtimeListener;
