/**
 * Server-only entry point for Server Actions and services.
 *
 * Never import this module from a Client Component: `pusherServer` contains
 * `PUSHER_SECRET`, which would otherwise be included in the browser bundle.
 * Client Components should import from `@/lib/realtime/pusher-client` and
 * `@/lib/realtime/constants` instead.
 */

export { pusherServer } from "./pusher-server";
export { pusherClient } from "./pusher-client";
export { ADMIN_ORDERS_CHANNEL, ORDER_EVENTS } from "./constants";
export type { OrderEventName } from "./constants";
