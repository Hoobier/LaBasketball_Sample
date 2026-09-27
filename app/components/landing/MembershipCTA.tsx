import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Instant court booking, no phone calls",
  "Priority access to weekly runs & tournaments",
  "Member-only prices on gear drops",
];

export default function MembershipCTA() {
  return (
    <section id="membership" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-court/20 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-court">
            Membership
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] uppercase">
            Join
            <br />
            the run
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            One account unlocks the whole court — bookings, games, gear and the
            crew. Free to join, built for players who show up.
          </p>

          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-court">
                  <Check className="h-3 w-3 text-black" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              size="lg"
              render={<Link href="/signup" />}
              className="h-12 rounded-full bg-court px-8 text-sm font-bold uppercase tracking-wide text-black hover:bg-court/90"
            >
              Create free account
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login" />}
              className="h-12 rounded-full px-8 text-sm font-bold uppercase tracking-wide"
            >
              Sign in
            </Button>
          </div>
        </div>

        {/* Playbook card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171717] to-black p-6 text-white shadow-2xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            This week&apos;s run
          </p>
          <p className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Friday
            <br />
            Night Hoops
          </p>

          <svg
            viewBox="0 0 400 240"
            className="mt-6 h-auto w-full"
            aria-hidden="true"
          >
            <g stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" fill="none">
              <rect x="10" y="10" width="380" height="220" rx="10" />
              <line x1="200" y1="10" x2="200" y2="230" />
              <circle cx="200" cy="120" r="46" />
              <rect x="10" y="70" width="90" height="100" />
              <rect x="300" y="70" width="90" height="100" />
            </g>
            <path
              d="M120 60 C180 90 230 150 280 180"
              stroke="#e8630a"
              strokeWidth="4"
              strokeDasharray="10 9"
              fill="none"
            />
            <circle cx="120" cy="60" r="9" fill="#e8630a" />
            <circle cx="280" cy="180" r="9" fill="#ffffff" />
            <text
              x="132"
              y="52"
              fill="#ffffff"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
            >
              1
            </text>
            <text
              x="292"
              y="172"
              fill="#e8630a"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
            >
              2
            </text>
          </svg>

          <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
            <span>Court 1 · 8:00 PM</span>
            <span className="text-court">Open runs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
