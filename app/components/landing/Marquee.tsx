const items = [
  "Book Courts",
  "Weekly Runs",
  "Gear Drops",
  "Elite Venues",
  "Tournaments",
  "Hoops Culture",
];

function MarqueeContent() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-10 whitespace-nowrap font-display text-lg uppercase tracking-wider sm:text-xl"
        >
          {item}
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
            <circle cx="10" cy="10" r="9" fill="currentColor" />
            <g stroke="#e8630a" strokeWidth="1.4" fill="none">
              <line x1="10" y1="1" x2="10" y2="19" />
              <line x1="1" y1="10" x2="19" y2="10" />
            </g>
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-black/10 bg-court py-3.5 text-black">
      <div className="flex w-max animate-marquee">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
}
