import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.orm.public.User.where((u) => u.id.eq(payload.userId as number)).first();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { reservationId, action } = body;

    if (!reservationId || !action) return NextResponse.json({ error: "Reservation ID and action are required" }, { status: 400 });
    if (action !== "approve" && action !== "reject") return NextResponse.json({ error: "Action must be 'approve' or 'reject'" }, { status: 400 });

    const reservation = await db.orm.public.Reservation.where((r) => r.id.eq(reservationId)).first();
    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    if (reservation.status !== "Pending") return NextResponse.json({ error: "Reservation is not pending" }, { status: 400 });

    const slot = await db.orm.public.Slot.where((s) => s.id.eq(reservation.slotId)).first();

    if (action === "approve") {
      await db.orm.public.Reservation.where((r) => r.id.eq(reservationId)).update({ status: "Approved" });
      await db.orm.public.Slot.where((s) => s.id.eq(reservation.slotId)).update({ status: "Booked" });

      await db.orm.public.Notification.create({
        userId: reservation.userId,
        title: "Reservation Approved",
        message: `Your reservation for ${slot?.time} at ${slot?.court} has been approved`,
        type: "approval",
      });
    } else {
      await db.orm.public.Reservation.where((r) => r.id.eq(reservationId)).update({ status: "Rejected" });

      await db.orm.public.Notification.create({
        userId: reservation.userId,
        title: "Reservation Rejected",
        message: `Your reservation for ${slot?.time} at ${slot?.court} has been rejected`,
        type: "rejection",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve reservation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
