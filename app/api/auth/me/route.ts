import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/src/prisma/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await db.orm.public.User
      .where((u) => u.id.eq(payload.userId as number))
      .first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
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
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
