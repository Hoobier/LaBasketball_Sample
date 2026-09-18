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

    let reservations;
    if (user.role === "admin") {
      reservations = await db.orm.public.Reservation.all();
    } else {
      reservations = await db.orm.public.Reservation.where((r) => r.userId.eq(user.id)).all();
    }

    const reservationsWithDetails = await Promise.all(
      reservations.map(async (r) => {
        const slot = await db.orm.public.Slot.where((s) => s.id.eq(r.slotId)).first();
        const resUser = await db.orm.public.User.where((u) => u.id.eq(r.userId)).first();
        return {
          ...r,
          slot,
          user: resUser ? { id: resUser.id, name: resUser.name, email: resUser.email } : null,
        };
      })
    );

    return NextResponse.json({ reservations: reservationsWithDetails });
  } catch (error) {
    console.error("Get reservations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slotId, notes } = body;

    if (!slotId) return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });

    const slot = await db.orm.public.Slot.where((s) => s.id.eq(slotId)).first();
    if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    if (slot.status !== "Available") return NextResponse.json({ error: "Slot is not available" }, { status: 400 });

    const existingReservation = await db.orm.public.Reservation.where(
      (r) => r.slotId.eq(slotId) && r.status.eq("Pending")
    ).first();

    if (existingReservation) return NextResponse.json({ error: "Slot already has a pending reservation" }, { status: 400 });

    const reservation = await db.orm.public.Reservation.create({
      slotId,
      userId: user.id,
      notes: notes || null,
    });

    const admins = await db.orm.public.User.where((u) => u.role.eq("admin")).all();
    for (const admin of admins) {
      await db.orm.public.Notification.create({
        userId: admin.id,
        title: "New Reservation Request",
        message: `${user.name || user.email} wants to reserve ${slot.time} at ${slot.court}`,
        type: "reservation",
      });
    }

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
