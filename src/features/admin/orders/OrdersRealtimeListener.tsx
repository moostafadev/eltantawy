"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toaster";
import { pusherClient } from "@/lib/realtime/pusher-client";
import { ADMIN_ORDERS_CHANNEL, ORDER_EVENTS } from "@/lib/realtime/constants";
import { toArabicNums } from "@/utils/toArabicNums";

import { orderStatusLabels, OrderStatusEnum } from "./types";

interface OrderCreatedPayload {
  orderId: string;
  orderNumber: number;
  customerName: string;
}

interface OrderStatusUpdatedPayload {
  orderId: string;
  orderNumber: number;
  status: OrderStatusEnum;
}

/**
 * Invisible listener for Pusher order events. It displays a toast and
 * refreshes the current page when a new event arrives.
 *
 * Use it on admin pages that need live order updates, such as the orders
 * list and dashboard.
 */
const OrdersRealtimeListener = () => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const channel = pusherClient.subscribe(ADMIN_ORDERS_CHANNEL);

    const handleOrderCreated = (payload: OrderCreatedPayload) => {
      toast.info(
        `طلب جديد #${toArabicNums(payload.orderNumber)} من ${payload.customerName}`,
      );

      router.refresh();
    };

    const handleOrderStatusUpdated = (payload: OrderStatusUpdatedPayload) => {
      toast.info(
        `تم تحديث حالة الطلب #${toArabicNums(payload.orderNumber)} إلى ${orderStatusLabels[payload.status]}`,
      );

      router.refresh();
    };

    channel.bind(ORDER_EVENTS.CREATED, handleOrderCreated);
    channel.bind(ORDER_EVENTS.STATUS_UPDATED, handleOrderStatusUpdated);

    return () => {
      channel.unbind(ORDER_EVENTS.CREATED, handleOrderCreated);
      channel.unbind(ORDER_EVENTS.STATUS_UPDATED, handleOrderStatusUpdated);
      pusherClient.unsubscribe(ADMIN_ORDERS_CHANNEL);
    };
  }, [router, toast]);

  return null;
};

export default OrdersRealtimeListener;
