// Circuit-board fig for RouteCard: central chip with Zeytun mark,
// orthogonal traces + cyan/amber light pulses (reuses `dash` keyframes).
const MARK_D =
  "M0 21.4821C10.2275 21.4821 18.5187 29.7726 18.5189 40C8.29146 40 0.000269965 31.7095 0 21.4821ZM40 21.4821C39.9997 31.7093 31.7093 39.9998 21.4821 40C21.4823 29.7727 29.7727 21.4823 40 21.4821ZM18.5189 0C18.5189 10.2276 10.2276 18.5189 0 18.5189C0 8.2913 8.2913 0 18.5189 0ZM21.4821 0C31.7095 0.000236235 40 8.29144 40 18.5189C29.7726 18.5187 21.4821 10.2275 21.4821 0Z"

function Trace({ d }: { d: string }) {
  return (
    <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
  )
}

export function RouteChip() {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 366 200"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="rc-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Chip */}
      <rect x="134" y="68" width="98" height="64" rx="12" fill="#161616" stroke="rgba(255,255,255,0.1)" />



      {/* Static traces — all anchored at chip edge (x=134 left / x=232 right), exiting frame */}
      <Trace d="M 132 86 H 96 V 50 H -20" />
      <Trace d="M 132 100 H -20" />
      <Trace d="M 132 114 H 96 V 150 H -20" />
      <Trace d="M 234 86 H 270 V 44 H 386" />
      <Trace d="M 234 100 H 386 V 99.99" />
      <Trace d="M 234 114 H 300 V 170 H 386" />

      {/* Zeytun mark centered in chip */}
      <g transform="translate(163 80)">
        <path d={MARK_D} fill="#6D6D6D" opacity="0.9" />
      </g>

      {/* Pulses — left (cyan), travel from frame edge INTO the chip pin */}
      <path
        d="M 40 50 H 96 V 86 H 132"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-dash"
      />
      <path
        d="M -20 100 H 132 V 99.99"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-[dash_2.5s_linear_infinite_0.8s]"
      />
      <path
        d="M -20 150 H 96 V 114 H 132"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-[dash_3.5s_linear_infinite_1.6s]"
      />
      {/* Pulses — right (amber) */}
      <path
        d="M 234 86 H 270 V 44 H 386"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-[dash_3s_linear_infinite_0.4s]"
      />
      <path
        d="M 234 100 H 386 V 99.99"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-[dash_2.8s_linear_infinite_1.2s]"
      />
      <path
        d="M 234 114 H 300 V 170 H 386"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="0.15 1"
        strokeDashoffset="0.15"
        className="animate-[dash_3.2s_linear_infinite_2s]"
      />


            {/* Pins — traces start under these */}
      {[86, 100, 114].map((y) => (
        <rect key={`l${y}`} x="126" y={y - 1.5} width="12" height="3" rx="1.5" fill="#6D6D6D" />
      ))}
      {[86, 100, 114].map((y) => (
        <rect key={`r${y}`} x="228" y={y - 1.5} width="12" height="3" rx="1.5" fill="#6D6D6D" />
      ))}
    </svg>
  )
}
