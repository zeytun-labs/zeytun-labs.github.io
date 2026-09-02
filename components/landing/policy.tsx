"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Description, Heading, Section, Title } from "../common/section"
import { HugeiconsIcon } from "@hugeicons/react"
import { Asterisk02Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"

export function Policy() {
  return (
    <Section>
      <div className="mb-16 flex flex-col items-center text-center">
        {[
          <Title key="pol-t">Policy</Title>,
          <Heading key="pol-h">Policies, not just a server list</Heading>,
          <Description key="pol-d">
            Three outbound modes, eight protocols, and policies that nest inside each other. Build the exact topology you want, then let it keep choosing the fastest way out.
          </Description>,
        ].map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2">
        <div className="space-y-8">
          <Option
            title="Policies inside policies"
            description="A policy member can be a proxy or another policy. Manual picks by hand, Auto picks the lowest latency."
          />
          <Separator />
          <Option
            title="Balancing that fits the traffic"
            description="Spread load across a pool, pin a session to one node, or fall back when one dies: Round Robin, Weighted Round Robin, Least Connections, Consistent Hashing, Sticky Sessions and Failover."
          />
          <Separator />
          <Option
            title="Proxy chains"
            description="Send traffic through several hops in order when one is not enough to get out."
          />
        </div>
        <div className="pt-6 relative">
          <AnimatedFig />
        </div>
      </div>
    </Section>
  )
}

function Option({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        <HugeiconsIcon icon={Asterisk02Icon} className="size-6 text-primary" />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <p className="ps-7 text-muted-foreground">{description}</p>
    </div>
  )
}

function Protocols() {
  const protocols = [
    "http", "socks", "shadowsocks", "trojan",
    "vmess", "vless", "hysteria2", "tuic"
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {protocols.map((p, i) => (
        <motion.div
          key={p}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="px-3 py-1.5 rounded-full border border-border/40 bg-card/70 font-mono text-xs text-muted-foreground"
        >
          {p}
        </motion.div>
      ))}
    </div>
  )
}

function AnimatedFig() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev: number) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-100 ms-auto flex flex-col gap-3 relative z-10">
      <PolicyCard 
        type="AUTO" 
        name="Auto-Select" 
        details="3 Members" 
        active={activeIdx === 0} 
      />
      <PolicyCard 
        type="BALANCER" 
        name="Load Balancer" 
        details="Round Robin • 5 Members" 
        active={activeIdx === 1} 
      />
      <PolicyCard 
        type="MANUAL" 
        name="Direct Route" 
        details="1 Member" 
        active={activeIdx === 2} 
      />
      
      <div className="mt-4 p-4 rounded-2xl border border-border/40 bg-card/40">
        <div className="text-sm font-medium mb-3">Protocols</div>
        <Protocols />
      </div>
    </div>
  )
}

function PolicyCard({ type, name, details, active }: { type: string, name: string, details: string, active: boolean }) {
  return (
    <motion.div
      layout
      animate={{
        scale: active ? 1.02 : 1,
        backgroundColor: active ? "rgba(var(--card-rgb), 0.8)" : "rgba(var(--card-rgb), 0.4)",
        borderColor: active ? "rgba(var(--primary-rgb), 0.5)" : "rgba(var(--border-rgb), 0.4)"
      }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-colors",
        active ? "shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]" : ""
      )}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <HugeiconsIcon icon={Asterisk02Icon} className="size-5" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{type}</span>
        <span className="text-sm font-medium truncate">{name}</span>
        <span className="text-xs text-muted-foreground truncate">{details}</span>
      </div>
      {active && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
        />
      )}
    </motion.div>
  )
}
