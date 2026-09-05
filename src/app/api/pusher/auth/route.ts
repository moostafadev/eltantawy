import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyAccessToken } from "@/lib/auth";
import { pusherServer } from "@/lib/realtime/pusher-server";

/**
 * Pusher بيستدعي الـ Endpoint ده تلقائيًا كل ما Client Component يحاول
 * يعمل subscribe على private channel، عشان نتأكد إن المستخدم مسموحله
 * فعلًا يشترك في الـ channel المطلوب قبل ما نوافق على الطلب.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const formData = await request.formData();

    const socketId = formData.get("socket_id") as string;
    const channelName = formData.get("channel_name") as string;

    if (!socketId || !channelName) {
      return NextResponse.json(
        { message: "بيانات الطلب غير مكتملة" },
        { status: 400 },
      );
    }

    /*
     * التأكد إن المستخدم بيحاول يشترك في الـ channel الخاص بيه هو بس،
     * مش channel خاص بمستخدم تاني
     */
    const expectedChannel = `private-user-orders-${payload.userId}`;

    if (channelName !== expectedChannel) {
      return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("PUSHER_AUTH_ERROR:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء التحقق" },
      { status: 500 },
    );
  }
}
