"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Description, Heading, Section, Title } from "../common/section"
import { HugeiconsIcon } from "@hugeicons/react"
import { Asterisk02Icon, CommandLineIcon } from "@hugeicons/core-free-icons"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"

export function Checkpoint() {
  return (
    <Section>
      <CHeader />
      <CBody />
    </Section>
  )
}

function CHeader() {
  return (
    <div className="mb-16 flex flex-col items-center text-center">
      {[
        <Title key="c-t">Checkpoint</Title>,
        <Heading key="c-h">Nothing new connects without asking</Heading>,
        <Description key="c-d">
          Turn Checkpoint on and Zeytun stops guessing. The connection is held,
          and you are asked.
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
  )
}

function CBody() {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 grid grid-cols-2 border-border [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(odd)]:border-r">
        <Option
          title="It holds"
          description="A window comes up with the app that asked, where it wants to go, and your options. Nothing moves until you answer."
        />
        <Option
          title="Four ways out"
          description="Allow it, block it, hand it to the FINAL rule — the catch-all at the bottom of your rule list — or pick any policy from the dropdown, per connection."
        />
        <Option
          title="Answer once"
          description="Flip “remember” and your decision is written as a process rule you can find, edit, reorder or disable later."
        />

        <Option
          title="Walk away"
          description="If you don't answer, the FINAL rule applies when the timeout runs out. Nothing hangs waiting on you."
        />
      </div>
      <div className="col-span-2">
        <AnimatedFig />
      </div>
    </div>
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
    <div className="space-y-0.5 p-6">
      <div className="flex gap-1">
        <HugeiconsIcon
          icon={Asterisk02Icon}
          className="mt-0.75 size-6 text-primary"
        />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <p className="ps-7 text-muted-foreground">{description}</p>
    </div>
  )
}

function AnimatedFig() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 7) // ۷ مرحله برای زمان‌بندی دقیق‌تر
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative flex h-full min-h-75 items-center justify-end">
      {/* Background Terminal Mock */}
      <div
        className={cn(
          "absolute inset-y-8 inset-s-8 inset-e-0 flex flex-col overflow-hidden rounded-xl border border-border bg-muted/20 font-mono text-xs transition-all duration-500",
          step > 0
            ? "scale-80 opacity-40 blur-[2px]"
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
            https://104.21.44.12
          </p>
          <p className="mt-1">* Trying 104.21.44.12:443...</p>
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
            className="relative z-10 w-full max-w-sm rounded-4xl bg-card shadow-2xl"
          >
            {/* Animated Border Wrapper */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
              <div
                className="absolute -inset-full animate-[spin_3s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 80%,oklch(0.841 0.238 128.85) 100%)",
                }}
              />
            </div>

            {/* Inner Content wrapper to hide border behind it */}
            <div className="relative z-10 m-px h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-2xl bg-card">
              <div className="flex items-center justify-center rounded-t-2xl border-b border-border bg-muted/30 px-4 py-2">
                <span className="font-heading text-xs font-bold tracking-widest text-muted-foreground/60 uppercase">
                  Checkpoint
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <span className="font-mono text-xl font-bold text-muted-foreground">
                      <HugeiconsIcon icon={CommandLineIcon} />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">curl (51234)</p>
                    <p className="w-fit rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      104.21.44.12:443
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative h-9">
                    <div className="absolute inset-0 flex items-center justify-between rounded-full border border-border/40 bg-input/30 px-4 text-sm">
                      <span className="text-muted-foreground">Policy:</span>
                      <div className="flex items-center gap-2">
                        <motion.span
                          key={step >= 3 ? "proxy" : "direct"}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn("font-medium", "text-foreground")}
                        >
                          {step >= 3 ? "🇸🇪 Proxy (EU-North)" : "Direct"}
                        </motion.span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground opacity-50"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
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
                          <div className="cursor-default rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                            Direct
                          </div>
                          <div className="flex cursor-default items-center justify-between rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                            🇸🇪 Proxy (EU-North)
                          </div>
                          <div className="cursor-default rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                            🇺🇸 Proxy (US-East)
                          </div>
                          <div className="cursor-default rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                            Block
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground! transition-colors hover:bg-muted">
                    Reject
                  </button>
                  <button className="flex-1 rounded-full border border-transparent bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground! transition-colors hover:bg-secondary/80">
                    Direct
                  </button>
                  <button
                    className={cn(
                      "relative flex-1 overflow-hidden rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground! transition-colors"
                    )}
                  >
                    <span className="relative z-10">Allow</span>
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
