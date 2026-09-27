export default function CourtBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-20"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 700"
      >
        <g stroke="#ffffff" strokeWidth="2" fill="none">
          <rect x="40" y="40" width="1120" height="620" />
          <line x1="600" y1="40" x2="600" y2="660" />
          <circle cx="600" cy="350" r="110" />
          <rect x="40" y="220" width="240" height="260" />
          <rect x="920" y="220" width="240" height="260" />
          <path d="M280 150 A220 220 0 0 1 280 550" />
          <path d="M920 150 A220 220 0 0 0 920 550" />
        </g>
      </svg>
    </div>
  );
}
