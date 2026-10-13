"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"
import { WorkspaceDemo, type WorkspaceView } from "./workspace-demo"
import { Section, Title, Heading } from "../common/section"
import { cn } from "@/lib/utils"
import { useWorkspaceStory } from "@/hooks/use-workspace-story"

const STORY = [
  {
    id: "overview",
    view: "home",
    label: "Home",
    short: "Home",
    title: "See the big picture.",
    description: "See network activity, connection health, and traffic routes.",
    detail: "Your network, in one view.",
    guided: "overview",
  },
  {
    id: "process",
    view: "process",
    label: "Process",
    short: "Process",
    title: "Follow Safari’s traffic.",
    description:
      "Inspect Safari’s bandwidth and destinations, then choose a route.",
    detail: "Safari · connections and bandwidth",
    guided: "process",
  },
  {
    id: "policies",
    view: "policies",
    label: "Policy",
    short: "Policy",
    title: "Choose how traffic leaves.",
    description:
      "Keep your proxies, reusable policies, and proxy chains together.",
    detail: "Proxies · policies · chains",
    guided: undefined,
  },
  {
    id: "rule",
    view: "routing",
    label: "Rule",
    short: "Rule",
    title: "Keep that choice.",
    description: "Send Safari directly with a rule you can review and change.",
    detail: "Safari → Direct · reusable rule",
    guided: "rule",
  },
  {
    id: "dns",
    view: "dns",
    label: "DNS",
    short: "DNS",
    title: "Choose your DNS resolver.",
    description: "Manage DNS servers, resolver rules, and local host mappings.",
    detail: "DNS servers · rules · local hosts",
    guided: undefined,
  },
  {
    id: "traffic",
    view: "traffic",
    label: "Traffic Monitor",
    short: "Monitor",
    title: "Follow each connection.",
    description:
      "Filter by app or host and inspect the route of each connection.",
    detail: "Clients · hosts · connection details",
    guided: undefined,
  },
] as const

const EXTRAS = {
  profiles: {
    id: "profiles",
    label: "Subscriptions",
    title: "Keep your setups together.",
    description:
      "Manage subscriptions and keep separate configurations in profiles.",
    detail: "Subscriptions · profiles",
  },
  tools: {
    id: "tools",
    label: "Tools",
    title: "Test your connection.",
    description:
      "Check network quality and NAT behavior with the built-in tools.",
    detail: "Network quality · STUN",
  },
} as const

export function Workspace() {
  const reducedMotion = !!useReducedMotion()
  const {
    root: storyRootRef,
    card: storyCardRef,
    step,
    complete,
    revision,
    goToStep,
  } = useWorkspaceStory(reducedMotion, STORY.length)
  const [interaction, setInteraction] = useState<{
    revision: number
    view: WorkspaceView
  } | null>(null)
  const paused = interaction?.revision === revision
  const view = paused ? interaction.view : STORY[step].view
  const activeIndex = STORY.findIndex(
    (item) => item.view === (view === "profiles" ? "policies" : view)
  )
  const scene =
    view === "profiles" || view === "tools" ? EXTRAS[view] : STORY[activeIndex]
  const number = activeIndex >= 0 ? activeIndex + 1 : step + 1
  const navigation = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const takeControl = (next: WorkspaceView = view) =>
    setInteraction({ revision, view: next })
  const selectStep = (next: number) => {
    setInteraction(null)
    goToStep(next)
  }

  useLayoutEffect(() => {
    const viewport = navigation.current,
      button = buttons.current[activeIndex]
    if (!viewport || !button) return
    const align = () => {
      const frame = viewport.getBoundingClientRect(),
        bounds = button.getBoundingClientRect()
      if (bounds.left < frame.left)
        viewport.scrollLeft += bounds.left - frame.left
      else if (bounds.right > frame.right)
        viewport.scrollLeft += bounds.right - frame.right
    }
    align()
    const observer = new ResizeObserver(align)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [activeIndex])

  return (
    <Section id="features" aria-labelledby="workspace-heading">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Title>Scroll to explore</Title>
        <Heading id="workspace-heading">Your setup. One workspace.</Heading>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          See your network, choose its routes, and follow individual
          connections.
        </p>
      </div>
      <div
        ref={storyRootRef}
        id="workspace-tour"
        data-workspace-story
        className="relative scroll-mt-20 [overflow-anchor:none] lg:scroll-mt-24"
        style={{ minHeight: "calc(192svh + 600px)" }}
      >
        <div
          ref={storyCardRef}
          data-story-card
          data-story-step={scene.id}
          data-story-paused={paused || undefined}
          className="sticky top-20 grid items-center gap-2 lg:top-24 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8"
        >
          <aside className="min-w-0">
            <div
              ref={navigation}
              className="[scrollbar-width:none] overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden"
            >
              <nav
                aria-label="Product story"
                className="flex w-max gap-2 lg:grid lg:w-full lg:grid-cols-1 lg:gap-1.5"
              >
                {STORY.map((item, i) => (
                  <button
                    key={item.id}
                    ref={(element) => {
                      buttons.current[i] = element
                    }}
                    type="button"
                    onClick={() => selectStep(i)}
                    aria-current={activeIndex === i ? "step" : undefined}
                    aria-label={`Show step ${i + 1}: ${item.label}`}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:px-3",
                      activeIndex === i
                        ? "border-primary/25 bg-primary/10 text-primary"
                        : "border-border/40 bg-card/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                        activeIndex === i ? "bg-primary/20" : "bg-muted/60"
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span className="text-xs font-medium sm:text-sm">
                      <span className="lg:hidden">{item.short}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            <div
              className="relative mt-4 min-h-[136px] max-[360px]:min-h-[176px] lg:mt-5 lg:min-h-[176px]"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={scene.id}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                >
                  <p className="mb-2 font-mono text-[10px] tracking-widest text-primary uppercase">
                    {activeIndex >= 0 ? `Step 0${number} / 06` : "Workspace"}
                  </p>
                  <h3 className="font-heading text-xl leading-tight tracking-tight sm:text-2xl">
                    {scene.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {scene.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex min-h-9 items-center text-xs text-muted-foreground">
              {complete || step === STORY.length - 1 ? (
                <a
                  href="#community"
                  className="inline-flex min-h-9 items-center gap-2 hover:text-primary"
                >
                  Continue below
                  <ArrowDown className="size-4" />
                </a>
              ) : (
                <p className="flex items-center gap-2">
                  <ArrowDown className="size-4 text-primary" />
                  {paused
                    ? "Scroll to continue the story"
                    : "Scroll for the next step"}
                </p>
              )}
            </div>
          </aside>
          <div
            className="mx-auto w-full min-w-0"
            style={{
              maxWidth:
                "min(760px, max(320px, calc((100svh - 272px) * 1.4857)))",
            }}
          >
            <div className="mb-2 flex h-10 w-full items-center justify-between gap-3 px-1 text-xs text-muted-foreground lg:mb-3">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {scene.detail}
              </span>
              {activeIndex >= 0 && (
                <span className="shrink-0 font-mono text-[10px] text-primary">
                  0{number} / 06
                </span>
              )}
            </div>
            <div
              id="workspace-demo-panel"
              role="region"
              aria-label={`${scene.label} interactive preview`}
              onPointerDownCapture={() => {
                if (!paused) takeControl()
              }}
              onFocusCapture={() => {
                if (!paused) takeControl()
              }}
            >
              <WorkspaceDemo
                view={view}
                onViewChange={takeControl}
                guided={paused ? undefined : STORY[step].guided}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
