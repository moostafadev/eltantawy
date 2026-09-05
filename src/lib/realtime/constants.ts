/**
 * أسماء الـ Channel والـ Events الخاصة بالـ Realtime، بتُستخدم في السيرفر
 * والكلاينت عشان نضمن التطابق ونتجنب الـ "Magic Strings" المتكررة
 */

export const ADMIN_ORDERS_CHANNEL = "admin-orders";

/**
 * Private channel خاص بكل مستخدم على حدة، بيحتاج Auth Endpoint
 * (راجع src/app/api/pusher/auth/route.ts) عشان يتأكد Pusher إن المستخدم
 * اللي بيعمل subscribe هو فعلاً صاحب الحساب ده
 */
export const getUserOrdersChannel = (userId: string) =>
  `private-user-orders-${userId}`;

export const ORDER_EVENTS = {
  CREATED: "order:created",
  STATUS_UPDATED: "order:status-updated",
} as const;

export type OrderEventName = (typeof ORDER_EVENTS)[keyof typeof ORDER_EVENTS];
