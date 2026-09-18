import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return null;
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);
  const user = await db.orm.public.User
    .where((u) => u.id.eq(payload.userId as number))
    .first();

  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (email !== user.email) {
      const existingUser = await db.orm.public.User
        .where((u) => u.email.eq(email))
        .first();

      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    await db.orm.public.User
      .where((u) => u.id.eq(user.id))
      .update({ name, email });

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
