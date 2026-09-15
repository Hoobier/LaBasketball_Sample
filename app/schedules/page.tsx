"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";

const initialSchedules = [
  {
    id: 1,
    title: "Team Practice",
    date: "Sep 15, 2026",
    time: "9:00 AM",
    court: "Court A",
    team: "Eagles",
    type: "Practice",
  },
  {
    id: 2,
    title: "League Game",
    date: "Sep 16, 2026",
    time: "2:00 PM",
    court: "Court B",
    team: "Hawks vs Eagles",
    type: "Game",
  },
  {
    id: 3,
    title: "Youth Training",
    date: "Sep 17, 2026",
    time: "10:00 AM",
    court: "Court A",
    team: "U16 Squad",
    type: "Training",
  },
  {
    id: 4,
    title: "Open Court",
    date: "Sep 18, 2026",
    time: "5:00 PM",
    court: "Court A",
    team: "Public",
    type: "Open",
  },
  {
    id: 5,
    title: "Team Practice",
    date: "Sep 19, 2026",
    time: "9:00 AM",
    court: "Court B",
    team: "Wolves",
    type: "Practice",
  },
  {
    id: 6,
    title: "Championship Final",
    date: "Sep 20, 2026",
    time: "6:00 PM",
    court: "Court A",
    team: "Eagles vs Wolves",
    type: "Game",
  },
];

function typeBadgeVariant(type: string) {
  switch (type) {
    case "Game":
      return "default" as const;
    case "Practice":
      return "secondary" as const;
    case "Training":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId === null) return;
    const schedule = schedules.find((s) => s.id === deleteId);
    setSchedules((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
    toast.success("Schedule deleted", {
      description: `"${schedule?.title}" has been removed.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Schedules
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage upcoming events and bookings
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() =>
            toast.info("Coming soon", {
              description: "New schedule form will be available soon.",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">
                  {schedule.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={typeBadgeVariant(schedule.type)}>
                    {schedule.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteId(schedule.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardDescription>{schedule.team}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{schedule.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{schedule.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{schedule.court}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
