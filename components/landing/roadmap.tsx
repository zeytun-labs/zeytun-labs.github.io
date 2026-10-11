"use client"

import { motion } from "motion/react"

import { Section } from "../common/section"
import { cn } from "@/lib/utils"
import { Code, SectionHead } from "./chrome"

export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHead
        eyebrow="Roadmap"
        title="Where this is going."
        lede="Three phases, in order. No dates — each one ships when it is actually ready."
      />

      <div className="relative ps-8">
        {/* the rail */}
        <div className="absolute inset-y-2 start-0 w-px bg-border" />

        <div className="space-y-16">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute top-2 -start-[38px] size-3 rounded-full outline-4 outline-background",
                  phase.stage === "NOW"
                    ? "bg-primary"
                    : "border-2 border-muted-foreground/40 bg-background"
                )}
              />

              <div className="mb-1 flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                    phase.stage === "NOW"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {phase.stage}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Phase {phase.number}
                </span>
              </div>

              <h3 className="mb-2 font-heading text-3xl">{phase.title}</h3>
              {phase.lede && (
                <p className="mb-4 text-muted-foreground">{phase.lede}</p>
              )}

              <ul className="max-w-2xl space-y-2.5">
                {phase.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-muted-foreground before:mt-2.5 before:size-1 before:shrink-0 before:rounded-full before:bg-primary/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

const PHASES: {
  stage: "NOW" | "NEXT" | "LATER"
  number: string
  title: string
  lede?: string
  items: React.ReactNode[]
}[] = [
  {
    stage: "NOW",
    number: "01",
    title: "Something you can trust on macOS.",
    lede: "The first goal is correctness.",
    items: [
      "Beta → stable v1",
      "More reliable process attribution for captured traffic",
      "Improve DNS routing and recovery",
      "Refine Connection Ask for unmatched TCP traffic",
    ],
  },
  {
    stage: "NEXT",
    number: "02",
    title: "The same setup on every machine.",
    items: [
      "Windows and Linux, each with real TUN capture and process routing — not a cut-down build",
      "Profiles that travel with you between your own machines",
    ],
  },
  {
    stage: "LATER",
    number: "03",
    title: "The network layer, in your hands.",
    items: [
      "Take an app off the network entirely, instead of only choosing its route",
      "Connection history you can search back through, not just watch go by",
      "Read inside HTTPS when you need to: a CA the app generates and the system trusts, in one click",
      <>
        Rewrite a request or answer it yourself — URLs, headers and bodies, a
        local file as the response, or a few lines of <Code>JavaScript</Code>
      </>,
      "A core that is ours, not a derivative",
    ],
  },
]
