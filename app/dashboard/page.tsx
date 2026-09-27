"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
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
  Package,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import Basketball from "@/app/components/landing/Basketball";
import CourtBackdrop from "@/app/components/landing/CourtBackdrop";

// Hydration-safe "mounted" detection (server renders false, client true)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

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

export default function Dashboard() {
  const { user } = useAuth();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchDashboard();
  }, []);

  const firstName =
    mounted && user?.name ? ` ${user.name.trim().split(/\s+/)[0]}` : "";

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
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
          <CourtBackdrop />
          <div className="relative">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Dashboard
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">
              Loading the court
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-court" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
        <CourtBackdrop />
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Dashboard
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">
              Welcome back{firstName}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Here&apos;s your overview — courts, games, venues and gear at a
              glance.
            </p>
          </div>
          <Basketball className="hidden h-auto w-24 shrink-0 animate-float sm:block lg:w-32" />
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="h-full rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-court/60">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-court/15 text-court">
                    <Icon className="h-4 w-4" />
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="font-display text-4xl leading-none uppercase">
                    {stat.value}
                  </div>
                  <CardDescription className="mt-2 text-xs">
                    {stat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="rounded-2xl">
          <CardHeader>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-court">
              The timeline
            </p>
            <CardTitle className="font-display text-2xl uppercase">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest bookings and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:border-court/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={activityBadgeVariant(activity.type)}
                      className="ml-2 shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-2xl">
          <CardHeader>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-court">
              Jump in
            </p>
            <CardTitle className="font-display text-2xl uppercase">
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex h-16 items-center justify-between rounded-xl border bg-card px-4 font-display text-sm uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-court hover:bg-court hover:text-black sm:h-20 sm:text-base"
                >
                  {action.title}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
