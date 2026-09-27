export default function Basketball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <clipPath id="ball-clip">
          <circle cx="100" cy="100" r="96" />
        </clipPath>
        <radialGradient id="ball-shade" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ff9d4d" />
          <stop offset="55%" stopColor="#e8630a" />
          <stop offset="100%" stopColor="#a33f00" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#ball-shade)" />
      <g
        clipPath="url(#ball-clip)"
        stroke="#141414"
        strokeWidth="5"
        fill="none"
      >
        <line x1="100" y1="0" x2="100" y2="200" />
        <line x1="0" y1="100" x2="200" y2="100" />
        <path d="M55 6 C18 55 18 145 55 194" />
        <path d="M145 6 C182 55 182 145 145 194" />
      </g>
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="#141414"
        strokeWidth="5"
      />
    </svg>
  );
}
