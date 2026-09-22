import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return null;
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.user.findUnique({
    where: { id: payload.userId as number },
  });

  return user;
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return apiError(ErrorMessages.CURRENT_NEW_PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (newPassword.length < 8) {
      return apiError(ErrorMessages.PASSWORD_MIN_LENGTH, StatusCodes.BAD_REQUEST);
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return apiError(ErrorMessages.CURRENT_PASSWORD_INCORRECT, StatusCodes.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
