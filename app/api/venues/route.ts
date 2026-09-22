import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

export async function GET() {
  try {
    const venues = await db.venue.findMany();
    return NextResponse.json({ venues });
  } catch (error) {
    console.error("Get venues error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, courts, capacity, status } = body;

    if (!name || !address) {
      return apiError(ErrorMessages.NAME_ADDRESS_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const venue = await db.venue.create({
      data: {
        name,
        address,
        courts: courts || 1,
        capacity: capacity || 0,
        status: status || "Active",
      },
    });

    return NextResponse.json({ venue }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create venue error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, address, courts, capacity, status } = body;

    if (!id) {
      return apiError(ErrorMessages.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const venue = await db.venue.update({
      where: { id },
      data: { name, address, courts, capacity, status },
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("Update venue error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiError(ErrorMessages.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    await db.venue.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete venue error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
