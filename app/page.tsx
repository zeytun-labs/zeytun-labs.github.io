import type { Metadata, Viewport } from "next"

import "./landing.css"
import { Architecture } from "@/components/landing/architecture"
import { Dns } from "@/components/landing/dns"
import { Firewall } from "@/components/landing/firewall"
import { Hero } from "@/components/landing/hero"
import { Reveal } from "@/components/landing/reveal"
import { Routing } from "@/components/landing/routing"
import { Roadmap } from "@/components/landing/roadmap"
import { SiteFooter } from "@/components/landing/site-footer"
import { StatStrip } from "@/components/landing/stat-strip"
import { Visibility } from "@/components/landing/visibility"
import { Waitlist } from "@/components/landing/waitlist"
import { Nav } from "@/components/landing/nav"

const description =
  "Zeytun is a desktop network manager. Watch every connection live, route traffic per process, take full control of DNS, and decide what leaves your machine."

export const metadata: Metadata = {
  title: "Zeytun — Desktop Network Manager",
  description,
  openGraph: {
    title: "Zeytun — Desktop Network Manager",
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
      <main>
        <Hero />
        {/* <StatStrip /> */}
        <Visibility />
        <Routing />
        <Dns />
        <Firewall />
        <Architecture />
        <Roadmap />
        <Waitlist />
      </main>
      <SiteFooter />
      <Reveal />
    </div>
  )
}
