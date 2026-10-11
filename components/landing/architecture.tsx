"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { Section } from "../common/section"
import { cn } from "@/lib/utils"
import { Code, Option, Rise, SectionHead } from "./chrome"

export function Architecture() {
  return (
    <Section id="core">
      <SectionHead
        eyebrow="Architecture"
        title="We control the engine, not just the interface."
        lede="What an interface can promise depends entirely on what runs below it. Zeytun ships its own core, so the behaviour you see is backed by an engine we maintain ourselves."
      />
      <ABody />
    </Section>
  )
}

/**
 * L4 — the stack diagram stays put on the left while the four claims scroll
 * past on the right, each one lighting the layer it depends on.
 */
const POINTS = [
  {
    layer: 1,
    title: "Rules that apply live",
    description:
      "Add, edit or reorder routing rules while the core is running. Existing connections are closed so new connections can follow the updated rules; active downloads and calls may reconnect.",
  },
  {
    layer: 2,
    title: "TUN mode",
    description:
      "Capture traffic at the interface, including the apps that quietly ignore a system proxy. Or stay on a mixed HTTP/SOCKS proxy when you'd rather not touch the routing table.",
  },
  {
    layer: 1,
    title: "A core we ship ourselves",
    description: (
      <>
        Not a wrapper around whatever is installed on your machine.{" "}
        <Code>zeytun-core</Code> ships inside the app, and we patch and update
        it on our own schedule.
      </>
    ),
  },
  {
    layer: 0,
    title: "It stays on your machine",
    description:
      "Profiles and traffic statistics are stored locally on your Mac. The connection inspector and live log views keep recent data locally during use. No account is required.",
  },
] as const

const STACK = [
  {
    name: "Rust · Tauri",
    note: "process attribution, system integration, storage",
  },
  {
    name: "zeytun-core",
    note: "a sing-box derivative we maintain, GPLv3",
  },
  {
    name: "TUN interface / system proxy",
    note: "where your traffic actually leaves",
  },
]

function ABody() {
  const [active, setActive] = useState(0)

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
      {/* The sticky element is a full-height flex box, not the card: `top-24`
          alone pinned a 400px card under the nav and left the lower half of the
          screen empty. Centring inside a `100svh - nav` box keeps the figure on
          the reader's eye-line, whatever the card's height. */}
      <div className="lg:sticky lg:top-15 lg:flex lg:h-[calc(100svh-60px)] lg:items-center">
        {/* Rise wraps the figure, not the sticky container — a transform on the
            sticky element itself would break the sticking. */}
        <Rise className="w-full">
          <StackFig active={active} />
        </Rise>
      </div>

      <div className="space-y-16 lg:space-y-40 lg:py-20">
        {POINTS.map((p, i) => (
          <motion.div
            key={p.title}
            // narrow band: fires when the paragraph reaches the middle of the
            // screen, which is where the sticky figure sits
            viewport={{ margin: "-45% 0px -45% 0px", once: false }}
            onViewportEnter={() => setActive(p.layer)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Option title={p.title} description={p.description} />
              <span className="mt-3 block font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
                {String(i + 1).padStart(2, "0")} / {STACK[p.layer].name}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StackFig({ active }: { active: number }) {
  return (
    <div className="space-y-3 rounded-3xl border border-border/40 bg-card/40 p-6">
      <p className="mb-4 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Stack
      </p>
      {STACK.map((layer, i) => (
        <motion.div
          key={layer.name}
          animate={{
            scale: i === active ? 1 : 0.98,
            opacity: i === active ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "rounded-2xl border p-4 transition-colors",
            i === active
              ? "border-primary/40 bg-primary/5"
              : "border-border/40 bg-card/70"
          )}
        >
          <div className="flex items-baseline gap-3">
            <span
              className={cn(
                "font-mono text-xs",
                i === active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <span className="font-heading text-xl">{layer.name}</span>
          </div>
          <p className="mt-1 ps-7 text-sm text-muted-foreground">
            {layer.note}
          </p>
        </motion.div>
      ))}

      <p className="pt-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
        your traffic leaves here ↓
      </p>
    </div>
  )
}
