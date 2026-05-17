export default function BackgroundPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full text-accent"
      style={{ opacity: 0.06 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="waves-fish-pattern"
          x="0"
          y="0"
          width="280"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          {/* Top wave */}
          <path
            d="M-20 48 Q40 28 100 48 T220 48 T340 48"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Fish 1 — right side, facing left */}
          <g transform="translate(210, 95)">
            <path
              d="M0 0 Q-9 -5 -18 0 Q-9 5 0 0"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M0 0 L9 -5 L9 5 Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              strokeLinejoin="round"
            />
            <circle cx="-13" cy="-0.6" r="0.7" fill="currentColor" />
          </g>

          {/* Bottom wave */}
          <path
            d="M-20 140 Q40 122 100 140 T220 140 T340 140"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Fish 2 — left side, facing right, slightly bigger */}
          <g transform="translate(55, 175) scale(1.25)">
            <path
              d="M0 0 Q9 -5 18 0 Q9 5 0 0"
              stroke="currentColor"
              strokeWidth="0.9"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M0 0 L-9 -5 L-9 5 Z"
              stroke="currentColor"
              strokeWidth="0.9"
              fill="none"
              strokeLinejoin="round"
            />
            <circle cx="13" cy="-0.6" r="0.7" fill="currentColor" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves-fish-pattern)" />
    </svg>
  );
}
