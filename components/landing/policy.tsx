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
  const [active, setActive] = useState(2)

  useEffect(() => {
    const iv = setInterval(() => setActive((a) => (a + 1) % MODES.length), 2400)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="mt-16 rounded-3xl border border-border/40 bg-card/40 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex rounded-full border border-border/40 bg-card/70 p-1">
          {MODES.map((m, i) => (
            <span
              key={m.name}
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-xs transition-colors",
                i === active
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
            {MODES[active].name}
          </strong>{" "}
          {MODES[active].description}
        </p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Switching modes takes effect at once — no restart, no reconnect.
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

function PolicyFig() {
  const [pick, setPick] = useState(0)

  useEffect(() => {
    // Auto policies re-measure and re-pick; the lowest latency wins
    const iv = setInterval(() => {
      setPick((p) => {
        const next = (p + 1) % MEMBERS.length
        // never "pick" the dead node — that is the whole point of Auto
        return MEMBERS[next].latency === null
          ? (next + 1) % MEMBERS.length
          : next
      })
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  return (
    <WindowMock title="Policy" bodyClassName="p-4">
      <div className="mb-4 flex items-baseline gap-2">
        <span className="font-heading text-xl">streaming-pool</span>
        <Chip on className="ms-auto">
          Auto
        </Chip>
      </div>

      <div className="space-y-2">
        {MEMBERS.map((m, i) => (
          <motion.div
            key={m.name}
            animate={{ opacity: m.latency === null ? 0.45 : 1 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 font-mono text-xs transition-colors",
              i === pick
                ? "border-primary/40 bg-primary/5"
                : "border-border/40 bg-card/70"
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                m.latency === null
                  ? "bg-destructive/60"
                  : i === pick
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
                i === pick ? "text-primary" : "text-muted-foreground"
              )}
            >
              {m.latency === null ? "—" : `${m.latency} ms`}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[11px] text-muted-foreground">
        A member can be a proxy or another policy. <Code>Auto</Code> keeps
        re-measuring.
      </p>
    </WindowMock>
  )
}
