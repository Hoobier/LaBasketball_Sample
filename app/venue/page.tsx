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
import { Building, Users, Plus, Trash2 } from "lucide-react";

const initialVenues: Array<{
  id: number;
  name: string;
  courts: number;
  capacity: number;
  status: string;
  address: string;
}> = [];

export default function VenuePage() {
  const [venues, setVenues] = useState(initialVenues);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId === null) return;
    const venue = venues.find((v) => v.id === deleteId);
    setVenues((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
    toast.success("Venue deleted", {
      description: `"${venue?.name}" has been removed.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Venues
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your basketball venues and facilities
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() =>
            toast.info("Coming soon", {
              description: "Add venue form will be available soon.",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Venue
        </Button>
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
          <>
            {venues.map((venue) => (
              <Card key={venue.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg">
                      {venue.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{venue.status}</Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(venue.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="break-words">
                    {venue.address}
                  </CardDescription>
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
                      <span className="font-medium">
                        {venue.capacity > 0
                          ? `${venue.capacity} people`
                          : "Open air"}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          toast.info("Edit venue", {
                            description: `Editing ${venue.name}`,
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          toast.info("Venue details", {
                            description: `Viewing details for ${venue.name}`,
                          })
                        }
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Venue</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this venue? This action cannot be
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
