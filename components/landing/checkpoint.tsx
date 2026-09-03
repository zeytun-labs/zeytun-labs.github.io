"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Section } from "../common/section"
import { Code, Option, Rise, SectionHead } from "./chrome"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronDownIcon, CommandLineIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function Checkpoint() {
  return (
    <Section id="checkpoint">
      <SectionHead
        eyebrow="Checkpoint"
        title="Nothing new connects without asking."
        lede="Turn Checkpoint on and Zeytun stops guessing. When a connection matches no rule, it is held at the door and you are asked — with the app, the destination and your options in front of you."
      />
      <CBody />
    </Section>
  )
}

function CBody() {
  return (
    <div className="space-y-12">
      <Rise>
        <AnimatedFig />
      </Rise>

      <div className="grid grid-cols-1 border-border md:grid-cols-2 md:[&>*:nth-child(-n+2)]:border-b md:[&>*:nth-child(odd)]:border-e">
        <Rise>
          <Option
            className="p-6"
            title="It holds"
            description="Nothing moves until you answer. The connection is parked in the core, not dropped."
          />
        </Rise>
        <Rise delay={0.1}>
          <Option
            className="p-6"
            title="Three ways out, plus your own"
            description={
              <>
                Allow it, block it, hand it to <Code>FINAL</Code> — the
                catch-all at the bottom of your rule list — or pick any policy
                from the dropdown, for this connection only.
              </>
            }
          />
        </Rise>
        <Rise delay={0.15}>
          <Option
            className="p-6"
            title="Answer once"
            description={
              <>
                Turn on <strong className="text-foreground">Remember</strong>{" "}
                and your decision becomes a process rule you can find, edit,
                reorder or disable later. Leave it off and the decision lives
                until the core reloads.
              </>
            }
          />
        </Rise>
        <Rise delay={0.2}>
          <Option
            className="p-6"
            title="You can always walk away"
            description={
              <>
                If you don&apos;t answer, <Code>FINAL</Code> applies when the
                timeout runs out. Nothing hangs waiting on you.
              </>
            }
          />
        </Rise>
      </div>
    </div>
  )
}

/**
 * The ask window as it actually appears: a `curl` held in the terminal behind,
 * the policy dropdown, the Remember toggle, and the three buttons the app
 * ships — Allow · Use FINAL · Block.
 */
const POLICIES = ["streaming-pool", "eu-fallback", "Direct"] as const
const LOOP = 7 // steps of 1.2s: window in @1, dropdown @2, picked @3, remember @5

function AnimatedFig() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStep((prev) => (prev + 1) % LOOP), 1200)
    return () => clearInterval(timer)
  }, [])

  const picked = step >= 3 ? POLICIES[0] : "Direct"

  return (
    <div className="relative flex h-full min-h-100 items-center justify-center">
      {/* the connection that is being held, in the terminal that opened it */}
      <div
        className={cn(
          "absolute inset-y-8 start-0 end-0 flex flex-col overflow-hidden rounded-xl border border-border bg-muted/20 font-mono text-xs transition-all duration-500",
          step > 0
            ? "scale-95 opacity-40 blur-[2px]"
            : "blur-0 scale-100 opacity-80"
        )}
      >
        <div className="flex gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="p-4 text-muted-foreground">
          <p>
            <span className="text-primary/70">~ %</span> curl
            https://149.154.167.91
          </p>
          <p className="mt-1">* Trying 149.154.167.91:443...</p>
          <p>* TCP_NODELAY set</p>
          <span className="mt-1 inline-block h-3 w-1.5 animate-pulse bg-muted-foreground/50" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative z-10 w-full max-w-sm rounded-2xl bg-card shadow-2xl"
          >
            {/* spinning conic edge — masked by the inner card, leaving 1px */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
              <div
                className="absolute -inset-full animate-[spin_3s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 80%,oklch(0.841 0.238 128.85) 100%)",
                }}
              />
            </div>

            <div className="relative z-10 m-px h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-2xl bg-card">
              <div className="flex items-center justify-center rounded-t-2xl border-b border-border bg-muted/30 px-4 py-2">
                <span className="font-heading text-xs font-bold tracking-widest text-muted-foreground/60 uppercase">
                  Checkpoint
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={CommandLineIcon} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">curl (51234)</p>
                    <p className="w-fit rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      149.154.167.91:443
                    </p>
                  </div>
                </div>

                <p className="border-s-2 border-border ps-3 text-xs text-muted-foreground italic">
                  Pick an outbound, or wait for the FINAL timeout.
                </p>

                <div className="relative h-9">
                  <div className="absolute inset-0 flex items-center justify-between rounded-full border border-border/40 bg-input/30 px-4 text-sm">
                    <span className="text-muted-foreground">Action</span>
                    <div className="flex items-center gap-2">
                      <motion.span
                        key={picked}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-xs text-foreground"
                      >
                        {picked}
                      </motion.span>
                      <HugeiconsIcon
                        icon={ChevronDownIcon}
                        className={cn(
                          "size-4 text-muted-foreground opacity-50 transition-transform duration-300",
                          step === 2 && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute top-full left-0 z-20 mt-1 w-full rounded-2xl border border-border bg-popover p-1.5 shadow-lg"
                      >
                        {POLICIES.map((p, i) => (
                          <div
                            key={p}
                            className={cn(
                              "cursor-default rounded-full px-3 py-1.5 font-mono text-xs",
                              i === 0
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {p}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "flex h-3.5 w-6 shrink-0 rounded-full p-0.5 transition-colors",
                      step >= 5
                        ? "justify-end bg-primary/70"
                        : "justify-start bg-muted"
                    )}
                  >
                    <span className="block size-2.5 rounded-full bg-background" />
                  </span>
                  Remember (add process rule)
                </label>

                <div className="flex gap-2 pt-1">
                  <button
                    className={cn(
                      "flex-1 rounded-full px-3 py-1.5 text-xs font-medium text-primary-foreground! transition-all",
                      step >= 6
                        ? "bg-primary ring-2 ring-primary/40"
                        : "bg-primary"
                    )}
                  >
                    Allow
                  </button>
                  <button className="flex-1 rounded-full bg-white/5 px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground! transition-colors">
                    Use FINAL
                  </button>
                  <button className="flex-1 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground! transition-colors">
                    Block
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
