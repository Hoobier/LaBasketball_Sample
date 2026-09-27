import Link from "next/link";
import { Trophy } from "lucide-react";

const columns = [
  {
    heading: "Play",
    links: [
      { label: "Book a Court", href: "/available-slot" },
      { label: "Schedules", href: "/schedules" },
      { label: "Venues", href: "/venue" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { label: "All Gear", href: "/products" },
      { label: "Orders", href: "/orders" },
      { label: "Cart", href: "/products" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Join", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-court">
                <Trophy className="h-5 w-5 text-black" />
              </span>
              <span className="font-display text-lg uppercase tracking-wide">
                L.A Basketball
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Los Angeles&apos; home for hoops — courts, games and gear under
              one roof.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-court"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} L.A Basketball. All rights reserved.</p>
          <p className="uppercase tracking-widest">Made for the game · L.A</p>
        </div>
      </div>
    </footer>
  );
}
