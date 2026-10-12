"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  Home,
  Activity,
  Route,
  Layers3,
  ListFilter,
  Globe,
  Wrench,
  Radio,
} from "lucide-react"
import { WorkspaceDemo, type WorkspaceView } from "./workspace-demo"
import { Section, Title, Heading } from "../common/section"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    id: "home",
    label: "Home",
    title: "Your network at a glance.",
    description:
      "See active connections, bandwidth, network latency, and where your traffic goes.",
    try: "Switch the traffic range or inspect the breakdown.",
    icon: Home,
  },
  {
    id: "process",
    label: "Process",
    title: "Know which app is talking.",
    description:
      "Inspect per-app traffic and connection details, then turn a routing choice into a rule.",
    try: "Select an app, or open its actions menu.",
    icon: Activity,
  },
  {
    id: "policies",
    label: "Policy",
    title: "Choose how traffic leaves.",
    description:
      "Select a proxy, reuse a policy, or build a chain from your own servers.",
    try: "Choose a proxy or create a chain from the + menu.",
    icon: Route,
  },
  {
    id: "routing",
    label: "Rule",
    title: "Make your choices repeatable.",
    description:
      "Match apps and hosts, add temporary exceptions, and keep rules in priority order.",
    try: "Add a rule, reorder it, or make a temporary rule permanent.",
    icon: ListFilter,
  },
  {
    id: "profiles",
    label: "Subscriptions",
    title: "Keep your setups together.",
    description:
      "Manage subscriptions within a profile and keep separate configurations for different needs.",
    try: "Sync a subscription or switch profiles from the bottom-left menu.",
    icon: Layers3,
  },
  {
    id: "dns",
    label: "DNS",
    title: "Choose your DNS resolver.",
    description:
      "Keep DNS servers, resolver rules, and local host mappings in one place.",
    try: "Explore the DNS tabs and change the FINAL resolver.",
    icon: Globe,
  },
  {
    id: "tools",
    label: "Tools",
    title: "Test your connection.",
    description:
      "Compare network quality and inspect NAT behavior with the app’s built-in tools.",
    try: "Run a sample network quality or STUN test.",
    icon: Wrench,
  },
  {
    id: "traffic",
    label: "Traffic Monitor",
    title: "Follow individual connections.",
    description:
      "Filter traffic by app or host and inspect the route, protocol, and details of each connection.",
    try: "Select a connection, then create a rule from its details.",
    icon: Radio,
  },
] as const satisfies readonly {
  id: WorkspaceView
  label: string
  title: string
  description: string
  try: string
  icon: typeof Home
}[]

export function Workspace() {
  const [activeId, setActiveId] = useState<WorkspaceView>("home")
  const reducedMotion = useReducedMotion()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const tabViewport = useRef<HTMLDivElement>(null)
  const index = FEATURES.findIndex((feature) => feature.id === activeId)
  const active = FEATURES[index]
  useLayoutEffect(() => {
    const viewport = tabViewport.current
    const button = tabs.current[index]
    if (!viewport || !button) return
    const frame = viewport.getBoundingClientRect()
    const bounds = button.getBoundingClientRect()
    // Follow the app sidebar without moving the document vertically.
    if (bounds.left < frame.left)
      viewport.scrollLeft += bounds.left - frame.left
    else if (bounds.right > frame.right)
      viewport.scrollLeft += bounds.right - frame.right
  }, [index])
  return (
    <Section id="features" aria-labelledby="workspace-heading">
      <div className="mx-auto mb-9 max-w-2xl text-center">
        <Title>Workspace</Title>
        <Heading id="workspace-heading">Your setup. One workspace.</Heading>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Explore the app, from the big picture to a single connection.
        </p>
      </div>
      <div className="mx-auto max-w-[960px]">
        <div
          ref={tabViewport}
          className="mb-5 [scrollbar-width:none] overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="tablist"
            aria-label="Explore workspace features"
            className="mx-auto flex w-max min-w-full items-center justify-center gap-1 rounded-full border border-border/50 bg-card/40 p-1 sm:min-w-0"
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return
              event.preventDefault()
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? FEATURES.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        FEATURES.length) %
                      FEATURES.length
              setActiveId(FEATURES[next].id)
              tabs.current[next]?.focus()
              tabs.current[next]?.scrollIntoView({
                block: "nearest",
                inline: "nearest",
                behavior: "instant",
              })
            }}
          >
            {FEATURES.map((feature, i) => {
              const selected = feature.id === activeId
              const Icon = feature.icon
              return (
                <button
                  key={feature.id}
                  ref={(element) => {
                    tabs.current[i] = element
                  }}
                  type="button"
                  role="tab"
                  id={`workspace-tab-${feature.id}`}
                  aria-selected={selected}
                  aria-controls="workspace-demo-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(feature.id)}
                  className={cn(
                    "relative isolate flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    selected
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="workspace-tab-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary/15 ring-1 ring-primary/20"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 35 }
                      }
                    />
                  )}
                  <Icon className="size-4" aria-hidden="true" />
                  {feature.label}
                </button>
              )
            })}
          </div>
        </div>
        <div
          role="tabpanel"
          id="workspace-demo-panel"
          aria-labelledby={`workspace-tab-${activeId}`}
        >
          <div className="mb-5 grid gap-3 px-1 sm:grid-cols-[minmax(0,1fr)_minmax(200px,.6fr)] sm:items-start sm:gap-10">
            <div className="relative min-h-[104px] sm:min-h-[112px] lg:min-h-[82px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                >
                  <h3 className="font-heading text-lg tracking-tight text-foreground sm:text-xl">
                    {active.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex min-h-[70px] items-start gap-3 text-sm leading-relaxed text-muted-foreground/75 sm:pt-1 lg:min-h-16">
              <ArrowRight
                className="mt-1 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p>{active.try}</p>
              <span className="ml-auto shrink-0 pt-0.5 font-mono text-[10px] text-muted-foreground/50">
                {String(index + 1).padStart(2, "0")} / 08
              </span>
            </div>
          </div>
          <WorkspaceDemo view={activeId} onViewChange={setActiveId} />
        </div>
      </div>
    </Section>
  )
}
