import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const [slots, schedules, venues, products, users] = await Promise.all([
      db.orm.public.Slot.all(),
      db.orm.public.Schedule.all(),
      db.orm.public.Venue.all(),
      db.orm.public.Product.all(),
      db.orm.public.User.all(),
    ]);

    const availableSlots = slots.filter((s) => s.status === "Available").length;
    const bookedSlots = slots.filter((s) => s.status === "Booked").length;
    const activeVenues = venues.filter((v) => v.status === "Active").length;
    const totalProductValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    const recentActivity = [
      ...slots.slice(-5).map((s) => ({
        type: "slot" as const,
        title: `Slot: ${s.time} - ${s.court}`,
        status: s.status,
        createdAt: s.createdAt,
      })),
      ...schedules.slice(-5).map((s) => ({
        type: "schedule" as const,
        title: s.title,
        status: s.type,
        createdAt: s.createdAt,
      })),
      ...venues.slice(-5).map((v) => ({
        type: "venue" as const,
        title: v.name,
        status: v.status,
        createdAt: v.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

    return NextResponse.json({
      stats: {
        availableSlots,
        bookedSlots,
        totalSlots: slots.length,
        upcomingSchedules: schedules.length,
        activeVenues,
        totalVenues: venues.length,
        totalProducts: products.length,
        totalProductValue,
        totalUsers: users.length,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
