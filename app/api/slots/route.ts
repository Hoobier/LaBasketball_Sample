import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

export async function GET() {
  try {
    const slots = await db.slot.findMany();
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Get slots error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time, court, status } = body;

    if (!time || !court) {
      return apiError(ErrorMessages.TIME_COURT_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const slot = await db.slot.create({
      data: {
        time,
        court,
        status: status || "Available",
      },
    });

    return NextResponse.json({ slot }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create slot error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, time, court, status } = body;

    if (!id) {
      return apiError(ErrorMessages.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const slot = await db.slot.update({
      where: { id },
      data: { time, court, status },
    });

    return NextResponse.json({ slot });
  } catch (error) {
    console.error("Update slot error:", error);
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

    await db.slot.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete slot error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
