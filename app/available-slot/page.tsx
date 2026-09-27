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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import Basketball from "@/app/components/landing/Basketball";
import CourtBackdrop from "@/app/components/landing/CourtBackdrop";

interface Slot {
  id: number;
  time: string;
  court: string;
  status: string;
}

interface Reservation {
  id: number;
  slotId: number;
  userId: number;
  status: string;
  notes: string | null;
  createdAt: string;
  slot: Slot | null;
  user: { id: number; name: string | null; email: string } | null;
}

function statusVariant(status: string) {
  switch (status) {
    case "Available":
      return "default" as const;
    case "Booked":
      return "destructive" as const;
    case "Maintenance":
      return "secondary" as const;
    case "Pending":
      return "outline" as const;
    case "Approved":
      return "default" as const;
    case "Rejected":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default function AvailableSlotPage() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const [slots, setSlots] = useState<Slot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);
  const [reserveSlot, setReserveSlot] = useState<Slot | null>(null);
  const [formData, setFormData] = useState({ time: "", court: "", status: "Available" });
  const [reserveNotes, setReserveNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
    fetchReservations();
  }, [token]);

  const activeTab = selectedTab ?? (isAdmin ? "reservations" : "slots");

  const fetchSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      const data = await response.json();
      setSlots(data.slots || []);
    } catch {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch {
      toast.error("Failed to load reservations");
    }
  };

  const resetForm = () => {
    setFormData({ time: "", court: "", status: "Available" });
    setErrors({});
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time || !formData.court) {
      setErrors({ time: !formData.time ? "Time is required" : "", court: !formData.court ? "Court is required" : "" });
      return;
    }
    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSlots((prev) => [data.slot, ...prev]);
      setAddOpen(false);
      resetForm();
      toast.success("Slot added", { description: `${formData.time} at ${formData.court} has been added.` });
    } catch {
      toast.error("Failed to add slot");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlot) return;
    try {
      const response = await fetch("/api/slots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editSlot.id, ...formData }),
      });
      if (!response.ok) throw new Error();
      setSlots((prev) => prev.map((s) => (s.id === editSlot.id ? { ...s, ...formData } : s)));
      setEditSlot(null);
      resetForm();
      toast.success("Slot updated");
    } catch {
      toast.error("Failed to update slot");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      const response = await fetch(`/api/slots?id=${deleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      const slot = slots.find((s) => s.id === deleteId);
      setSlots((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      toast.success("Slot deleted", { description: `${slot?.time} at ${slot?.court} has been removed.` });
    } catch {
      toast.error("Failed to delete slot");
    }
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveSlot || !token) return;
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slotId: reserveSlot.id, notes: reserveNotes }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to reserve slot");
        return;
      }
      setReserveSlot(null);
      setReserveNotes("");
      fetchReservations();
      toast.success("Reservation submitted", { description: "Your reservation is pending approval." });
    } catch {
      toast.error("Failed to reserve slot");
    }
  };

  const handleApproveReject = async (reservationId: number, action: "approve" | "reject") => {
    if (!token) return;
    setProcessingId(reservationId);
    try {
      const response = await fetch("/api/reservations/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reservationId, action }),
      });
      if (!response.ok) throw new Error();
      setReservations((prev) => prev.map((r) => r.id === reservationId ? { ...r, status: action === "approve" ? "Approved" : "Rejected" } : r));
      if (action === "approve") {
        const res = reservations.find((r) => r.id === reservationId);
        if (res?.slot) {
          setSlots((prev) => prev.map((s) => s.id === res.slotId ? { ...s, status: "Booked" } : s));
        }
      }
      toast.success(action === "approve" ? "Reservation approved" : "Reservation rejected");
    } catch {
      toast.error("Failed to process reservation");
    } finally {
      setProcessingId(null);
    }
  };

  const openEdit = (slot: Slot) => {
    setFormData({ time: slot.time, court: slot.court, status: slot.status });
    setEditSlot(slot);
  };

  const counts = {
    available: slots.filter((s) => s.status === "Available").length,
    booked: slots.filter((s) => s.status === "Booked").length,
    maintenance: slots.filter((s) => s.status === "Maintenance").length,
  };

  const pendingReservations = reservations.filter((r) => r.status === "Pending");

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
          <CourtBackdrop />
          <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Booking
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">Available Slots</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
        <CourtBackdrop />
        <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Courts
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">
              Available Slots
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Manage court booking slots and availability across all venues.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {isAdmin && (
              <Button
                onClick={() => {
                  resetForm();
                  setAddOpen(true);
                }}
                className="h-11 rounded-full bg-court px-6 text-sm font-bold uppercase tracking-wide text-black hover:bg-court/90"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            )}
            <Basketball className="hidden h-auto w-24 shrink-0 animate-float sm:block lg:w-32" />
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-court/30 bg-court/5 hover:-translate-y-1 hover:border-court/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">Available</CardDescription>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-500">
              <Check className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="font-display text-5xl leading-none text-green-600">{counts.available}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5 hover:-translate-y-1 hover:border-destructive/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">Booked</CardDescription>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-500">
              <X className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="font-display text-5xl leading-none text-red-600">{counts.booked}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-yellow-500/30 bg-yellow-500/5 hover:-translate-y-1 hover:border-yellow-500/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">Maintenance</CardDescription>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-500">
              <Loader2 className="h-5 w-5" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="font-display text-5xl leading-none text-yellow-600">{counts.maintenance}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value, details) => {
          if (details.reason === "none") setSelectedTab(value);
        }}
      >
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="slots">Slots</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="reservations">
              Reservations
              {pendingReservations.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingReservations.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="slots" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>All Slots</CardTitle>
              <CardDescription>Showing all booking slots across courts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Court</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No slots available</TableCell>
                    </TableRow>
                  ) : (
                    slots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="font-medium">{slot.time}</TableCell>
                        <TableCell>{slot.court}</TableCell>
                        <TableCell><Badge variant={statusVariant(slot.status)}>{slot.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {isAdmin ? (
                              <>
                                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(slot)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(slot.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            ) : (
                              slot.status === "Available" && (
                                <Button variant="ghost" size="sm" onClick={() => setReserveSlot(slot)}>
                                  Reserve
                                </Button>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="reservations" className="mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Pending Reservations</CardTitle>
                <CardDescription>Review and approve user reservation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Slot</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No reservations yet</TableCell>
                      </TableRow>
                    ) : (
                      reservations.map((res) => (
                        <TableRow key={res.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{res.user?.name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{res.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{res.slot?.time} - {res.slot?.court}</TableCell>
                          <TableCell>{new Date(res.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell><Badge variant={statusVariant(res.status)}>{res.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            {res.status === "Pending" && (
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon-sm" onClick={() => handleApproveReject(res.id, "approve")} disabled={processingId === res.id}>
                                  {processingId === res.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => handleApproveReject(res.id, "reject")} disabled={processingId === res.id}>
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Slot Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Slot</DialogTitle>
            <DialogDescription>Add a new booking slot.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="add-time">Time</Label>
              <Input id="add-time" placeholder="e.g. 9:00 AM - 10:00 AM" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} className={errors.time ? "border-destructive" : ""} />
              {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-court">Court</Label>
              <Input id="add-court" placeholder="e.g. Court 1" value={formData.court} onChange={(e) => setFormData((p) => ({ ...p, court: e.target.value }))} className={errors.court ? "border-destructive" : ""} />
              {errors.court && <p className="text-sm text-destructive">{errors.court}</p>}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Add Slot</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Slot Dialog */}
      <Dialog open={editSlot !== null} onOpenChange={() => setEditSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Slot</DialogTitle>
            <DialogDescription>Update slot details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input id="edit-time" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-court">Court</Label>
              <Input id="edit-court" value={formData.court} onChange={(e) => setFormData((p) => ({ ...p, court: e.target.value }))} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reserve Slot Dialog */}
      <Dialog open={reserveSlot !== null} onOpenChange={() => setReserveSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Slot</DialogTitle>
            <DialogDescription>Request to reserve {reserveSlot?.time} at {reserveSlot?.court}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReserve} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="reserve-notes">Notes (optional)</Label>
              <Input id="reserve-notes" placeholder="Any additional notes..." value={reserveNotes} onChange={(e) => setReserveNotes(e.target.value)} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Submit Reservation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Slot</DialogTitle>
            <DialogDescription>Are you sure you want to delete this slot? This action cannot be undone.</DialogDescription>
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
