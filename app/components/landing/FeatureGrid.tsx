import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface FeatureCard {
  title: string;
  eyebrow: string;
  href: string;
  background: string;
  titleColor: string;
  art: "court" | "schedule" | "gear" | "playbook";
}

const features: FeatureCard[] = [
  {
    title: "Book a Court",
    eyebrow: "Play today",
    href: "/available-slot",
    background: "bg-gradient-to-br from-court via-[#c14f00] to-[#5a2200]",
    titleColor: "text-black",
    art: "court",
  },
  {
    title: "Game Schedules",
    eyebrow: "Never miss a run",
    href: "/schedules",
    background: "bg-gradient-to-br from-[#1c1c1c] via-[#101010] to-black",
    titleColor: "text-white",
    art: "schedule",
  },
  {
    title: "The Gear",
    eyebrow: "Fresh drops",
    href: "/products",
    background: "bg-gradient-to-br from-[#f5f5f5] via-[#e6e6e6] to-[#cfcfcf]",
    titleColor: "text-black",
    art: "gear",
  },
  {
    title: "Our Venues",
    eyebrow: "Courts across L.A.",
    href: "/venue",
    background: "bg-gradient-to-br from-[#12211a] via-[#0d1712] to-black",
    titleColor: "text-white",
    art: "playbook",
  },
];

function CardArt({ art }: { art: FeatureCard["art"] }) {
  if (art === "court") {
    return (
      <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
        <g stroke="#141414" strokeWidth="3" fill="none" opacity="0.75">
          <rect x="10" y="10" width="280" height="200" />
          <line x1="150" y1="10" x2="150" y2="210" />
          <circle cx="150" cy="110" r="42" />
          <rect x="10" y="60" width="70" height="100" />
          <rect x="220" y="60" width="70" height="100" />
          <path d="M80 40 A85 85 0 0 1 80 180" />
          <path d="M220 40 A85 85 0 0 0 220 180" />
        </g>
      </svg>
    );
  }
  if (art === "schedule") {
    return (
      <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
        <g stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7">
          <rect x="40" y="30" width="220" height="170" rx="12" />
          <line x1="40" y1="75" x2="260" y2="75" />
          <line x1="95" y1="15" x2="95" y2="45" />
          <line x1="205" y1="15" x2="205" y2="45" />
          <line x1="113" y1="110" x2="187" y2="110" />
          <line x1="113" y1="145" x2="187" y2="145" />
          <line x1="150" y1="95" x2="150" y2="160" />
        </g>
        <circle cx="215" cy="165" r="22" fill="#e8630a" />
        <path
          d="M207 165 l6 6 11 -13"
          stroke="#141414"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (art === "gear") {
    return (
      <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="gear-ball" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ff9d4d" />
            <stop offset="100%" stopColor="#c14f00" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="110" r="82" fill="url(#gear-ball)" />
        <g stroke="#141414" strokeWidth="4" fill="none">
          <line x1="150" y1="28" x2="150" y2="192" />
          <line x1="68" y1="110" x2="232" y2="110" />
          <path d="M110 36 C74 70 74 150 110 184" />
          <path d="M190 36 C226 70 226 150 190 184" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
      <g stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7">
        <rect x="15" y="15" width="270" height="190" rx="8" />
        <circle cx="80" cy="70" r="14" />
        <circle cx="220" cy="70" r="14" />
        <circle cx="150" cy="155" r="14" />
        <path d="M94 70 H190" strokeDasharray="8 8" />
        <path d="M220 84 C220 130 180 145 164 148" strokeDasharray="8 8" />
        <path d="M80 84 C80 130 120 145 136 148" />
      </g>
      <text
        x="150"
        y="205"
        textAnchor="middle"
        fill="#e8630a"
        fontSize="16"
        fontWeight="bold"
        fontFamily="monospace"
      >
        PLAY
      </text>
    </svg>
  );
}

export default function FeatureGrid() {
  return (
    <section id="courts" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-court">
              The Lineup
            </p>
            <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] uppercase">
              Built for
              <br />
              ballers
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Everything you need to play — from the first booking to the final
            buzzer. Pick your lane and get on the court.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl p-6 sm:p-8 ${feature.background} ${feature.titleColor} transition-transform duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-3xl uppercase sm:text-4xl">
                    {feature.title}
                  </h3>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-60 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>

              <div className="pointer-events-none absolute -right-6 -bottom-8 h-48 w-64 opacity-90 transition-transform duration-500 group-hover:scale-110 sm:h-56 sm:w-72">
                <CardArt art={feature.art} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
