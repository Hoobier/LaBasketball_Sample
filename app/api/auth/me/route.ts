import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return apiError(ErrorMessages.NO_TOKEN, StatusCodes.UNAUTHORIZED);
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await db.user.findUnique({
      where: { id: payload.userId as number },
    });

    if (!user) {
      return apiError(ErrorMessages.USER_NOT_FOUND, StatusCodes.UNAUTHORIZED);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return apiError(ErrorMessages.INVALID_TOKEN, StatusCodes.UNAUTHORIZED);
  }
}
