/**
 * Shared real-time channel and event names used by the server and client to
 * keep values consistent and avoid repeating magic strings.
 */

export const ADMIN_ORDERS_CHANNEL = "admin-orders";

/**
 * Returns a per-user private channel name. Pusher uses the auth endpoint at
 * `src/app/api/pusher/auth/route.ts` to verify the subscriber owns the account.
 */
export const getUserOrdersChannel = (userId: string) =>
  `private-user-orders-${userId}`;

export const ORDER_EVENTS = {
  CREATED: "order:created",
  STATUS_UPDATED: "order:status-updated",
} as const;

export type OrderEventName = (typeof ORDER_EVENTS)[keyof typeof ORDER_EVENTS];
