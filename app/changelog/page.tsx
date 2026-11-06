import type { Metadata, Viewport } from "next"
import { getAllReleases, getTimelineGroups } from "@/data/changelog"
import { getGithubStats } from "@/lib/github-stats"
import { ChangelogNav } from "@/components/changelog/changelog-nav"
import { ChangelogHero } from "@/components/changelog/changelog-hero"
import { ChangelogFeed } from "@/components/changelog/changelog-feed"
import { SiteFooter } from "@/components/landing/site-footer"

const description =
  "Track weekly features, protocol updates, native tray enhancements, and performance releases."

export const metadata: Metadata = {
  title: "Changelog | Zeytun",
  description,
  openGraph: {
    title: "Changelog | Zeytun",
    description,
    type: "website",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070807",
}

export default function ChangelogPage() {
  const releases = getAllReleases()
  const timelineYears = getTimelineGroups()
  const stats = getGithubStats()

  return (
    <div className="relative min-h-screen overflow-x-clip px-6">
      <ChangelogNav starsCount={stats.stars.value} />

      <div className="mx-auto max-w-5xl">
        <ChangelogHero />

        <div className="mt-8 mb-24">
          <ChangelogFeed releases={releases} timelineYears={timelineYears} />
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
