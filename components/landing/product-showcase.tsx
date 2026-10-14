"use client"

import { useId, useState, useRef } from "react"
import {
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { Section } from "../common/section"
import { Title } from "../common/section"
import { Rise } from "./chrome"
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
      "See app details and live bandwidth for the connections Zeytun handles.",
  },
  {
    key: "decide",
    label: "Decide",
    title: "Decide before it continues.",
    description:
      "In Rule-based mode, Connection Ask pauses unmatched TCP connections. Allow, reroute, or block them.",
  },
  {
    key: "route",
    label: "Route",
    title: "Give it the right path.",
    description: "Connect directly, route through a proxy, or block traffic.",
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
        delay: reducedMotion ? 0 : 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hidden: {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: reducedMotion ? 0 : 0.12 },
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

  return (
    <Section id="model">
      <div className="grid gap-8 lg:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-col items-start">
          <Rise>
            <Title className="mb-6">How it works</Title>
          </Rise>

          <LayoutGroup id={layoutId}>
            <div
              data-reveal
              role="tablist"
              aria-label="Product showcase stages"
              className="mb-7 flex rounded-full border border-border/40 bg-card/60 p-1.5 shadow-sm backdrop-blur-sm [--reveal-delay:60ms]"
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

          {/* Reserve the tallest complete copy; each description still
              follows its own title without an empty line in between. */}
          <div
            data-reveal
            className="grid w-full max-w-md [--reveal-delay:120ms]"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.key
              return (
                <div
                  key={tab.key}
                  aria-hidden={!selected}
                  inert={!selected}
                  className="relative col-start-1 row-start-1 flex flex-col gap-3"
                  style={{
                    zIndex: selected ? 1 : 0,
                    pointerEvents: selected ? "auto" : "none",
                  }}
                >
                  <motion.h2
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0,
                      y: selected || reducedMotion ? 0 : 4,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.18,
                      delay: selected && !reducedMotion ? 0.1 : 0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-heading text-3xl tracking-tight text-foreground md:text-4xl"
                  >
                    {tab.title}
                  </motion.h2>
                  <motion.p
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0,
                      y: selected || reducedMotion ? 0 : 6,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.22,
                      delay: selected && !reducedMotion ? 0.16 : 0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-sm leading-relaxed text-muted-foreground md:text-base"
                  >
                    {tab.description}
                  </motion.p>
                </div>
              )
            })}
          </div>
        </div>

        <div
          data-reveal
          className="relative isolate flex h-[540px] items-center justify-center overflow-hidden rounded-3xl border border-border/40 bg-card/20 px-4 py-4 [--reveal-delay:100ms] sm:px-8 md:h-[460px] md:py-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_8%,transparent_82%)] bg-size-[48px_48px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]"
          />

          <div className="relative z-10 h-full w-full">
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
                  className="absolute inset-0 min-w-0 items-center justify-center"
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
