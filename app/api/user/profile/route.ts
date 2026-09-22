import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
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

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return apiError(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return apiError(ErrorMessages.NAME_EMAIL_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (email !== user.email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return apiError(ErrorMessages.EMAIL_IN_USE, StatusCodes.CONFLICT);
      }
    }

    await db.user.update({
      where: { id: user.id },
      data: { name, email },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email,
        name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
