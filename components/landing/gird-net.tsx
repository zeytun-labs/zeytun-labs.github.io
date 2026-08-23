"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function GridNet({ className }: { className?: string }) {
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
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
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
          d="M 0 28.58 L 81.3 28.58 L 81.3 85.71 L 244 85.71 L 244 28.58 L 366 28.58"
          fill="none"
          stroke="var(--sidebar-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="0.15 1"
          className="animate-[dash_4s_linear_infinite]"
          filter="url(#glow)"
        />
      </svg>
    </div>
  )
}
