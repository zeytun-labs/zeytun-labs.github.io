"use client"

import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Asterisk02Icon } from "@hugeicons/core-free-icons"

import { Description, Heading, Title } from "../common/section"
import { cn } from "@/lib/utils"

/**
 * The three pieces every section header repeats: eyebrow, heading, lede —
 * each rising on its own delay. Was duplicated verbatim in traffic-monitor,
 * process, checkpoint, policy and why-zeytun before this.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "center",
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: "center" | "start"
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-16 flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {[
        <Title key="t">{eyebrow}</Title>,
        <Heading key="h">{title}</Heading>,
        lede ? <Description key="d">{lede}</Description> : null,
      ]
        .filter(Boolean)
        .map((el, i) => (
          <Rise key={i} delay={i * 0.07}>
            {el}
          </Rise>
        ))}
    </div>
  )
}

/**
 * Scroll-in for everything that isn't a section header. `SectionHead` had this
 * built in, so headers animated while the bodies and figures below them just
 * appeared — wrap them in this instead of re-declaring the transition.
 */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay * 1000}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

/** A titled paragraph in the two-column feature lists. */
export function Option({
  title,
  description,
  className,
}: {
  title: string
  description: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex gap-1">
        <HugeiconsIcon
          icon={Asterisk02Icon}
          className="mt-0.75 size-6 shrink-0 text-primary"
        />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <div className="ps-7 text-muted-foreground">{description}</div>
    </div>
  )
}

/** Inline code token: `FINAL`, `.srs`, `DoH` — uppercase as in the app. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  )
}

/** Monospace pill used for rule types, protocols, transports and lifespans. */

export function Chip({
  children,
  on,
  className,
}: {
  children: React.ReactNode
  on?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1.5 font-mono text-xs",
        on
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border/40 bg-card/70 text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Chips that pop in one after another as the row scrolls into view. */
export function ChipRow({
  items,
  on,
  className,
}: {
  items: readonly string[]
  on?: readonly string[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: Math.min(i, 12) * 0.04 }}
        >
          <Chip on={on?.includes(item)}>{item}</Chip>
        </motion.div>
      ))}
    </div>
  )
}

/** Window chrome for the abstract product mocks: traffic lights + title. */
export function WindowMock({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/40 bg-card/40",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-3 py-2.5">
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ms-2 font-heading text-xs font-bold tracking-widest text-muted-foreground/60 uppercase">
          {title}
        </span>
        <span className="ms-auto font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
          Illustrative preview
        </span>
      </div>
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </div>
  )
}
