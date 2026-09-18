import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const slots = await db.orm.public.Slot.all();
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Get slots error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time, court, status } = body;

    if (!time || !court) {
      return NextResponse.json({ error: "Time and court are required" }, { status: 400 });
    }

    const slot = await db.orm.public.Slot.create({
      time,
      court,
      status: status || "Available",
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error("Create slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, time, court, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const slot = await db.orm.public.Slot
      .where((s) => s.id.eq(id))
      .update({ time, court, status });

    return NextResponse.json({ slot });
  } catch (error) {
    console.error("Update slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.orm.public.Slot.where((s) => s.id.eq(parseInt(id))).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
