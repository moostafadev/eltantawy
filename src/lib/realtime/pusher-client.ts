"use client";

import PusherClient from "pusher-js";

const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!key || !cluster) {
  throw new Error("Pusher public environment variables are missing");
}

/*
 * Share one browser instance instead of opening a new connection each time
 * a component using Pusher renders.
 *
 * `channelAuthorization` is required only for private and presence channels
 * such as `private-user-orders-*`; public channels such as `admin-orders`
 * do not require authorization.
 */
export const pusherClient = new PusherClient(key, {
  cluster,
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
});
