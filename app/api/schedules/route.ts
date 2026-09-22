import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

export async function GET() {
  try {
    const schedules = await db.schedule.findMany();
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Get schedules error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, time, court, team, type } = body;

    if (!title || !date || !time || !court || !team) {
      return apiError(ErrorMessages.ALL_FIELDS_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const schedule = await db.schedule.create({
      data: {
        title,
        date,
        time,
        court,
        team,
        type: type || "Game",
      },
    });

    return NextResponse.json({ schedule }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create schedule error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, date, time, court, team, type } = body;

    if (!id) {
      return apiError(ErrorMessages.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const schedule = await db.schedule.update({
      where: { id },
      data: { title, date, time, court, team, type },
    });

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Update schedule error:", error);
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

    await db.schedule.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
