"use client";

import PusherClient from "pusher-js";

const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!key || !cluster) {
  throw new Error("Pusher public environment variables are missing");
}

/*
 * Instance واحد مشترك في المتصفح كله، بدل ما نعمل اتصال جديد
 * في كل مرة يتعمل فيها render لأي Component بيستخدمه.
 *
 * "channelAuthorization" مطلوب فقط للـ Private/Presence Channels
 * (زي private-user-orders-*)، الـ Public Channels (زي admin-orders)
 * مش محتاجة أي auth ومش بتستخدم الإعداد ده.
 */
export const pusherClient = new PusherClient(key, {
  cluster,
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
});
