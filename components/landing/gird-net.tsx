export function GridNet() {
  return (
    <div className="relative h-full flex-1 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 366 200"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g stroke="var(--border)" strokeWidth="1">
          {/* عمودی */}
          <line x1="11.11%" y1="0%" x2="11.11%" y2="100%" />
          <line x1="22.22%" y1="0%" x2="22.22%" y2="100%" />
          <line x1="33.33%" y1="0%" x2="33.33%" y2="100%" />
          <line x1="44.44%" y1="0%" x2="44.44%" y2="100%" />
          <line x1="55.56%" y1="0%" x2="55.56%" y2="100%" />
          <line x1="66.67%" y1="0%" x2="66.67%" y2="100%" />
          <line x1="77.78%" y1="0%" x2="77.78%" y2="100%" />
          <line x1="88.89%" y1="0%" x2="88.89%" y2="100%" />
          {/* افقی */}
          <line x1="0%" y1="14.29%" x2="100%" y2="14.29%" />
          <line x1="0%" y1="28.57%" x2="100%" y2="28.57%" />
          <line x1="0%" y1="42.86%" x2="100%" y2="42.86%" />
          <line x1="0%" y1="57.14%" x2="100%" y2="57.14%" />
          <line x1="0%" y1="71.43%" x2="100%" y2="71.43%" />
          <line x1="0%" y1="85.71%" x2="100%" y2="85.71%" />
        </g>

        <path
          d="M -20 28.58 L 81.33 28.58 L 81.33 85.71 L 244 85.71 L 244 28.58 L 386 28.58"
          fill="none"
          stroke="var(--sidebar-primary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="0.15 1"
          strokeDashoffset="0.15"
          className="animate-dash"
        />
        <path
          d="M 386 57.14 L 284.67 57.14 L 284.67 28.57 L 122 28.57 L 122 142.86 L -20 142.86"
          fill="none"
          stroke="var(--sidebar-primary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="0.15 1"
          strokeDashoffset="0.15"
          className="animate-[dash_4s_linear_infinite_1s]"
        />

        <path
          d="M 325.33 -20 L 325.33 85.71 L 203.33 85.71 L 203.33 142.86 L 386 142.86"
          fill="none"
          stroke="var(--sidebar-primary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="0.15 1"
          strokeDashoffset="0.15"
          className="animate-[dash_3.5s_linear_infinite_0.5s]"
        />
        <path
          d="M -20 171.43 L 244 171.43 L 244 114.29 L 386 114.29"
          fill="none"
          stroke="var(--sidebar-primary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="0.15 1"
          strokeDashoffset="0.15"
          className="animate-[dash_4.5s_linear_infinite_1.5s]"
        />
      </svg>
    </div>
  )
}
