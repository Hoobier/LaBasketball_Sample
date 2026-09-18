"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

interface Schedule {
  id: number;
  title: string;
  date: string;
  time: string;
  court: string;
  team: string;
  type: string;
}

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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({ title: "", date: "", time: "", court: "", team: "", type: "Game" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", date: "", time: "", court: "", team: "", type: "Game" });
    setErrors({});
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.court || !formData.team) {
      setErrors({ title: !formData.title ? "Title is required" : "", date: !formData.date ? "Date is required" : "", time: !formData.time ? "Time is required" : "", court: !formData.court ? "Court is required" : "", team: !formData.team ? "Team is required" : "" });
      return;
    }
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSchedules((prev) => [data.schedule, ...prev]);
      setAddOpen(false);
      resetForm();
      toast.success("Schedule created", { description: `"${formData.title}" has been added.` });
    } catch {
      toast.error("Failed to create schedule");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSchedule) return;
    try {
      const response = await fetch("/api/schedules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editSchedule.id, ...formData }),
      });
      if (!response.ok) throw new Error();
      setSchedules((prev) => prev.map((s) => (s.id === editSchedule.id ? { ...s, ...formData } : s)));
      setEditSchedule(null);
      resetForm();
      toast.success("Schedule updated");
    } catch {
      toast.error("Failed to update schedule");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      const response = await fetch(`/api/schedules?id=${deleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      const schedule = schedules.find((s) => s.id === deleteId);
      setSchedules((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      toast.success("Schedule deleted", { description: `"${schedule?.title}" has been removed.` });
    } catch {
      toast.error("Failed to delete schedule");
    }
  };

  const openEdit = (schedule: Schedule) => {
    setFormData({ title: schedule.title, date: schedule.date, time: schedule.time, court: schedule.court, team: schedule.team, type: schedule.type });
    setEditSchedule(schedule);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Schedules</h1>
            <p className="text-muted-foreground text-sm sm:text-base">View and manage upcoming events and bookings</p>
          </div>
          {isAdmin && (
            <Button className="w-full sm:w-auto" onClick={() => { resetForm(); setAddOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Schedule
            </Button>
          )}
        </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No schedules yet</p>
              <p className="text-sm text-muted-foreground">Create your first schedule to get started</p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg">{schedule.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={typeBadgeVariant(schedule.type)}>{schedule.type}</Badge>
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(schedule)}>
                            <Calendar className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(schedule.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </>
                      )}
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
          ))
        )}
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Schedule</DialogTitle>
            <DialogDescription>Create a new event or booking.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="add-title">Title</Label>
              <Input id="add-title" placeholder="e.g. Team Practice" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className={errors.title ? "border-destructive" : ""} />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="add-date">Date</Label>
                <Input id="add-date" type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className={errors.date ? "border-destructive" : ""} />
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-time">Time</Label>
                <Input id="add-time" placeholder="e.g. 2:00 PM" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} className={errors.time ? "border-destructive" : ""} />
                {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-court">Court</Label>
              <Input id="add-court" placeholder="e.g. Court 1" value={formData.court} onChange={(e) => setFormData((p) => ({ ...p, court: e.target.value }))} className={errors.court ? "border-destructive" : ""} />
              {errors.court && <p className="text-sm text-destructive">{errors.court}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-team">Team</Label>
              <Input id="add-team" placeholder="e.g. Lakers" value={formData.team} onChange={(e) => setFormData((p) => ({ ...p, team: e.target.value }))} className={errors.team ? "border-destructive" : ""} />
              {errors.team && <p className="text-sm text-destructive">{errors.team}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-type">Type</Label>
              <select id="add-type" value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} className="flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
                <option value="Game">Game</option>
                <option value="Practice">Practice</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Create Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={editSchedule !== null} onOpenChange={() => setEditSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update schedule details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input id="edit-date" type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input id="edit-time" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-court">Court</Label>
              <Input id="edit-court" value={formData.court} onChange={(e) => setFormData((p) => ({ ...p, court: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-team">Team</Label>
              <Input id="edit-team" value={formData.team} onChange={(e) => setFormData((p) => ({ ...p, team: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <select id="edit-type" value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} className="flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
                <option value="Game">Game</option>
                <option value="Practice">Practice</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
