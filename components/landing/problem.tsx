"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { Heading, Section } from "../common/section"
import { Rise } from "./chrome"

/**
 * The four questions map 1:1 onto the sections that answer them, so each row
 * links to its own answer. They were four empty bordered cards before — a 2×2
 * grid whose rows fell out of alignment the moment one question wrapped, with
 * nothing inside the boxes to justify the borders.
 */
const questions = [
  {
    q: "Which app opened it?",
    a: "The application behind the traffic, with its binary path and live speed.",
    section: "Process",
    href: "#process",
  },
  {
    q: "Where is it going?",
    a: "The host it reached and the policy it took, connection by connection.",
    section: "Traffic Monitor",
    href: "#traffic",
  },
  {
    q: "Why was it allowed?",
    a: "The rule that matched — your list, read top to bottom, first match wins.",
    section: "Rules",
    href: "#rules",
  },
  {
    q: "What happens next time?",
    a: "Hold an eligible connection and decide. Turn on Remember to reuse a routing choice as a process rule.",
    section: "Checkpoint",
    href: "#checkpoint",
  },
]

export function Problem() {
  return (
    <Section className="max-w-3xl px-8" id="problem">
      <div className="flex flex-col items-center text-center">
        <Rise>
          <Heading>Your apps are always talking.</Heading>
        </Rise>
        <Rise delay={0.1}>
          <p className="mt-6 text-lg text-muted-foreground">
            Your machine opens connections all day — updaters, telemetry, sync
            agents, the tab you closed an hour ago. Most of it happens behind a
            proxy setting, a VPN switch and a status icon that tells you almost
            nothing.
          </p>
        </Rise>
      </div>

      <Rise delay={0.15}>
        <p className="mt-16 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Four questions you cannot answer today
        </p>
      </Rise>

      {/* Rows, not cards: each one sizes to its own content, so a question that
          wraps can't stretch a neighbour. Hairline dividers instead of four
          boxes — same treatment as the Rules and DNS lists. */}
      <div className="mt-4 divide-y divide-border/40 border-y border-border/40">
        {questions.map((item, i) => (
          <Rise key={item.q} delay={0.15 + i * 0.08}>
            <a
              href={item.href}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-7 transition-colors sm:grid-cols-[auto_1fr_auto]"
            >
              <span className="font-mono text-xs text-muted-foreground/60 transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-2xl transition-colors group-hover:text-primary">
                  {item.q}
                </p>
                <p className="mt-1.5 text-muted-foreground">{item.a}</p>
              </div>
              <span className="col-start-2 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase transition-colors group-hover:text-foreground sm:col-start-3 sm:self-center">
                {item.section}
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </Rise>
        ))}
      </div>

      <Rise delay={0.2}>
        <p className="mt-12 text-center text-lg text-pretty">
          Zeytun answers all four — and then lets you change the answer.
        </p>
      </Rise>
    </Section>
  )
}
