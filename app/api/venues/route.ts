import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const venues = await db.orm.public.Venue.all();
    return NextResponse.json({ venues });
  } catch (error) {
    console.error("Get venues error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, courts, capacity, status } = body;

    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
    }

    const venue = await db.orm.public.Venue.create({
      name,
      address,
      courts: courts || 1,
      capacity: capacity || 0,
      status: status || "Active",
    });

    return NextResponse.json({ venue }, { status: 201 });
  } catch (error) {
    console.error("Create venue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, address, courts, capacity, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const venue = await db.orm.public.Venue
      .where((v) => v.id.eq(id))
      .update({ name, address, courts, capacity, status });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("Update venue error:", error);
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

    await db.orm.public.Venue.where((v) => v.id.eq(parseInt(id))).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete venue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
