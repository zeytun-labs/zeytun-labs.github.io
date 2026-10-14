import type { Metadata, Viewport } from "next"

import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { Workspace } from "@/components/landing/workspace"
import { CommunityStats } from "@/components/landing/community-stats"
import { Faq } from "@/components/landing/faq"
import { Download } from "@/components/landing/download"
import { SiteFooter } from "@/components/landing/site-footer"
import { SectionReveals } from "@/components/landing/section-reveals"
import { getGithubStats } from "@/lib/github-stats"

const description =
  "A free, open-source network manager for macOS. Inspect app connections, choose their routes, and control traffic with rules."

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
  const stats = getGithubStats()

  return (
    <div className="relative min-h-screen overflow-x-clip px-6">
      <SectionReveals />
      <Nav starsCount={stats.stars.value} />
      {/* Hero → Product Showcase → Workspace → Community → FAQ → Download */}
      <main id="main-content" className="space-y-20 md:space-y-24">
        <Hero />
        <ProductShowcase />
        <Workspace />
        <CommunityStats stats={stats} />
        <Faq />
        <Download />
      </main>
      <SiteFooter />
    </div>
  )
}
