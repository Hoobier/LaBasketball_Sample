import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await db.user.findUnique({
      where: { id: payload.userId as number },
    });
    if (!user || user.role !== "admin") return null;
    return user;
  } catch {
    return null;
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return apiError(ErrorMessages.ORDER_ID_STATUS_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return apiError(ErrorMessages.INVALID_STATUS, StatusCodes.BAD_REQUEST);
    }

    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) return apiError(ErrorMessages.ORDER_NOT_FOUND, StatusCodes.NOT_FOUND);

    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    await db.notification.create({
      data: {
        userId: order.userId,
        title: `Order ${status}`,
        message: `Your order #${orderId} has been ${status.toLowerCase()}.`,
        type: "order",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order status error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
