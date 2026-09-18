"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Calendar,
  MapPin,
  TrendingUp,
  Package,
  Users,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  availableSlots: number;
  bookedSlots: number;
  totalSlots: number;
  upcomingSchedules: number;
  activeVenues: number;
  totalVenues: number;
  totalProducts: number;
  totalProductValue: number;
  totalUsers: number;
}

interface Activity {
  type: "slot" | "schedule" | "venue";
  title: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        { title: "Available Slots", value: stats.availableSlots.toString(), description: `${stats.bookedSlots} booked`, icon: CalendarCheck, href: "/available-slot" },
        { title: "Upcoming Schedules", value: stats.upcomingSchedules.toString(), description: "Events planned", icon: Calendar, href: "/schedules" },
        { title: "Active Venues", value: stats.activeVenues.toString(), description: `${stats.totalVenues} total`, icon: MapPin, href: "/venue" },
        { title: "Total Products", value: stats.totalProducts.toString(), description: `₱${stats.totalProductValue.toFixed(2)} value`, icon: Package, href: "/products" },
      ]
    : [];

  const quickActions = [
    { title: "New Booking", href: "/available-slot" },
    { title: "Add Schedule", href: "/schedules" },
    { title: "Add Venue", href: "/venue" },
    { title: "Add Product", href: "/products" },
  ];

  function activityBadgeVariant(type: string) {
    switch (type) {
      case "slot":
        return "default" as const;
      case "schedule":
        return "secondary" as const;
      case "venue":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Welcome back. Here&apos;s an overview of your system.</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Welcome back. Here&apos;s an overview of your system.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <CardDescription className="text-xs">{stat.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
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
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={activityBadgeVariant(activity.type)} className="ml-2 shrink-0">
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
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
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex h-16 sm:h-20 items-center justify-center rounded-md border bg-accent/50 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {action.title}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
