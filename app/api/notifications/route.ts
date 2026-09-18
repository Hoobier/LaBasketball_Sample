import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.orm.public.User.where((u) => u.id.eq(payload.userId as number)).first();
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await db.orm.public.Notification.where((n) => n.userId.eq(user.id)).all();
    const sorted = notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unreadCount = sorted.filter((n) => !n.read).length;

    return NextResponse.json({ notifications: sorted, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await db.orm.public.Notification.where((n) => n.userId.eq(user.id) && n.read.eq(false)).update({ read: true });
    } else if (notificationId) {
      await db.orm.public.Notification.where((n) => n.id.eq(notificationId)).update({ read: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
