import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllReleases, getReleaseBySlug } from "@/data/changelog"
import { getGithubStats } from "@/lib/github-stats"
import { ChangelogNav } from "@/components/changelog/changelog-nav"
import { ChangelogCard } from "@/components/changelog/changelog-card"
import { SiteFooter } from "@/components/landing/site-footer"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons"

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070807",
}

function parseSlug(
  slug: string[]
): { version: string; platform?: string } | null {
  if (slug.length === 1) {
    return { version: slug[0] }
  }
  if (slug.length === 2) {
    const [platform, version] = slug
    if (["mac", "windows", "linux"].includes(platform.toLowerCase())) {
      return { version, platform: platform.toLowerCase() }
    }
  }
  return null
}

export async function generateStaticParams() {
  const releases = getAllReleases()
  const params: { slug: string[] }[] = []

  for (const r of releases) {
    params.push({ slug: [r.slug] })
    if (r.version !== r.slug) {
      params.push({ slug: [r.version] })
    }
    for (const p of r.platforms) {
      params.push({ slug: [p, r.slug] })
      if (r.version !== r.slug) {
        params.push({ slug: [p, r.version] })
      }
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return { title: "Release Not Found | Zeytun" }

  const release = getReleaseBySlug(parsed.version)
  if (!release) return { title: "Release Not Found | Zeytun" }

  const platformPrefix = parsed.platform
    ? ` for ${parsed.platform === "mac" ? "macOS" : parsed.platform === "windows" ? "Windows" : "Linux"}`
    : ""

  return {
    title: `${release.version}${platformPrefix} - ${release.headline} | Zeytun Changelog`,
    description: release.summary,
    openGraph: {
      title: `${release.version}${platformPrefix} - ${release.headline} | Zeytun Changelog`,
      description: release.summary,
      type: "article",
    },
  }
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) notFound()

  const release = getReleaseBySlug(parsed.version)
  if (!release) notFound()

  const allReleases = getAllReleases()
  const currentIndex = allReleases.findIndex((r) => r.slug === release.slug)
  const prevRelease =
    currentIndex < allReleases.length - 1 ? allReleases[currentIndex + 1] : null
  const nextRelease = currentIndex > 0 ? allReleases[currentIndex - 1] : null

  const stats = getGithubStats()
  const prefix = parsed.platform
    ? `/changelog/${parsed.platform}`
    : "/changelog"

  return (
    <div className="relative min-h-screen overflow-x-clip px-6">
      <ChangelogNav
        starsCount={stats.stars.value}
        currentVersion={release.version}
      />

      <div className="mx-auto max-w-3xl pt-10 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/changelog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
            <span>All Changelogs</span>
          </Link>

          {release.githubReleaseUrl && (
            <a
              href={release.githubReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={GithubIcon} className="size-3.5" />
              <span>GitHub Release</span>
            </a>
          )}
        </div>

        <ChangelogCard release={release} isSingleView={true} />

        {/* Pagination: Older / Newer release */}
        <nav
          aria-label="Release pagination"
          className="mt-16 flex items-center justify-between border-t border-border/30 pt-8"
        >
          {prevRelease ? (
            <Link
              href={`${prefix}/${prevRelease.slug}`}
              className="group flex flex-col items-start gap-1 text-left transition-colors"
            >
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
                <span>Older</span>
              </span>
              <span className="font-heading text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {prevRelease.headline}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextRelease ? (
            <Link
              href={`${prefix}/${nextRelease.slug}`}
              className="group flex flex-col items-end gap-1 text-right transition-colors"
            >
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <span>Newer</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </span>
              <span className="font-heading text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {nextRelease.headline}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>

      <SiteFooter />
    </div>
  )
}
