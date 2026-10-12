import type { Metadata, Viewport } from "next"

import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { FeatureHighlights } from "@/components/landing/feature-highlights"
import { CommunityStats } from "@/components/landing/community-stats"
import { Faq } from "@/components/landing/faq"
import { Download } from "@/components/landing/download"
import { SiteFooter } from "@/components/landing/site-footer"
import { getGithubStats } from "@/lib/github-stats"

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
  const stats = getGithubStats()

  return (
    <div className="relative min-h-screen overflow-x-clip px-6">
      <Nav starsCount={stats.stars.value} />
      {/* 6 core sections: Hero → Product Showcase → Features → Community → FAQ → Download */}
      <main id="main-content" className="space-y-20 md:space-y-24">
        <Hero />
        <ProductShowcase />
        <FeatureHighlights />
        <CommunityStats stats={stats} />
        <Faq />
        <Download />
      </main>
      <SiteFooter />
    </div>
  )
}
