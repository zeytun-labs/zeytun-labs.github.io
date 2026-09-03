"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

import { Section } from "../common/section"
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

export function Rules() {
  return (
    <Section id="rules">
      <SectionHead
        eyebrow="Rules"
        title="Make the decision once."
        lede={
          <>
            Checkpoint is how you decide. Rules are how you stop deciding. They
            are evaluated top to bottom, the first match wins, and the last row
            is always <Code>FINAL</Code> — the fate of everything that matched
            nothing.
          </>
        }
      />

      <Rise>
        <RuleTableFig />
      </Rise>

      <div className="mt-12 divide-y divide-border/40">
        <Row
          title="Order is the logic"
          description="Drag a rule to change its priority. Switch one off without deleting it. Leave yourself a comment on every line."
        />
        <Row
          title="Match what matters"
          description={<ChipRow className="mt-3" items={MATCH_TYPES} />}
        />
        <Row
          title="Bring your own rule-sets"
          description={
            <>
              Drop in <Code>.srs</Code> files — geosite, geoip, or one you built
              yourself — or point at a remote URL and pull it through a policy
              of your choice. The same sets work as a condition in your DNS
              rules.
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {RULE_SETS.map((rs) => (
                  <div
                    key={rs.file}
                    className="flex items-baseline gap-3 rounded-xl border border-border/40 bg-card/70 px-3 py-2 font-mono text-xs"
                  >
                    <span className="text-foreground">{rs.file}</span>
                    <span className="ms-auto text-muted-foreground">
                      {rs.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          }
        />
        <Row
          title="Three lifespans"
          description={
            <>
              Permanent rules stay. Temporary rules expire on a timer you set.
              Session rules disappear the moment the core reloads. A quick test
              never becomes permanent clutter.
              <ChipRow className="mt-3" items={TTLS} />
            </>
          }
        />
      </div>
    </Section>
  )
}

function Row({
  title,
  description,
}: {
  title: string
  description: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-8"
    >
      <Option title={title} description={description} />
    </motion.div>
  )
}

const MATCH_TYPES = [
  "DOMAIN",
  "DOMAIN-SUFFIX",
  "DOMAIN-KEYWORD",
  "DOMAIN-REGEX",
  "GEOSITE",
  "IP-CIDR",
  "GEOIP",
  "PROCESS-NAME",
  "PROCESS-PATH",
  "PROCESS-PATH-REGEX",
  "IN-PORT",
  "DEST-PORT",
  "PROTOCOL",
] as const

const TTLS = [
  "Permanent",
  "1 hour",
  "6 hours",
  "24 hours",
  "7 days",
  "Session",
] as const

const RULE_SETS = [
  { file: "geosite-ads.srs", count: "112,480 rules" },
  { file: "geoip-ir.srs", count: "9,214 prefixes" },
]

/** Rules are ordered, so the mock's only motion is one row changing places. */
const RULES = [
  {
    type: "PROCESS-PATH-REGEX",
    value: "Telegram\\.app",
    policy: "streaming-pool",
    expiry: "—",
    on: true,
  },
  {
    type: "DOMAIN-SUFFIX",
    value: "githubusercontent.com",
    policy: "eu-fallback",
    expiry: "6h",
    on: true,
  },
  {
    type: "GEOSITE",
    value: "geosite-ads",
    policy: "Reject",
    expiry: "—",
    on: true,
  },
  {
    type: "IP-CIDR",
    value: "192.168.0.0/16",
    policy: "Direct",
    expiry: "—",
    on: false,
  },
  {
    type: "PROCESS-NAME",
    value: "curl",
    policy: "Direct",
    expiry: "Session",
    on: true,
  },
]

function RuleTableFig() {
  const [order, setOrder] = useState(RULES.map((_, i) => i))
  const [dragging, setDragging] = useState<number | null>(null)

  useEffect(() => {
    // one rule is lifted and dropped one slot higher, forever — priority is
    // the whole point of the section
    let step = 0
    const iv = setInterval(() => {
      step += 1
      if (step % 2 === 1) {
        const from = 1 + (((step / 2) | 0) % 3)
        setDragging(order[from])
        setOrder((o) => {
          const next = [...o]
          const [moved] = next.splice(from, 1)
          next.splice(from - 1, 0, moved)
          return next
        })
      } else {
        setDragging(null)
      }
    }, 1600)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WindowMock title="Rules" bodyClassName="p-4">
      <div className="mb-2 hidden grid-cols-[16px_1fr_auto_auto_28px] items-center gap-3 px-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase md:grid">
        <span />
        <span>Match</span>
        <span>Policy</span>
        <span className="w-14 text-end">Expires</span>
        <span />
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {order.map((id) => {
            const r = RULES[id]
            return (
              <motion.div
                key={r.type + r.value}
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                animate={{ opacity: r.on ? 1 : 0.45 }}
                className={cn(
                  "grid grid-cols-[16px_1fr_auto] items-center gap-3 rounded-xl border bg-card/70 px-3 py-2.5 font-mono text-xs md:grid-cols-[16px_1fr_auto_auto_28px]",
                  dragging === id
                    ? "border-primary/40 bg-primary/5 shadow-lg shadow-black/30"
                    : "border-border/40"
                )}
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  className="size-4 text-muted-foreground/50"
                />
                <span className="flex min-w-0 items-center gap-2">
                  <Chip className="shrink-0 px-1.5 py-0.5 text-[10px]">
                    {r.type}
                  </Chip>
                  <span className="truncate text-muted-foreground">
                    {r.value}
                  </span>
                </span>
                <span className="hidden text-foreground md:block">
                  {r.policy}
                </span>
                <span className="hidden w-14 text-end text-muted-foreground md:block">
                  {r.expiry}
                </span>
                <Switch on={r.on} />
              </motion.div>
            )
          })}
        </AnimatePresence>

        <div className="grid grid-cols-[16px_1fr_auto] items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 font-mono text-xs md:grid-cols-[16px_1fr_auto_auto_28px]">
          <span />
          <span className="flex items-center gap-2">
            <Chip on className="shrink-0 px-1.5 py-0.5 text-[10px]">
              FINAL
            </Chip>
            <span className="truncate text-muted-foreground">
              everything that matched nothing
            </span>
          </span>
          <span className="hidden text-primary md:block">streaming-pool</span>
          <span className="hidden w-14 text-end text-muted-foreground md:block">
            —
          </span>
          <span />
        </div>
      </div>
    </WindowMock>
  )
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "hidden h-3.5 w-6 shrink-0 rounded-full p-0.5 transition-colors md:flex",
        on ? "justify-end bg-primary/70" : "justify-start bg-muted"
      )}
    >
      <span className="block size-2.5 rounded-full bg-background" />
    </span>
  )
}
