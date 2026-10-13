"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MoreVerticalCircle01Icon,
  Configuration01Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { AppIcon, AppSelect, AppButton, APP_CONTROL } from "./workspace-demo-ui"
import {
  DEMO_PROCESSES,
  formatBytes,
  type DemoConnection,
  type DemoProcess,
} from "./workspace-activity-data"
import { cn } from "@/lib/utils"

export function ProcessAppIcon({
  name,
  size = 32,
}: {
  name: string
  size?: number
}) {
  const process = DEMO_PROCESSES.find((item) => item.name === name)
  return process ? (
    <Image
      unoptimized
      src={process.icon}
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  ) : (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs">
      {name[0] ?? "?"}
    </span>
  )
}

export function WorkspaceProcess({
  connections,
  tick,
  onCloseConnections,
  onAddRule,
  guided = false,
}: {
  connections: DemoConnection[]
  tick: number
  onCloseConnections: (name: string) => void
  onAddRule: (process: DemoProcess) => void
  guided?: boolean
}) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("traffic")
  const [selected, setSelected] = useState<string | null>(
    guided ? "Safari" : null
  )
  const [menu, setMenu] = useState<string | null>(null)
  const active = (name: string) =>
    connections.filter(
      (item) => item.process === name && item.status === "active"
    ).length
  const closed = (process: DemoProcess) =>
    process.closed +
    connections.filter(
      (item) => item.process === process.name && item.status === "closed"
    ).length
  const speed = (process: DemoProcess, leg: "up" | "down") =>
    active(process.name)
      ? process[leg] * (1 + Math.sin(tick * 0.7 + process.total) * 0.06)
      : 0
  const processes = DEMO_PROCESSES.filter((item) =>
    `${item.name} ${item.path}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : sort === "speed"
        ? speed(b, "down") + speed(b, "up") - speed(a, "down") - speed(a, "up")
        : b.total - a.total
  )
  const detail = DEMO_PROCESSES.find((item) => item.name === selected)
  return (
    <div className="flex min-w-0 gap-4">
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative max-w-xs">
            <AppIcon
              icon={Search01Icon}
              className="pointer-events-none absolute top-2.5 left-2 size-4 text-muted-foreground"
            />
            <input
              aria-label="Search processes"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "h-9 w-full rounded-full bg-transparent pr-3 pl-8 text-sm",
                APP_CONTROL
              )}
            />
          </div>
          <AppSelect
            label="Sort processes"
            value={sort}
            onChange={setSort}
            className="w-45 shrink-0"
            options={[
              { value: "traffic", label: "Sort by Traffic" },
              { value: "speed", label: "Sort by Speed" },
              { value: "name", label: "Sort by Name" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          {processes.map((process) => (
            <div
              key={process.name}
              className={cn(
                "relative flex min-w-0 items-center gap-2 rounded-3xl border border-border/40 bg-card/70 transition-colors hover:bg-card",
                selected === process.name && "border-primary/30 bg-primary/10"
              )}
            >
              <button
                aria-label={`Inspect ${process.name}`}
                aria-pressed={selected === process.name}
                onClick={() => {
                  setSelected(process.name)
                  setMenu(null)
                }}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-3xl py-2 pr-1 pl-4 text-left",
                  APP_CONTROL
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <ProcessAppIcon name={process.name} />
                </div>
                <div className="min-w-0">
                  <span className="font-medium">{process.name}</span>
                  {!detail && process.subprocesses > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      · {process.subprocesses} sub-processes
                    </span>
                  )}
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="font-medium tabular-nums">
                    {formatBytes(speed(process, "up") + speed(process, "down"))}
                    /s
                  </span>
                  {!detail && (
                    <span className="text-xs text-muted-foreground">
                      · Total: {formatBytes(process.total)}
                    </span>
                  )}
                </div>
              </button>
              <div className="relative mr-3">
                <AppButton
                  icon={MoreVerticalCircle01Icon}
                  className="size-7 border-0 bg-transparent"
                  aria-label={`Actions for ${process.name}`}
                  aria-expanded={menu === process.name}
                  onClick={() =>
                    setMenu(menu === process.name ? null : process.name)
                  }
                />
                {menu === process.name && (
                  <div
                    role="menu"
                    aria-label={`${process.name} actions`}
                    className="absolute top-8 right-0 z-20 w-56 rounded-xl border border-border bg-popover p-1 shadow-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setMenu(null)
                    }}
                  >
                    <button
                      role="menuitem"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-accent",
                        APP_CONTROL
                      )}
                      onClick={() => {
                        setMenu(null)
                        onAddRule(process)
                      }}
                    >
                      <AppIcon icon={Configuration01Icon} className="size-4" />
                      Add Rule for {process.name}
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      role="menuitem"
                      disabled={!active(process.name)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-accent",
                        APP_CONTROL
                      )}
                      onClick={() => {
                        setMenu(null)
                        onCloseConnections(process.name)
                      }}
                    >
                      <AppIcon icon={Cancel01Icon} className="size-4" />
                      Kill Connection
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!processes.length && (
            <div className="rounded-3xl border border-dashed border-border/50 bg-card/20 py-12 text-center">
              <h3 className="font-medium">No matching processes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No applications match your current search query.
              </p>
            </div>
          )}
        </div>
      </div>
      {detail && (
        <aside
          aria-label={`${detail.name} details`}
          className="h-[596px] w-90 shrink-0 overflow-y-auto rounded-4xl border border-border/40 bg-card/70"
        >
          <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
            <ProcessAppIcon name={detail.name} />
            <h3 className="flex-1 font-medium">{detail.name}</h3>
            <AppButton
              icon={Cancel01Icon}
              aria-label="Close process details"
              className="size-7 border-0 bg-transparent"
              onClick={() => setSelected(null)}
            />
          </div>
          <div className="space-y-4 p-4 text-sm">
            {[
              {
                title: "Bandwidth",
                values: [
                  ["Download", `${formatBytes(speed(detail, "down"))}/s`],
                  ["Upload", `${formatBytes(speed(detail, "up"))}/s`],
                ],
              },
              {
                title: "Connections",
                values: [
                  ["Active", String(active(detail.name))],
                  ["Closed", String(closed(detail))],
                ],
              },
            ].map((group) => (
              <section key={group.title}>
                <h4 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                  {group.title}
                </h4>
                <div className="flex divide-x divide-border rounded-xl border border-border bg-muted">
                  {group.values.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex min-w-0 flex-1 justify-between gap-2 px-3 py-2"
                    >
                      <span className="shrink-0 text-muted-foreground">
                        {label}
                      </span>
                      <span className="truncate tabular-nums" title={value}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <section>
              <h4 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                Details
              </h4>
              <div className="divide-y divide-border rounded-xl border border-border bg-muted">
                <div className="space-y-1.5 px-4 py-2">
                  <p className="text-muted-foreground">Top Host</p>
                  <p className="truncate font-mono">
                    {connections.find((item) => item.process === detail.name)
                      ?.host ?? "—"}
                  </p>
                </div>
                <div className="space-y-1.5 px-4 py-2">
                  <p className="text-muted-foreground">Process Path</p>
                  <code className="text-xs break-all select-all">
                    {detail.path}
                  </code>
                </div>
              </div>
            </section>
            {detail.subprocesses > 0 && (
              <section>
                <h4 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                  Sub-Processes ({detail.subprocesses})
                </h4>
                <div className="divide-y divide-border rounded-xl border border-border bg-muted">
                  {Array.from({ length: detail.subprocesses }, (_, i) => (
                    <div key={i} className="space-y-1 px-4 py-2">
                      <p className="text-xs">
                        {detail.name} Helper {i + 1}
                      </p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {detail.path}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {i === 0 ? active(detail.name) : 0} active · {8 + i * 4}{" "}
                        closed
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section>
              <h4 className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                Traffic
              </h4>
              <div className="divide-y divide-border rounded-xl border border-border bg-muted">
                {[
                  ["Today", formatBytes(detail.total * 0.12)],
                  ["Since Launch", formatBytes(detail.total)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-4 py-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span>↓ {value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      )}
    </div>
  )
}
