import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.user.findUnique({
    where: { id: payload.userId as number },
  });
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    let reservations;
    if (user.role === "admin") {
      reservations = await db.reservation.findMany();
    } else {
      reservations = await db.reservation.findMany({
        where: { userId: user.id },
      });
    }

    const reservationsWithDetails = await Promise.all(
      reservations.map(async (r) => {
        const slot = await db.slot.findUnique({ where: { id: r.slotId } });
        const resUser = await db.user.findUnique({ where: { id: r.userId } });
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
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    const body = await request.json();
    const { slotId, notes } = body;

    if (!slotId) return apiError(ErrorMessages.SLOT_ID_REQUIRED, StatusCodes.BAD_REQUEST);

    const slot = await db.slot.findUnique({ where: { id: slotId } });
    if (!slot) return apiError(ErrorMessages.SLOT_NOT_FOUND, StatusCodes.NOT_FOUND);
    if (slot.status !== "Available") return apiError(ErrorMessages.SLOT_NOT_AVAILABLE, StatusCodes.BAD_REQUEST);

    const existingReservation = await db.reservation.findFirst({
      where: { slotId, status: "Pending" },
    });

    if (existingReservation) return apiError(ErrorMessages.SLOT_HAS_PENDING_RESERVATION, StatusCodes.BAD_REQUEST);

    const reservation = await db.reservation.create({
      data: {
        slotId,
        userId: user.id,
        notes: notes || null,
      },
    });

    const admins = await db.user.findMany({
      where: { role: "admin" },
    });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "New Reservation Request",
          message: `${user.name || user.email} wants to reserve ${slot.time} at ${slot.court}`,
          type: "reservation",
        },
      });
    }

    return NextResponse.json({ reservation }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create reservation error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
