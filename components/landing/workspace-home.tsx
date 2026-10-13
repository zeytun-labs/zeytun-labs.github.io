"use client"

import { useId, useMemo, useRef, useState } from "react"
import { motion, useAnimationFrame, useMotionValue } from "motion/react"
import {
  Wifi02Icon,
  EthernetPortIcon,
  DoorOpenIcon,
  ReloadIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { AppIcon, AppButton, AppTabs } from "./workspace-demo-ui"
import { ProcessAppIcon } from "./workspace-process"
import {
  DEMO_PROCESSES,
  formatBytes,
  outboundLabel,
  type DemoConnection,
} from "./workspace-activity-data"
import type { DemoProfile } from "./workspace-demo-data"
import { cn } from "@/lib/utils"
import {
  speedHistoryPaths,
  SPEED_SAMPLE_MS,
  SPEED_SAMPLE_STEP,
} from "./workspace-speed-history"

const CARD =
  "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-4xl border border-border/40 bg-card/70 shadow-sm"
const LABEL =
  "text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
const ORANGE = "oklch(0.77 0.16 70)"
const GREEN = "oklch(0.77 0.2 131)"
const trafficStripe = (color: string) =>
  `repeating-linear-gradient(-45deg, ${color} 0 6px, color-mix(in oklab, ${color} 65%, transparent) 6px 12px)`

function SpeedChart({
  title,
  value,
  color,
  running,
}: {
  title: string
  value: number
  color: string
  running: boolean
}) {
  const id = useId().replaceAll(":", "")
  const offset = useMotionValue(0)
  const elapsed = useRef(0)
  const lastStep = useRef(0)
  const line = useRef<SVGPathElement>(null)
  const fill = useRef<SVGPathElement>(null)
  const seed = title === "Upload" ? 17 : 83
  const initialPath = useMemo(() => speedHistoryPaths(0, seed), [seed])
  useAnimationFrame((_, delta) => {
    if (!running) return
    elapsed.current += Math.min(delta, 64)
    const step = Math.floor(elapsed.current / SPEED_SAMPLE_MS)
    if (step !== lastStep.current) {
      // Swap the retained window and its translation in the same animation
      // frame, so existing samples keep their positions without a reset flash.
      const paths = speedHistoryPaths(step, seed)
      line.current?.setAttribute("d", paths.line)
      fill.current?.setAttribute("d", paths.fill)
      lastStep.current = step
    }
    offset.set(
      (-(elapsed.current % SPEED_SAMPLE_MS) / SPEED_SAMPLE_MS) *
        SPEED_SAMPLE_STEP
    )
  })
  return (
    <div className={cn(CARD, "pt-4")}>
      <div className="px-5">
        <p className={LABEL}>{title}</p>
        <p className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight">
            {formatBytes(value).split(" ")[0]}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatBytes(value).split(" ")[1]}/s
          </span>
        </p>
      </div>
      <svg
        role="img"
        aria-label={`${title.toLowerCase()} speed: ${formatBytes(value)} per second, sample history`}
        viewBox="0 0 310 100"
        preserveAspectRatio="none"
        className="mt-auto h-18 w-full overflow-hidden"
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.g data-speed-history style={{ x: offset }}>
          <path ref={fill} d={initialPath.fill} fill={`url(#${id})`} />
          <path
            ref={line}
            data-speed-line
            d={initialPath.line}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>
      </svg>
    </div>
  )
}

export function WorkspaceHome({
  profile,
  connections,
  tick,
  diagnosing,
  running,
  onDiagnostics,
  onReport,
}: {
  profile: DemoProfile
  connections: DemoConnection[]
  tick: number
  diagnosing: boolean
  running: boolean
  onDiagnostics: () => void
  onReport: () => void
}) {
  const [period, setPeriod] = useState("today")
  const [range, setRange] = useState("24H")
  const [filter, setFilter] = useState("all")
  const [category, setCategory] = useState("host")
  const [inspected, setInspected] = useState<number | null>(null)
  const active = connections.filter((item) => item.status === "active")
  const liveProcesses = DEMO_PROCESSES.filter((p) =>
    active.some((c) => c.process === p.name)
  )
  const down =
    liveProcesses.reduce((sum, p) => sum + p.down, 0) *
    (1 + Math.sin(tick * 0.7) * 0.06)
  const up =
    liveProcesses.reduce((sum, p) => sum + p.up, 0) *
    (1 + Math.sin(tick * 0.7) * 0.06)
  const total =
    connections.reduce((sum, c) => sum + c.down + c.up, 0) *
    (period === "month" ? 18 : 1)
  const proxy =
    connections
      .filter((c) => c.policy !== "direct")
      .reduce((sum, c) => sum + c.down + c.up, 0) *
    (period === "month" ? 18 : 1)
  const proxyPct = total ? Math.round((proxy / total) * 100) : 50
  const multiplier = ["1H", "6H", "24H", "7D", "30D"].indexOf(range) + 1
  const buckets = Array.from({ length: 36 }, (_, i) =>
    Math.round(
      (14 + Math.sin(i * 0.65 + multiplier) * 9 + ((i * 17) % 11)) *
        (filter === "proxy" ? 0.72 : 1)
    )
  )
  const traffic = connections.filter(
    (c) => filter === "all" || c.policy !== "direct"
  )
  const names = [
    ...new Set(
      traffic.map((c) =>
        category === "host"
          ? c.host
          : category === "process"
            ? c.process
            : outboundLabel(profile, c.policy)
      )
    ),
  ]
  const entries = names
    .map((name) => ({
      name,
      down:
        traffic
          .filter(
            (c) =>
              (category === "host"
                ? c.host
                : category === "process"
                  ? c.process
                  : outboundLabel(profile, c.policy)) === name
          )
          .reduce((sum, c) => sum + c.down, 0) * multiplier,
      up:
        traffic
          .filter(
            (c) =>
              (category === "host"
                ? c.host
                : category === "process"
                  ? c.process
                  : outboundLabel(profile, c.policy)) === name
          )
          .reduce((sum, c) => sum + c.up, 0) * multiplier,
    }))
    .sort((a, b) => b.down - a.down)
  return (
    <div className="grid grid-cols-4 grid-rows-[40px_156px_172px_172px] gap-3 *:min-h-0 *:min-w-0">
      <div className="col-span-4 grid grid-cols-4 gap-3">
        {[
          { label: "Network", value: "Studio Wi-Fi", icon: Wifi02Icon },
          { label: "Local IP", value: "192.0.2.42", icon: EthernetPortIcon },
          {
            label: "Outbound Mode",
            value:
              profile.mode === "global"
                ? "Global Proxy"
                : profile.mode === "rule"
                  ? "Rule-Based Proxy"
                  : "Direct Connection",
            icon: DoorOpenIcon,
          },
          {
            label: "External IP",
            value: "203.0.113.10",
            flag: "🇳🇱",
            icon: Wifi02Icon,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 items-center gap-4 px-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card">
              {"flag" in item ? (
                <span className="text-xl">{item.flag}</span>
              ) : (
                <AppIcon icon={item.icon} />
              )}
            </span>
            <div className="min-w-0">
              <p className="mb-1 text-[11px] leading-none tracking-wider text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="truncate text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={cn(CARD, "col-span-2 gap-3 p-4")}>
        <div className="flex items-center">
          <p className={LABEL}>Active Connection</p>
          <span
            className={cn(
              "ml-auto size-2.5 rounded-full",
              active.length ? "bg-primary" : "bg-red-400"
            )}
          />
        </div>
        <p className="text-4xl leading-none font-semibold tracking-tight">
          {active.length}
        </p>
        <div className="mt-auto flex justify-between rounded-xl border border-border/30 bg-foreground/5 px-3 py-2">
          <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
            Process
          </span>
          <span className="text-sm font-medium">{liveProcesses.length}</span>
        </div>
      </div>
      <SpeedChart title="Upload" value={up} color={ORANGE} running={running} />
      <SpeedChart
        title="Download"
        value={down}
        color={GREEN}
        running={running}
      />
      <div className={cn(CARD, "col-span-2 gap-2 p-4")}>
        <div className="flex items-start">
          <p className={LABEL}>Network Latency</p>
          <div className="ml-auto flex gap-1.5">
            <AppButton
              icon={ReloadIcon}
              aria-label="Run diagnostics"
              disabled={diagnosing}
              onClick={onDiagnostics}
            />
            <AppButton
              icon={Menu01Icon}
              aria-label="Open diagnostics report"
              onClick={onReport}
            />
          </div>
        </div>
        <p className="flex items-baseline gap-1.5">
          <span className="text-4xl font-semibold tracking-tight">
            {diagnosing ? "—" : "24"}
          </span>
          <span className="text-sm text-muted-foreground">ms</span>
        </p>
        <div className="mt-auto grid grid-cols-3 gap-2">
          {[
            ["Router", "2 ms"],
            ["DNS", "12 ms"],
            ["Proxy", profile.mode === "global" ? "42 ms" : "N/A"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-1 rounded-xl border border-border/30 bg-foreground/5 px-3 py-2"
            >
              <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                {label}
              </span>
              <span className="text-sm">{diagnosing ? "—" : value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={cn(CARD, "col-span-2 row-span-2 gap-2 p-4")}>
        <div className="flex h-7 shrink-0 items-center gap-2">
          <p className={LABEL}>Traffic</p>
          <div className="ml-auto flex gap-1.5">
            <AppTabs
              compact
              label="Traffic route filter"
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "All" },
                { value: "proxy", label: "Proxy" },
              ]}
            />
            <AppTabs
              compact
              label="Traffic history range"
              value={range}
              onChange={(value) => {
                setRange(value)
                setInspected(null)
              }}
              items={["1H", "6H", "24H", "7D", "30D"].map((value) => ({
                value,
                label: value,
              }))}
            />
          </div>
        </div>
        <div className="relative h-28 shrink-0 px-1 pt-4 pb-4">
          <div className="absolute top-0 right-0 text-[10px] text-muted-foreground">
            {inspected === null
              ? "↑ Upload  /  ↓ Download"
              : `Sample ${inspected + 1} · ↓ ${buckets[inspected] * multiplier} MB`}
          </div>
          <div
            className="flex h-full items-end gap-1"
            role="group"
            aria-label="Sample traffic history"
          >
            {buckets.map((value, index) => (
              <button
                key={index}
                aria-label={`Traffic sample ${index + 1}: download ${value * multiplier} megabytes`}
                onPointerEnter={() => setInspected(index)}
                onPointerLeave={() => setInspected(null)}
                onFocus={() => setInspected(index)}
                onBlur={() => setInspected(null)}
                onClick={() => setInspected(index)}
                className="flex min-w-0 flex-1 flex-col justify-end outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ height: `${value * 2}%` }}
              >
                <span
                  className="w-full rounded-t-xs"
                  style={{ background: trafficStripe(ORANGE), height: "24%" }}
                />
                <span
                  className="w-full"
                  style={{
                    background: trafficStripe(GREEN),
                    height: "76%",
                    opacity:
                      inspected === null || inspected === index ? 1 : 0.4,
                  }}
                />
              </button>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>{range} AGO</span>
            <span>NOW</span>
          </div>
        </div>
        <div className="flex h-7 shrink-0 items-center justify-between">
          <AppTabs
            compact
            label="Traffic breakdown"
            value={category}
            onChange={setCategory}
            items={[
              { value: "host", label: "Host" },
              { value: "policy", label: "Policy" },
              { value: "process", label: "Process" },
            ]}
          />
          <p className="text-[10px] text-muted-foreground">
            <span className="mr-2 text-muted-foreground/60">
              Top {Math.min(entries.length, 4)}
            </span>
            <span style={{ color: ORANGE }}>↑ UP</span> /{" "}
            <span style={{ color: GREEN }}>↓ DOWN</span>
          </p>
        </div>
        <div className="min-h-0 flex-1" aria-label={`Top ${category} traffic`}>
          {entries.slice(0, 4).map((entry) => (
            <div
              key={entry.name}
              className="flex h-7 items-center justify-between gap-2 rounded-xl px-2.5 hover:bg-foreground/5"
            >
              <span className="flex min-w-0 items-center gap-2">
                {category === "process" && (
                  <ProcessAppIcon name={entry.name} size={16} />
                )}
                <span
                  className={cn(
                    "truncate text-sm",
                    category === "host" && "font-mono text-xs"
                  )}
                >
                  {entry.name}
                </span>
              </span>
              <span className="shrink-0 text-xs">
                <span style={{ color: ORANGE }}>{formatBytes(entry.up)}</span>
                <span className="mx-1 text-muted-foreground/40">/</span>
                <span style={{ color: GREEN }}>{formatBytes(entry.down)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={cn(CARD, "col-span-2 gap-2 p-4")}>
        <div className="flex justify-between">
          <p className={LABEL}>Total Traffic</p>
          <AppTabs
            compact
            label="Total traffic period"
            value={period}
            onChange={setPeriod}
            items={[
              { value: "today", label: "Today" },
              { value: "month", label: "Month" },
            ]}
          />
        </div>
        <p className="text-3xl leading-none font-semibold tracking-tight">
          {formatBytes(total)}
        </p>
        <div className="mt-auto space-y-2">
          <div className="flex h-4 gap-1 overflow-hidden">
            <div
              className="min-w-1 rounded-lg"
              style={{
                width: `${proxyPct}%`,
                background: trafficStripe(GREEN),
              }}
            />
            <div
              className="min-w-1 rounded-lg"
              style={{
                width: `${100 - proxyPct}%`,
                background: trafficStripe(ORANGE),
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Proxy</p>
              <p>
                {formatBytes(proxy)}{" "}
                <span className="text-muted-foreground">· {proxyPct}%</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Direct</p>
              <p>
                {formatBytes(total - proxy)}{" "}
                <span className="text-muted-foreground">
                  · {100 - proxyPct}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
