import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";
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

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.orm.public.User
      .where((u) => u.id.eq(user.id))
      .update({ password: hashedPassword });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
