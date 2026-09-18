import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { db } from "@/src/prisma/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await db.orm.public.User
      .where((u) => u.email.eq(email))
      .first();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userCount = await db.orm.public.User.all();
    const isFirstUser = userCount.length === 0;
    const userRole = isFirstUser ? "admin" : (role === "admin" ? "admin" : "user");

    const user = await db.orm.public.User.create({
      email,
      password: hashedPassword,
      name,
      role: userRole,
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
    }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
