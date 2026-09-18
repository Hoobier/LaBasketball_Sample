import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const products = await db.orm.public.Product.all();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, stock } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const product = await db.orm.public.Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, category, stock } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const product = await db.orm.public.Product
      .where((p) => p.id.eq(id))
      .update({ name, description, price, category, stock });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
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

    await db.orm.public.Product.where((p) => p.id.eq(parseInt(id))).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
