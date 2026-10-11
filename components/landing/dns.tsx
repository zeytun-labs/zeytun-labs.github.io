"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { Section } from "../common/section"
import { cn } from "@/lib/utils"
import { ChipRow, Code, Option, Rise, SectionHead, WindowMock } from "./chrome"
import { useDemoActivity } from "@/hooks/use-demo-activity"

export function Dns() {
  return (
    <Section id="dns">
      <SectionHead
        eyebrow="DNS"
        title="Your DNS follows the rules too."
        lede="DNS is part of the path, not a text field in a settings pane. Zeytun opens all of it: route queries, split local from remote, and inspect any lookup."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <div className="divide-y divide-border/40">
          <Row
            title="Match before you resolve"
            description="Use FakeIP and DNS routing rules to resolve supported queries along the configured path. Flush the core and FakeIP caches in one click."
          />
          <Row
            title="Local stays local"
            description="Configure local and remote resolvers, choose where matching DNS queries go, and keep host entries for your own machines."
          />
          <Row
            title="DNS gets its own rules"
            description="An ordered rule list for queries, matched the way traffic is — by domain, by suffix, or by a rule-set you already use for routing. Send a query to your router, to a resolver of your choice, or refuse to answer it."
          />
          <Row
            title="Every transport"
            description={<ChipRow className="mt-3" items={TRANSPORTS} />}
          />
        </div>

        <Rise delay={0.15}>
          <ResolverFig />
        </Rise>
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
      className="py-7"
    >
      <Option title={title} description={description} />
    </motion.div>
  )
}

const TRANSPORTS = ["DoH", "DoT", "QUIC", "TCP", "UDP"] as const

const SERVERS = [
  {
    name: "cloudflare-dns.com",
    transport: "DoH",
    latency: "12 ms",
    scope: "remote",
  },
  { name: "192.168.1.1", transport: "UDP", latency: "1 ms", scope: "local" },
]

/** Query → matched rule → server. The lookup cycles through the three rules. */
const LOOKUPS = [
  { query: "nas.local", rule: "lan → local", answer: "192.168.1.24" },
  { query: "ads.doubleclick.net", rule: "ads → block", answer: "refused" },
  { query: "github.com", rule: "github.com → remote", answer: "140.82.121.4" },
]

const HOSTS = ["router.lan", "nas.local", "build.internal"]

function ResolverFig() {
  const { ref, canAnimate, reducedMotion } = useDemoActivity()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!canAnimate) return
    const iv = setInterval(() => setI((n) => (n + 1) % LOOKUPS.length), 2400)
    return () => clearInterval(iv)
  }, [canAnimate])

  const currentIdx = reducedMotion ? 0 : i
  const lookup = LOOKUPS[currentIdx]
  const blocked = lookup.answer === "refused"

  return (
    <div ref={ref}>
      <WindowMock title="DNS" bodyClassName="space-y-4 p-4">
        <div>
          <Label>Servers</Label>
          <div className="space-y-2">
            {SERVERS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/70 px-3 py-2 font-mono text-xs"
              >
                <span className="truncate">{s.name}</span>
                <span className="shrink-0 rounded bg-muted px-1.5 text-[10px] text-muted-foreground">
                  {s.transport}
                </span>
                <span className="ms-auto shrink-0 text-muted-foreground">
                  {s.latency}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[10px] italic",
                    s.scope === "local" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.scope}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Query</Label>
          <motion.div
            key={lookup.query}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 rounded-xl border border-border/40 bg-card/70 p-3 font-mono text-xs"
          >
            <p className="truncate text-foreground">{lookup.query}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <span className="text-primary">matched</span>
              <Code>{lookup.rule}</Code>
            </p>
            <p
              className={cn(
                "truncate",
                blocked ? "text-destructive/80" : "text-muted-foreground"
              )}
            >
              → {lookup.answer}
            </p>
          </motion.div>
        </div>

        <div>
          <Label>Hosts</Label>
          <div className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
            {HOSTS.map((h) => (
              <span
                key={h}
                className="rounded-lg border border-border/40 bg-card/70 px-2 py-1"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </WindowMock>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  )
}
