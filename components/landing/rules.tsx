"use client"

import { useEffect, useReducer } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { useDemoActivity } from "@/hooks/use-demo-activity"

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

type RuleState = {
  order: number[]
  dragging: number | null
  step: number
}

type RuleAction = { type: "tick" }

function ruleReducer(state: RuleState, action: RuleAction): RuleState {
  if (action.type === "tick") {
    const nextStep = state.step + 1
    if (nextStep % 2 === 1) {
      const from = 1 + (Math.floor(nextStep / 2) % 3)
      const nextOrder = [...state.order]
      const movedId = nextOrder[from]
      nextOrder.splice(from, 1)
      nextOrder.splice(from - 1, 0, movedId)
      return {
        order: nextOrder,
        dragging: movedId,
        step: nextStep,
      }
    } else {
      return {
        ...state,
        dragging: null,
        step: nextStep,
      }
    }
  }
  return state
}

function RuleTableFig() {
  const { ref, canAnimate } = useDemoActivity()
  const [state, dispatch] = useReducer(ruleReducer, {
    order: RULES.map((_, i) => i),
    dragging: null,
    step: 0,
  })

  useEffect(() => {
    if (!canAnimate) return
    const iv = setInterval(() => {
      dispatch({ type: "tick" })
    }, 1600)
    return () => clearInterval(iv)
  }, [canAnimate])

  return (
    <div ref={ref}>
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
            {state.order.map((id) => {
              const r = RULES[id]
              return (
                <motion.div
                  key={r.type + r.value}
                  layout
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  animate={{ opacity: r.on ? 1 : 0.45 }}
                  className={cn(
                    "rounded-xl border bg-card/70 px-3 py-2.5 font-mono text-xs",
                    "flex flex-col gap-1.5 md:grid md:grid-cols-[16px_minmax(0,1fr)_auto_auto_28px] md:items-center md:gap-3",
                    state.dragging === id
                      ? "border-primary/40 bg-primary/5 shadow-lg shadow-black/30"
                      : "border-border/40"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 md:contents">
                    <HugeiconsIcon
                      icon={Menu01Icon}
                      className="size-4 shrink-0 text-muted-foreground/50"
                    />
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Chip className="shrink-0 px-1.5 py-0.5 text-[10px]">
                        {r.type}
                      </Chip>
                      <span className="truncate text-muted-foreground min-w-0">
                        {r.value}
                      </span>
                    </div>
                    <div className="md:hidden">
                      <Switch on={r.on} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between ps-6 text-[11px] md:contents">
                    <span className="text-foreground">
                      {r.policy}
                    </span>
                    <span className="text-muted-foreground md:w-14 md:text-end">
                      {r.expiry}
                    </span>
                  </div>

                  <div className="hidden md:block">
                    <Switch on={r.on} />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <div
            className={cn(
              "rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 font-mono text-xs",
              "flex flex-col gap-1.5 md:grid md:grid-cols-[16px_minmax(0,1fr)_auto_auto_28px] md:items-center md:gap-3"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 md:contents">
              <span className="hidden md:block" />
              <div className="flex min-w-0 flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
                <Chip on className="shrink-0 px-1.5 py-0.5 text-[10px]">
                  FINAL
                </Chip>
                <span className="text-muted-foreground text-xs break-words">
                  everything that matched nothing
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] md:contents">
              <span className="text-primary">streaming-pool</span>
              <span className="text-muted-foreground md:w-14 md:text-end">—</span>
            </div>
            <span className="hidden md:block" />
          </div>
        </div>
      </WindowMock>
    </div>
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
