"use client"

import { useId, useRef, useState } from "react"
import { ArrowUpRight, Star } from "lucide-react"
import type { GithubStats } from "@/lib/github-stats"
import { STAR_URL } from "@/lib/site"

type StarHistoryChartProps = {
  history: GithubStats["history"]
  starsCount?: number | null
}

function formatWeek(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function StarHistoryChart({
  history,
  starsCount = null,
}: StarHistoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const pointRefs = useRef<(SVGGElement | null)[]>([])
  const gradientId = useId()
  const points = history.points || []
  const width = 420
  const height = 240
  const padding = 14
  const plotHeight = height - padding * 2
  const maxValue = Math.max(1, ...points.map((point) => point.stars))
  const countLabel =
    starsCount !== null && Number.isFinite(starsCount)
      ? starsCount.toLocaleString("en-US")
      : "—"
  const coords = points.map((point, i) => ({
    ...point,
    x:
      points.length === 1
        ? width / 2
        : padding + (i / (points.length - 1)) * (width - padding * 2),
    y: height - padding - (point.stars / maxValue) * plotHeight,
  }))
  const line = coords
    .map((point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`
      const previous = coords[i - 1]
      const midpoint = (previous.x + point.x) / 2
      return `C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`
    })
    .join(" ")
  const area =
    coords.length > 1
      ? `${line} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`
      : ""
  const activePoint = activeIndex !== null ? coords[activeIndex] : undefined

  return (
    <div className="relative flex h-full min-h-100 flex-col overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-card/50 to-card/10 p-6 sm:p-8 lg:min-h-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4" aria-hidden="true" />
          GitHub stars
        </h3>
        <a
          href={STAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Zeytun on GitHub"
          className="rounded-full p-2 text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-4 flex min-h-5 items-center font-mono text-[10px] text-muted-foreground/70">
        {activePoint
          ? `Week of ${formatWeek(activePoint.week)} · ${activePoint.stars} new stars`
          : "New stars per week"}
      </div>
      <div className="relative my-6 min-h-48 flex-1">
        {coords.length > 0 ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            role="group"
            aria-label="New GitHub stars per week"
          >
            <title>Weekly GitHub star activity</title>
            <desc>
              Each point shows stars received during that week. The current
              total is displayed below.
            </desc>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                x2={width - padding}
                y1={padding + ratio * plotHeight}
                y2={padding + ratio * plotHeight}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="2 6"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {area && <path d={area} fill={`url(#${gradientId})`} />}
            {coords.length > 1 && (
              <path
                d={line}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {coords.map((point, i) => (
              <g
                key={point.week}
                ref={(element) => {
                  pointRefs.current[i] = element
                }}
                tabIndex={i === (activeIndex ?? coords.length - 1) ? 0 : -1}
                role="button"
                aria-label={`Week of ${formatWeek(point.week)}: ${point.stars} new stars`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={(event) => {
                  if (document.activeElement !== event.currentTarget)
                    setActiveIndex(null)
                }}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(event) => {
                  let next = i
                  if (event.key === "ArrowLeft") next = Math.max(0, i - 1)
                  else if (event.key === "ArrowRight")
                    next = Math.min(coords.length - 1, i + 1)
                  else if (event.key === "Home") next = 0
                  else if (event.key === "End") next = coords.length - 1
                  else if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setActiveIndex(i)
                    return
                  } else return
                  event.preventDefault()
                  pointRefs.current[next]?.focus()
                }}
                className="cursor-pointer outline-none"
              >
                <circle cx={point.x} cy={point.y} r="13" fill="transparent" />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={activeIndex === i ? 5 : i === coords.length - 1 ? 4 : 2}
                  fill={
                    activeIndex === i || i === coords.length - 1
                      ? "var(--primary)"
                      : "var(--background)"
                  }
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-dashed border-border/40 p-4 text-center text-sm text-muted-foreground">
            Star history is not available yet.
          </div>
        )}
      </div>
      <div className="mb-4 flex justify-between font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
        <span>
          {coords.length > 0 ? formatWeek(coords[0].week) : "History"}
        </span>
        <span>
          {coords.length > 0 ? formatWeek(coords[coords.length - 1].week) : "—"}
        </span>
      </div>
      <p className="font-heading text-6xl leading-none tracking-[-0.04em] tabular-nums sm:text-7xl">
        {countLabel}
      </p>
      <a
        href={STAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        Star on GitHub
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  )
}
