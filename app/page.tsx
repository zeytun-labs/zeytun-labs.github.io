import type { Metadata, Viewport } from "next"

import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { WhyZeytun } from "@/components/landing/why-zeytun"
import { TrafficMonitor } from "@/components/landing/traffic-monitor"
import { Process } from "@/components/landing/process"
import { Checkpoint } from "@/components/landing/checkpoint"
import { Rules } from "@/components/landing/rules"
import { Policy } from "@/components/landing/policy"
import { Dns } from "@/components/landing/dns"
import { Architecture } from "@/components/landing/architecture"
import { EverythingElse } from "@/components/landing/everything-else"
import { Roadmap } from "@/components/landing/roadmap"
import { Download } from "@/components/landing/download"
import { SiteFooter } from "@/components/landing/site-footer"

const description =
  "Zeytun is a free, open-source network manager for macOS. Inspect the connections it handles, review app and destination details, and control routing with rules, policies and DNS settings."

export const metadata: Metadata = {
  title: "Zeytun — Open-source network manager for macOS",
  description,
  openGraph: {
    title: "Zeytun — Open-source network manager for macOS",
    description,
    type: "website",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070807",
}

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-clip px-6">
      <Nav />
      {/* v3 arc: see → decide → route → trust */}
      <main id="main-content" className="space-y-42">
        <Hero />
        <Problem />
        <WhyZeytun />
        <TrafficMonitor />
        <Process />
        <Checkpoint />
        <Rules />
        <Policy />
        <Dns />
        <Architecture />
        <EverythingElse />
        <Roadmap />
        <Download />
      </main>
      <SiteFooter />
    </div>
  )
}
