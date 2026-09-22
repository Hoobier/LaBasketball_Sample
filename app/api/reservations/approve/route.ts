import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.user.findUnique({
    where: { id: payload.userId as number },
  });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    const body = await request.json();
    const { reservationId, action } = body;

    if (!reservationId || !action) return apiError(ErrorMessages.RESERVATION_ID_ACTION_REQUIRED, StatusCodes.BAD_REQUEST);
    if (action !== "approve" && action !== "reject") return apiError(ErrorMessages.INVALID_RESERVATION_ACTION, StatusCodes.BAD_REQUEST);

    const reservation = await db.reservation.findUnique({ where: { id: reservationId } });
    if (!reservation) return apiError(ErrorMessages.RESERVATION_NOT_FOUND, StatusCodes.NOT_FOUND);
    if (reservation.status !== "Pending") return apiError(ErrorMessages.RESERVATION_NOT_PENDING, StatusCodes.BAD_REQUEST);

    const slot = await db.slot.findUnique({ where: { id: reservation.slotId } });

    if (action === "approve") {
      await db.reservation.update({
        where: { id: reservationId },
        data: { status: "Approved" },
      });
      await db.slot.update({
        where: { id: reservation.slotId },
        data: { status: "Booked" },
      });

      await db.notification.create({
        data: {
          userId: reservation.userId,
          title: "Reservation Approved",
          message: `Your reservation for ${slot?.time} at ${slot?.court} has been approved`,
          type: "approval",
        },
      });
    } else {
      await db.reservation.update({
        where: { id: reservationId },
        data: { status: "Rejected" },
      });

      await db.notification.create({
        data: {
          userId: reservation.userId,
          title: "Reservation Rejected",
          message: `Your reservation for ${slot?.time} at ${slot?.court} has been rejected`,
          type: "rejection",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve reservation error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
