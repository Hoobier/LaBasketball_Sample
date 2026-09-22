import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return apiError(ErrorMessages.NAME_EMAIL_PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (password.length < 8) {
      return apiError(ErrorMessages.PASSWORD_MIN_LENGTH, StatusCodes.BAD_REQUEST);
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError(ErrorMessages.EMAIL_EXISTS, StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userCount = await db.user.count();
    const isFirstUser = userCount === 0;
    const userRole = isFirstUser ? "admin" : (role === "admin" ? "admin" : "user");

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: userRole,
      },
    });

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Signup error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
