"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Section } from "../common/section"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"
import { Option, Rise, SectionHead } from "./chrome"
import { churnRows, initialRows, jitterRows, type Row } from "./ledger"
import { useDemoActivity } from "@/hooks/use-demo-activity"

export function TrafficMonitor() {
  return (
    <Section id="traffic">
      <SectionHead
        eyebrow="Traffic Monitor"
        title="A live ledger, not a speed graph."
        lede="Inspect active and recent connections handled by Zeytun: available app details, the selected policy, and the destination reached."
      />
      <TMBody />
    </Section>
  )
}

function TMBody() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
      <div className="space-y-8">
        <Rise>
          <Option
            title="By client or by host"
            description="Group the same ledger by the app that opened each connection or by the host it reached, each with a live count."
          />
        </Rise>
        <Separator />
        <Rise delay={0.1}>
          <Option
            title="Recent or active"
            description="Look back over everything that has opened recently, or narrow to the connections still alive right now."
          />
        </Rise>
        <Separator />
        <Rise delay={0.2}>
          <Option
            title="Narrow it down"
            description={
              <>
                Filter by host, process or port. Keep only the columns you care
                about — status, network, start time, client, policy, up, down,
                duration, method, URL.
              </>
            }
          />
        </Rise>
      </div>
      <Rise delay={0.15}>
        <LedgerFig />
      </Rise>
    </div>
  )
}

/**
 * Rows churn and jitter on intervals so the mock reads as a live ledger rather
 * than a shuffle. The data and the churn rule live in `ledger.ts` so they can
 * be checked without a browser.
 */
function LedgerFig() {
  const { ref, canAnimate } = useDemoActivity()
  const [tab, setTab] = useState<"recent" | "active">("recent")
  const [group, setGroup] = useState<"client" | "host">("client")
  const [rows, setRows] = useState<Row[]>(initialRows)
  const churnCount = useRef(0)

  useEffect(() => {
    if (!canAnimate) return

    const jitter = setInterval(() => setRows(jitterRows), 900)

    const churn = setInterval(() => {
      churnCount.current += 1
      setRows((rs) => churnRows(rs, churnCount.current))
    }, 2600)

    const cycle = setInterval(() => {
      setTab((t) => (t === "recent" ? "active" : "recent"))
      setGroup((g) => (g === "client" ? "host" : "client"))
    }, 5200)

    return () => {
      clearInterval(jitter)
      clearInterval(churn)
      clearInterval(cycle)
    }
  }, [canAnimate])

  const shown = tab === "active" ? rows.filter((r) => r.active) : rows

  // No window chrome: the ledger sits on the page the way the Process figure
  // does. The rows carry the borders, so a frame around them just doubles up.
  return (
    <div ref={ref} className="mt-2 w-full max-w-115">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
          Live Ledger
        </span>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
          Illustrative preview
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <Segmented
          value={tab}
          options={[
            { value: "recent", label: "Recent" },
            { value: "active", label: "Active" },
          ]}
        />
        <span className="ms-auto font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Group
        </span>
        <Segmented
          value={group}
          options={[
            { value: "client", label: "Client" },
            { value: "host", label: "Host" },
          ]}
        />
      </div>

      <div className="h-90">
        <AnimatePresence initial={false}>
          {shown.map((r) => (
            <motion.div
              key={r.id}
              layout
              className="mb-2 overflow-hidden"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <LedgerRow row={r} group={group} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Segmented<T extends string>({
  value,
  options,
}: {
  value: T
  options: readonly { value: T; label: string }[]
}) {
  return (
    <div className="flex rounded-full border border-border/40 bg-card/70 p-0.5">
      {options.map((o) => (
        <span
          key={o.value}
          className={cn(
            "rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-colors",
            o.value === value
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground"
          )}
        >
          {o.label}
        </span>
      ))}
    </div>
  )
}

function LedgerRow({ row, group }: { row: Row; group: "client" | "host" }) {
  return (
    <div
      className={cn(
        "flex h-13 items-center gap-3 rounded-2xl border bg-card/70 px-4 font-mono text-xs",
        row.active ? "border-border" : "border-border/40"
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          row.active ? "bg-primary" : "bg-muted-foreground/40"
        )}
      />
      <span
        className={cn(
          "shrink-0 rounded-full px-1.5 text-[10px]",
          row.tcp
            ? "bg-cyan-500/10 text-cyan-400"
            : "bg-pink-500/10 text-pink-400"
        )}
      >
        {row.tcp ? "TCP" : "UDP"}
      </span>

      {group === "client" ? (
        <span className="flex min-w-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.icon}
            alt=""
            className="size-5 shrink-0 rounded object-contain"
          />
          <span className="truncate">{row.app}</span>
        </span>
      ) : (
        <span className="min-w-0 truncate">{row.host}</span>
      )}

      <span className="ms-auto hidden shrink-0 rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground lg:block">
        {row.policy}
      </span>
      {/* Fixed columns for the digits: the numbers jitter between 1 and 3
          digits, and letting the span size to its content made the policy badge
          jump left every tick. The arrows stay outside the fixed boxes so glyph
          metrics don't matter. */}
      <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground tabular-nums">
        <span className="text-foreground">↓</span>
        <span className="w-[3ch] text-end text-foreground">{row.down}</span>
        <span className="ms-1">↑</span>
        <span className="w-[2ch] text-end">{row.up}</span>
      </span>
    </div>
  )
}
