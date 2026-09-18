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
import { Building, Users, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

interface Venue {
  id: number;
  name: string;
  address: string;
  courts: number;
  capacity: number;
  status: string;
}

export default function VenuePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [venues, setVenues] = useState<Venue[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", courts: 1, capacity: 0, status: "Active" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venues");
      const data = await response.json();
      setVenues(data.venues || []);
    } catch {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", courts: 1, capacity: 0, status: "Active" });
    setErrors({});
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setErrors({ name: !formData.name ? "Name is required" : "", address: !formData.address ? "Address is required" : "" });
      return;
    }
    try {
      const response = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setVenues((prev) => [data.venue, ...prev]);
      setAddOpen(false);
      resetForm();
      toast.success("Venue added", { description: `"${formData.name}" has been added.` });
    } catch {
      toast.error("Failed to add venue");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVenue) return;
    try {
      const response = await fetch("/api/venues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editVenue.id, ...formData }),
      });
      if (!response.ok) throw new Error();
      setVenues((prev) => prev.map((v) => (v.id === editVenue.id ? { ...v, ...formData } : v)));
      setEditVenue(null);
      resetForm();
      toast.success("Venue updated");
    } catch {
      toast.error("Failed to update venue");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      const response = await fetch(`/api/venues?id=${deleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      const venue = venues.find((v) => v.id === deleteId);
      setVenues((prev) => prev.filter((v) => v.id !== deleteId));
      setDeleteId(null);
      toast.success("Venue deleted", { description: `"${venue?.name}" has been removed.` });
    } catch {
      toast.error("Failed to delete venue");
    }
  };

  const openEdit = (venue: Venue) => {
    setFormData({ name: venue.name, address: venue.address, courts: venue.courts, capacity: venue.capacity, status: venue.status });
    setEditVenue(venue);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Venues</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your basketball venues and facilities</p>
        </div>
        {isAdmin && (
          <Button className="w-full sm:w-auto" onClick={() => { resetForm(); setAddOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Venue
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No venues yet</p>
              <p className="text-sm text-muted-foreground">Add your first venue to get started</p>
            </CardContent>
          </Card>
        ) : (
          venues.map((venue) => (
            <Card key={venue.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">{venue.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={venue.status === "Active" ? "default" : "secondary"}>{venue.status}</Badge>
                    {isAdmin && (
                      <>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(venue)}>
                          <Building className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(venue.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription className="break-words">{venue.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4 shrink-0" />
                      Courts
                    </div>
                    <span className="font-medium">{venue.courts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      Capacity
                    </div>
                    <span className="font-medium">{venue.capacity > 0 ? `${venue.capacity} people` : "Open air"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Venue Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Venue</DialogTitle>
            <DialogDescription>Add a new basketball venue.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Venue Name</Label>
              <Input id="add-name" placeholder="e.g. LA Arena" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className={errors.name ? "border-destructive" : ""} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-address">Address</Label>
              <Input id="add-address" placeholder="e.g. 123 Main St, Los Angeles" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} className={errors.address ? "border-destructive" : ""} />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="add-courts">Courts</Label>
                <Input id="add-courts" type="number" min="1" value={formData.courts} onChange={(e) => setFormData((p) => ({ ...p, courts: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-capacity">Capacity</Label>
                <Input id="add-capacity" type="number" min="0" value={formData.capacity} onChange={(e) => setFormData((p) => ({ ...p, capacity: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-status">Status</Label>
              <select id="add-status" value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))} className="flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Add Venue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Venue Dialog */}
      <Dialog open={editVenue !== null} onOpenChange={() => setEditVenue(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>Update venue details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Venue Name</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-courts">Courts</Label>
                <Input id="edit-courts" type="number" min="1" value={formData.courts} onChange={(e) => setFormData((p) => ({ ...p, courts: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input id="edit-capacity" type="number" min="0" value={formData.capacity} onChange={(e) => setFormData((p) => ({ ...p, capacity: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select id="edit-status" value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))} className="flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
            <DialogTitle>Delete Venue</DialogTitle>
            <DialogDescription>Are you sure you want to delete this venue? This action cannot be undone.</DialogDescription>
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
