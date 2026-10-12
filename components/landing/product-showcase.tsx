"use client"

import { useId, useState, useRef } from "react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { ProcessFig } from "./process"
import { AnimatedFig } from "./checkpoint"
import { RuleTableFig } from "./rules"
import { cn } from "@/lib/utils"

type TabKey = "see" | "decide" | "route"

const TABS: {
  key: TabKey
  label: string
  title: string
  description: string
}[] = [
  {
    key: "see",
    label: "See",
    title: "Know which app is talking.",
    description:
      "Review available app details and live bandwidth for traffic handled by Zeytun.",
  },
  {
    key: "decide",
    label: "Decide",
    title: "Decide before it continues.",
    description:
      "Connection Ask pauses unmatched TCP connections in Rule-based mode while you choose.",
  },
  {
    key: "route",
    label: "Route",
    title: "Give it the right path.",
    description:
      "Send matching traffic directly, through a proxy policy, or to rejection.",
  },
]

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("see")
  const [exitingTabs, setExitingTabs] = useState<TabKey[]>([])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const layoutId = useId()
  const reducedMotion = useReducedMotion()

  // Keep every demo mounted: animate out before hiding it, so its local
  // timeline survives tab changes without displaying multiple panels.
  const panelVariants: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.32,
        delay: reducedMotion ? 0 : 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hidden: {
      opacity: 0,
      x: reducedMotion ? 0 : -16,
      y: reducedMotion ? 0 : 6,
      scale: reducedMotion ? 1 : 0.985,
      transition: { duration: reducedMotion ? 0 : 0.18 },
    },
  }

  const selectTab = (key: TabKey) => {
    if (key === activeTab) return
    setExitingTabs((current) => [...new Set([...current, activeTab])])
    setActiveTab(key)
  }

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1
    if (e.key === "ArrowRight") {
      targetIndex = (index + 1) % TABS.length
    } else if (e.key === "ArrowLeft") {
      targetIndex = (index - 1 + TABS.length) % TABS.length
    } else if (e.key === "Home") {
      targetIndex = 0
    } else if (e.key === "End") {
      targetIndex = TABS.length - 1
    }

    if (targetIndex !== -1) {
      e.preventDefault()
      tabRefs.current[targetIndex]?.focus()
      selectTab(TABS[targetIndex].key)
    }
  }

  const activeMeta = TABS.find((t) => t.key === activeTab) ?? TABS[0]

  return (
    <Section id="model">
      <SectionHead
        eyebrow="Product Showcase"
        title="Your connections. Your decisions."
        lede="See what connects, decide what happens, and choose the route."
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* Accessible tablist */}
        <LayoutGroup id={layoutId}>
          <div
            role="tablist"
            aria-label="Product showcase stages"
            className="mb-8 flex rounded-full border border-border/40 bg-card/60 p-1.5 shadow-sm backdrop-blur-sm"
          >
            {TABS.map((tab, idx) => {
              const isSelected = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  ref={(el) => {
                    tabRefs.current[idx] = el
                  }}
                  role="tab"
                  id={`tab-${tab.key}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.key}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectTab(tab.key)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  className={cn(
                    "relative isolate cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="active-tab-blob"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/15 shadow-xs"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 480, damping: 36 }
                      }
                    />
                  )}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        {/* Unified showcase container */}
        <div className="w-full rounded-3xl border border-border/40 bg-card/40 p-6 md:p-8">
          {/* Active text summary */}
          <div className="mb-6 min-h-[132px] border-b border-border/40 pb-5 sm:min-h-[96px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeMeta.key}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-1"
              >
                <h3 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl">
                  {activeMeta.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {activeMeta.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid min-h-[440px] items-center md:min-h-[420px]">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.key
              return (
                <motion.div
                  key={tab.key}
                  role="tabpanel"
                  id={`panel-${tab.key}`}
                  aria-labelledby={`tab-${tab.key}`}
                  aria-hidden={!isSelected}
                  inert={!isSelected}
                  initial={false}
                  animate={isSelected ? "visible" : "hidden"}
                  variants={panelVariants}
                  onAnimationComplete={(definition) => {
                    if (definition !== "hidden") return
                    setExitingTabs((current) =>
                      current.includes(tab.key)
                        ? current.filter((key) => key !== tab.key)
                        : current
                    )
                  }}
                  style={{
                    display:
                      isSelected || exitingTabs.includes(tab.key)
                        ? "flex"
                        : "none",
                    pointerEvents: isSelected ? "auto" : "none",
                  }}
                  className="col-start-1 row-start-1 w-full min-w-0 items-center justify-center"
                >
                  {tab.key === "see" && <ProcessFig active={isSelected} />}
                  {tab.key === "decide" && <AnimatedFig active={isSelected} />}
                  {tab.key === "route" && (
                    <div className="w-full">
                      <RuleTableFig active={isSelected} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
