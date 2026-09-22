import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { StatusCodes, ErrorMessages, apiError } from "@/lib/errors";

export async function GET() {
  try {
    const products = await db.product.findMany();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, stock } = body;

    if (!name || !description || !price || !category) {
      return apiError(ErrorMessages.ALL_FIELDS_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        category,
        stock: stock || 0,
      },
    });

    return NextResponse.json({ product }, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Create product error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, category, stock } = body;

    if (!id) {
      return apiError(ErrorMessages.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const product = await db.product.update({
      where: { id },
      data: { name, description, price, category, stock },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
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

    await db.product.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return apiError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
