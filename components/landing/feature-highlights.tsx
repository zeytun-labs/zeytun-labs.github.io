import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { SeeCard, DecideCard, RouteCard } from "./why-zeytun"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Bookmark02Icon,
  RssIcon,
  WifiConnected02Icon,
  DashboardSpeed02Icon,
  ChartHistogramIcon,
  TerminalIcon,
} from "@hugeicons/core-free-icons"

const CAPABILITIES = [
  { label: "Profiles", icon: Bookmark02Icon },
  { label: "Subscriptions", icon: RssIcon },
  { label: "DNS controls", icon: WifiConnected02Icon },
  { label: "Proxy chains", icon: DashboardSpeed02Icon },
  { label: "Traffic history", icon: ChartHistogramIcon },
  { label: "Network tools", icon: TerminalIcon },
]

export function FeatureHighlights() {
  return (
    <Section id="features">
      <SectionHead
        eyebrow="Capabilities"
        title="A clearer view. More control."
        lede="Everything you need to see and direct your machine's network traffic."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SeeCard
          title="App-aware visibility"
          description="See available app details and bandwidth for the connections Zeytun handles."
        />
        <DecideCard
          title="Decisions you can reuse"
          description="Remember a routing choice as a rule, so you can review and change it later."
        />
        <RouteCard
          title="One routing workspace"
          description="Keep routes, proxy policies and DNS settings together."
        />
      </div>

      <div className="mt-8 flex items-center justify-center rounded-3xl border border-border/40 bg-card/30 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.label}
              className="flex items-center gap-2 rounded-full border border-border/40 bg-card/60 px-4 py-2 font-mono text-xs text-muted-foreground"
            >
              <HugeiconsIcon
                icon={cap.icon}
                className="size-3.5 text-primary"
              />
              <span>{cap.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
