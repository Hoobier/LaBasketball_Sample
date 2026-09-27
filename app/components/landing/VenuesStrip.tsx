"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Venue {
  id: number;
  name: string;
  address: string;
  courts: number;
  capacity: number;
  status: string;
}

export default function VenuesStrip() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/venues");
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!cancelled) setVenues(Array.isArray(data.venues) ? data.venues : []);
      } catch {
        // keep empty state below
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = venues.slice(0, 3);

  return (
    <section id="venues" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-court">
              Venues
            </p>
            <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] uppercase">
              Courts across
              <br />
              LA Basketball
            </h2>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/venue" />}
            className="rounded-full"
          >
            All venues
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border p-6"
              >
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
            <MapPin className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-display text-2xl uppercase">Home court loading</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              New venues are being added across LA Basketball — book your first
              run while the map fills up.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featured.map((venue) => (
              <div
                key={venue.id}
                className="group rounded-2xl border bg-card p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl uppercase leading-tight">
                    {venue.name}
                  </h3>
                  <Badge
                    variant={venue.status === "Active" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {venue.status}
                  </Badge>
                </div>
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {venue.address}
                </p>
                <div className="mt-5 flex items-center gap-4 border-t pt-4 text-sm">
                  <span className="font-semibold">
                    {venue.courts} {venue.courts === 1 ? "court" : "courts"}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {venue.capacity} capacity
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
