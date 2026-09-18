import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const schedules = await db.orm.public.Schedule.all();
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Get schedules error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, time, court, team, type } = body;

    if (!title || !date || !time || !court || !team) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const schedule = await db.orm.public.Schedule.create({
      title,
      date,
      time,
      court,
      team,
      type: type || "Game",
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    console.error("Create schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, date, time, court, team, type } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const schedule = await db.orm.public.Schedule
      .where((s) => s.id.eq(id))
      .update({ title, date, time, court, team, type });

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Update schedule error:", error);
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

    await db.orm.public.Schedule.where((s) => s.id.eq(parseInt(id))).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
