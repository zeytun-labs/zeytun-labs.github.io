"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { GridNet } from "./gird-net"
import { motion } from "motion/react"
import { CheckpointWindowMinimal } from "./checkpoint-window"
import { RouteChip } from "./route-chip"
import { HugeiconsIcon } from "@hugeicons/react"
import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import {
  Radar03Icon,
  Flag02Icon,
  Directions02Icon,
} from "@hugeicons/core-free-icons"
import { IconSvgObject } from "@hugeicons/core-free-icons/types"

export function WhyZeytun() {
  return (
    <Section id="model">
      <SectionHead
        eyebrow="How it works"
        title="See. Decide. Route."
        lede={
          <>
            Most tools give you a switch and a status light.
            <br className="hidden md:block" />
            Zeytun gives you the whole picture, then hands you the controls.
          </>
        }
      />
      <WZBody />
      <Glance />
    </Section>
  )
}

const glance = [
  { label: "Network", value: "Wi-Fi" },
  { label: "Outbound mode", value: "Rule-based" },
  { label: "Inbound", value: "TUN" },
  { label: "Active connections", value: "24" },
]

const legs = [
  { name: "router", value: "1 ms", width: "6%" },
  { name: "DNS", value: "12 ms", width: "35%" },
  { name: "proxy", value: "21 ms", width: "62%" },
]

/**
 * The status row the app shows above the ledger: what the machine is on, how
 * it is routing, and where the latency actually goes.
 */
function Glance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6 grid grid-cols-1 gap-6 rounded-3xl border border-border/40 bg-card/40 p-6 md:grid-cols-2"
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
        {glance.map((tile) => (
          <div key={tile.label}>
            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {tile.label}
            </dt>
            <dd className="mt-1 font-heading text-2xl leading-none">
              {tile.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 md:border-s md:border-border/40 md:ps-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Network latency
          </span>
          <span className="ms-auto font-heading text-2xl leading-none text-primary">
            34 ms
          </span>
        </div>
        {legs.map((leg) => (
          <div key={leg.name} className="flex items-center gap-3">
            <span className="w-14 font-mono text-xs text-muted-foreground">
              {leg.name}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: leg.width }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-primary/60"
              />
            </div>
            <span className="w-12 text-end font-mono text-xs">{leg.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function WZBody() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[
        <SeeCard key="see" />,
        <DecideCard key="decide" />,
        <RouteCard key="route" />,
      ].map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.7,
            delay: i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  )
}

function Card({
  children,
  className,
  icon,
  title,
  description,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon: IconSvgObject
  title: string
  description: string
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border! bg-linear-to-b from-card/70 to-card/20 bg-clip-padding pb-6 transition-colors",
        className
      )}
      {...props}
    >
      {children}

      <div className="relative z-10 px-6">
        <div className="mb-2 flex items-center gap-2">
          {/* Fallback svg if Target02Icon fails, but HugeiconsIcon is safe */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <HugeiconsIcon icon={icon} />
          </div>
          <h3 className="font-heading text-3xl tracking-wide">{title}</h3>
        </div>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function Fig({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-50 w-full items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SeeCard() {
  return (
    <Card
      icon={Radar03Icon}
      title="SEE"
      description="Every connection attributed to the app that opened it, with live upload and download per process, host and policy."
    >
      <Fig>
        {/* Radar Animation */}
        <div className="absolute top-0 aspect-square w-4/5">
          <div className="absolute -top-1/2 aspect-square w-full rounded-full border border-border">
            <div className="absolute inset-5 rounded-full border border-border" />
            <div className="absolute inset-10 rounded-full border border-border" />
            <div className="absolute inset-15 rounded-full border border-border" />
            <div className="absolute inset-20 rounded-full border border-border" />
            <div className="absolute inset-25 rounded-full border border-border" />
            <div className="absolute inset-30 rounded-full border border-border" />
            {/* Sweep */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(132,204,22,0.2)_360deg)]" />
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
              <div className="absolute top-0 left-1/2 h-1/2 w-0.5 origin-bottom -translate-x-1/2 rounded-full bg-lime-500/80 shadow-[0_0_8px_rgba(132,204,22,0.6)]" />{" "}
            </div>
            {/* Blips */}
            <div className="absolute top-[85%] left-[50%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            <div className="absolute top-[55%] left-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)] delay-75" />
            <div className="absolute top-[75%] left-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)] delay-150" />
          </div>
        </div>
      </Fig>
    </Card>
  )
}

function DecideCard() {
  return (
    <Card
      icon={Flag02Icon}
      title="DECIDE"
      description="Turn Checkpoint on and unmatched connections wait for you. Allow, block, or send it somewhere — once, or as a rule."
    >
      <Fig className="relative">
        <GridNet />
        <CheckpointWindowMinimal />
      </Fig>
    </Card>
  )
}

function RouteCard() {
  return (
    <Card
      icon={Directions02Icon}
      title="ROUTE"
      description="Rules, policies, proxy chains and DNS. Traffic goes exactly where you send it, or nowhere at all."
    >
      <Fig>
        <RouteChip />
      </Fig>
    </Card>
  )
}
