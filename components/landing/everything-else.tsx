"use client"

import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Bookmark02Icon,
  RssIcon,
  WifiConnected02Icon,
  DashboardSpeed02Icon,
  ChartHistogramIcon,
  TerminalIcon,
} from "@hugeicons/core-free-icons"
import { IconSvgObject } from "@hugeicons/core-free-icons/types"

import { Section } from "../common/section"
import { SectionHead } from "./chrome"

export function EverythingElse() {
  return (
    <Section id="more">
      <SectionHead
        eyebrow="Everything else"
        title="And the rest of it."
        lede="The core idea is simple. The toolbox under it isn't."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: (i % 3) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-3xl border border-border/40 bg-card/40 p-6 transition-colors hover:border-border"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <HugeiconsIcon icon={item.icon} className="size-5" />
            </div>
            <h3 className="mb-1.5 font-heading text-2xl">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

const ITEMS: {
  icon: IconSvgObject
  title: string
  description: string
}[] = [
  {
    icon: Bookmark02Icon,
    title: "Profiles",
    description:
      "Separate proxies, policies, rules and DNS per profile. Switch, and the whole setup changes with it.",
  },
  {
    icon: RssIcon,
    title: "Subscriptions",
    description:
      "Point a profile at a subscription URL and let it pull the node list in — on its own schedule, with usage and expiry read straight off the subscription.",
  },
  {
    icon: WifiConnected02Icon,
    title: "Share over LAN",
    description:
      "Let phones, TVs and VMs on your network leave through this machine, under the same rules.",
  },
  {
    icon: DashboardSpeed02Icon,
    title: "Tools",
    description:
      "Network quality — download and upload throughput, responsiveness, HTTP/3. STUN — NAT mapping, filtering and your external address. Latency, split into router, DNS and proxy.",
  },
  {
    icon: ChartHistogramIcon,
    title: "Traffic history",
    description:
      "Today and this month, per process and per host, kept locally.",
  },
  {
    icon: TerminalIcon,
    title: "Logs",
    description: "Live core and app output, filtered by level.",
  },
]
