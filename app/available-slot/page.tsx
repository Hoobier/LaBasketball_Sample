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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const initialSlots = [
  { id: 1, time: "9:00 AM - 10:00 AM", court: "Court A", status: "Available" },
  { id: 2, time: "10:00 AM - 11:00 AM", court: "Court A", status: "Booked" },
  { id: 3, time: "11:00 AM - 12:00 PM", court: "Court B", status: "Available" },
  { id: 4, time: "1:00 PM - 2:00 PM", court: "Court A", status: "Available" },
  {
    id: 5,
    time: "2:00 PM - 3:00 PM",
    court: "Court B",
    status: "Maintenance",
  },
  { id: 6, time: "3:00 PM - 4:00 PM", court: "Court A", status: "Booked" },
  { id: 7, time: "4:00 PM - 5:00 PM", court: "Court B", status: "Available" },
  { id: 8, time: "5:00 PM - 6:00 PM", court: "Court A", status: "Available" },
];

function statusVariant(status: string) {
  switch (status) {
    case "Available":
      return "default" as const;
    case "Booked":
      return "destructive" as const;
    case "Maintenance":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export default function AvailableSlotPage() {
  const [slots, setSlots] = useState(initialSlots);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId === null) return;
    const slot = slots.find((s) => s.id === deleteId);
    setSlots((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
    toast.success("Slot deleted", {
      description: `${slot?.time} at ${slot?.court} has been removed.`,
    });
  };

  const counts = {
    available: slots.filter((s) => s.status === "Available").length,
    booked: slots.filter((s) => s.status === "Booked").length,
    maintenance: slots.filter((s) => s.status === "Maintenance").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Available Slots
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage court booking slots and availability
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() =>
            toast.info("Coming soon", {
              description: "Add slot form will be available soon.",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {counts.available}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Booked</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {counts.booked}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Maintenance</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {counts.maintenance}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>All Slots</CardTitle>
          <CardDescription>
            Showing all booking slots across courts
          </CardDescription>
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
              {slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium">{slot.time}</TableCell>
                  <TableCell>{slot.court}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(slot.status)}>
                      {slot.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          toast.info("Edit slot", {
                            description: `Editing ${slot.time} at ${slot.court}`,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(slot.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle>All Slots</CardTitle>
          <CardDescription>
            Showing all booking slots across courts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{slot.time}</p>
                  <p className="text-xs text-muted-foreground">{slot.court}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Badge variant={statusVariant(slot.status)}>
                    {slot.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      toast.info("Edit slot", {
                        description: `Editing ${slot.time} at ${slot.court}`,
                      })
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteId(slot.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Slot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this slot? This action cannot be
              undone.
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
