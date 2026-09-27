import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Basketball from "./Basketball";
import CourtBackdrop from "./CourtBackdrop";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Court-line backdrop */}
      <CourtBackdrop />

      {/* Orange glow */}
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-court/30 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
          <span className="h-px w-10 bg-court" />
          L.A Basketball
        </p>

        <h1 className="font-display text-[clamp(3.25rem,13vw,10.5rem)] leading-[0.86] uppercase">
          Own
          <br />
          <span className="text-transparent [-webkit-text-stroke:2px_white]">
            the court
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Book courts in seconds, run with weekly games, and gear up with the
          freshest drops. This is where LA Basketball comes to play.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/signup" />}
            className="h-12 rounded-full bg-court px-8 text-sm font-bold uppercase tracking-wide text-black hover:bg-court/90"
          >
            Book a Court
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/products" />}
            className="h-12 rounded-full border-white/40 bg-transparent px-8 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black"
          >
            Shop Gear
          </Button>
        </div>

        {/* Floating ball */}
        <div
          className="pointer-events-none absolute right-[6%] top-1/2 hidden w-72 -translate-y-1/2 lg:block xl:w-96"
          aria-hidden="true"
        >
          <Basketball className="h-auto w-full animate-float drop-shadow-2xl" />
        </div>
      </div>

      {/* Bottom ticker strip */}
      <div className="relative border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 text-xs uppercase tracking-widest text-white/50 sm:px-6 lg:px-8">
          <span>Instant online booking</span>
          <span className="hidden sm:inline">·</span>
          <span>5 pro-grade courts</span>
          <span className="hidden sm:inline">·</span>
          <span>Weekly runs &amp; tournaments</span>
          <span className="hidden sm:inline">·</span>
          <span>Member-only drops</span>
        </div>
      </div>
    </section>
  );
}
