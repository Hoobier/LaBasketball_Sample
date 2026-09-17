"use client";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck, Calendar, MapPin, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Available Slots",
    value: "0",
    description: "No data yet",
    icon: CalendarCheck,
  },
  {
    title: "Upcoming Schedules",
    value: "0",
    description: "No data yet",
    icon: Calendar,
  },
  {
    title: "Active Venues",
    value: "0",
    description: "No data yet",
    icon: MapPin,
  },
  {
    title: "Total Bookings",
    value: "0",
    description: "No data yet",
    icon: TrendingUp,
  },
];

const quickActions = [
  { title: "New Booking", href: "/available-slot" },
  { title: "Add Schedule", href: "/schedules" },
  { title: "Add Venue", href: "/venue" },
  { title: "View Settings", href: "/settings" },
];

export default function Home() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome back. Here&apos;s an overview of your system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() =>
                toast.info(stat.title, { description: stat.description })
              }
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="flex h-16 sm:h-20 items-center justify-center rounded-md border bg-accent/50 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {action.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
