import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await db.user.findUnique({
      where: { id: payload.userId as number },
    });
    return user;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    let orders;
    if (user.role === "admin") {
      orders = await db.order.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await db.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db.orderItem.findMany({
          where: { orderId: order.id },
        });
        const orderUser = await db.user.findUnique({
          where: { id: order.userId },
          select: { id: true, name: true, email: true },
        });
        return { ...order, items, user: orderUser };
      })
    );

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error("Get orders error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);

    const body = await request.json();
    const { items, address, phone } = body;

    if (!items || items.length === 0) {
      return apiError(ErrorMessages.NO_ITEMS_IN_ORDER, StatusCodes.BAD_REQUEST);
    }

    if (!address || !phone) {
      return apiError(ErrorMessages.ADDRESS_PHONE_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return apiError(ErrorMessages.PRODUCT_NOT_FOUND, StatusCodes.BAD_REQUEST);
      }
      if (product.stock < item.quantity) {
        return apiError(`${ErrorMessages.INSUFFICIENT_STOCK} for "${product.name}"`, StatusCodes.BAD_REQUEST);
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await db.order.create({
      data: {
        userId: user.id,
        totalAmount,
        address,
        phone,
        status: "Pending",
      },
    });

    for (const item of orderItems) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });

      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const admins = await db.user.findMany({ where: { role: "admin" } });
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "New Order Received",
          message: `${user.name || user.email} placed an order worth ₱${totalAmount.toFixed(2)}`,
          type: "order",
        },
      });
    }

    return NextResponse.json({ order }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create order error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
