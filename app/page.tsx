import type { Metadata, Viewport } from "next"

import "./landing.css"
import { Hero } from "@/components/landing/hero"
import { Nav } from "@/components/landing/nav"
import { WhyZeytun } from "@/components/landing/why-zeytun"
import { ArchitectureRest } from "@/components/landing/architecture-rest"
import { RoadmapNew } from "@/components/landing/roadmap-new"
import { WaitlistNew } from "@/components/landing/waitlist-new"
import { SiteFooterNew } from "@/components/landing/site-footer-new"
import { TrafficMonitor } from "@/components/landing/traffic-monitor"
import { Process } from "@/components/landing/process"

const description =
  "Zeytun is a desktop network manager. Every connection your machine opens, attributed to the app that opened it - and yours to route, hold or refuse."

export const metadata: Metadata = {
  title: "Zeytun - Desktop Network Manager",
  description,
  openGraph: {
    title: "Zeytun - Desktop Network Manager",
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
    <div className="landing relative min-h-screen overflow-x-clip">
      <Nav />
      <main className="space-y-42">
        <Hero />
        <WhyZeytun />
        <TrafficMonitor />
        <Process />
        <ArchitectureRest />
        <RoadmapNew />
        <WaitlistNew />
      </main>
      <SiteFooterNew />
    </div>
  )
}
