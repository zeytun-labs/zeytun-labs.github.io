"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { Section } from "../common/section"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"
import {
  Chip,
  ChipRow,
  Code,
  Option,
  Rise,
  SectionHead,
  WindowMock,
} from "./chrome"
import { useDemoActivity } from "@/hooks/use-demo-activity"

export function Policy() {
  return (
    <Section id="policy">
      <SectionHead
        eyebrow="Policy"
        title="Don't just pick a server. Define the path."
        lede="A proxy list tells you what is available. A policy tells Zeytun how to choose. Build policies out of proxies and other policies, then let them keep choosing the fastest way out."
      />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
        <div className="space-y-8">
          <Rise>
            <Option
              title="Policies inside policies"
              description={
                <>
                  A member can be a proxy or another policy.{" "}
                  <strong className="text-foreground">Manual</strong> picks by
                  hand. <strong className="text-foreground">Auto</strong>{" "}
                  measures latency and takes the lowest.
                </>
              }
            />
          </Rise>
          <Separator />
          <Rise delay={0.1}>
            <Option
              title="Balancing that fits the traffic"
              description="Spread load across a pool, pin a session to one node, or fall back when one dies: Round Robin, Weighted, Least Connections, Consistent Hashing, Sticky Sessions, Failover."
            />
          </Rise>
          <Separator />
          <Rise delay={0.2}>
            <Option
              title="Proxy chains"
              description="One hop isn't always enough. Send traffic through several in order."
            />
          </Rise>
        </div>
        <Rise delay={0.15}>
          <PolicyFig />
        </Rise>
      </div>

      <Rise>
        <OutboundModes />
      </Rise>

      <Rise className="mt-12">
        <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Protocols
        </p>
        <ChipRow items={PROTOCOLS} />
      </Rise>
    </Section>
  )
}

const PROTOCOLS = [
  "VLESS",
  "VMess",
  "Trojan",
  "Shadowsocks",
  "Hysteria2",
  "TUIC",
  "SOCKS",
  "HTTP",
] as const

/**
 * The three outbound modes are a mutually exclusive switch in the app, so the
 * mock cycles through them rather than showing all three as equals.
 */
const MODES = [
  {
    name: "Direct",
    description: "sends everything straight out.",
  },
  {
    name: "Global",
    description: "sends everything through one policy.",
  },
  {
    name: "Rule",
    description: "hands the decision to your rule list.",
  },
] as const

function OutboundModes() {
  const { ref, canAnimate, reducedMotion } = useDemoActivity()
  const [active, setActive] = useState(2)

  useEffect(() => {
    if (!canAnimate) return
    const iv = setInterval(() => setActive((a) => (a + 1) % MODES.length), 2400)
    return () => clearInterval(iv)
  }, [canAnimate])

  const currentActive = reducedMotion ? 2 : active

  return (
    <div ref={ref} className="mt-16 rounded-3xl border border-border/40 bg-card/40 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex rounded-full border border-border/40 bg-card/70 p-1">
          {MODES.map((m, i) => (
            <span
              key={m.name}
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
                i === currentActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {m.name}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground">
          <strong className="font-heading text-lg text-foreground">
            {MODES[currentActive].name}
          </strong>{" "}
          {MODES[currentActive].description}
        </p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Switch modes while the core is running. Existing connections are closed so new connections use the selected mode.
      </p>
    </div>
  )
}

/** Members and latencies from the v3 mock — one of them is a nested policy. */
const MEMBERS = [
  { name: "nld-hys-01", latency: 48, kind: "proxy" as const },
  { name: "fra-reality", latency: 62, kind: "proxy" as const },
  { name: "ams-ss", latency: null, kind: "proxy" as const },
  { name: "eu-fallback", latency: 48, kind: "policy" as const },
]

const SNAPSHOTS: (number | null)[][] = [
  [48, 62, null, 55],
  [66, 43, null, 58],
  [61, 57, null, 39],
  [46, 63, null, 52],
]

function getBestIndex(latencies: (number | null)[]): number {
  let bestIdx = 0
  let minLat = Infinity
  for (let i = 0; i < latencies.length; i++) {
    const lat = latencies[i]
    if (lat !== null && lat < minLat) {
      minLat = lat
      bestIdx = i
    }
  }
  return bestIdx
}

function PolicyFig() {
  const { ref, canAnimate, reducedMotion } = useDemoActivity()
  const [snapshotIdx, setSnapshotIdx] = useState(0)

  useEffect(() => {
    if (!canAnimate) return
    const iv = setInterval(() => {
      setSnapshotIdx((idx) => (idx + 1) % SNAPSHOTS.length)
    }, 2200)
    return () => clearInterval(iv)
  }, [canAnimate])

  const currentIdx = reducedMotion ? 0 : snapshotIdx
  const currentLatencies = SNAPSHOTS[currentIdx]
  const pick = getBestIndex(currentLatencies)

  return (
    <div ref={ref}>
      <WindowMock title="Policy" bodyClassName="p-4">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-heading text-xl">streaming-pool</span>
          <Chip on className="ms-auto">
            Auto
          </Chip>
        </div>

        <div className="space-y-2">
          {MEMBERS.map((m, i) => {
            const latency = currentLatencies[i]
            const isSelected = i === pick
            return (
              <motion.div
                key={m.name}
                animate={{ opacity: latency === null ? 0.45 : 1 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 font-mono text-xs transition-colors",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/40 bg-card/70"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    latency === null
                      ? "bg-destructive/60"
                      : isSelected
                        ? "bg-primary"
                        : "bg-muted-foreground/40"
                  )}
                />
                <span className="truncate">{m.name}</span>
                {m.kind === "policy" && (
                  <span className="shrink-0 rounded bg-muted px-1.5 text-[10px] text-muted-foreground">
                    policy
                  </span>
                )}
                <span
                  className={cn(
                    "ms-auto shrink-0",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {latency === null ? "—" : `${latency} ms`}
                </span>
              </motion.div>
            )
          })}
        </div>

        <p className="mt-4 font-mono text-[11px] text-muted-foreground">
          A member can be a proxy or another policy. <Code>Auto</Code> keeps
          re-measuring.
        </p>
      </WindowMock>
    </div>
  )
}
