import rawGithubReleases from "@/data/github-releases.json"

export type PlatformType = "all" | "mac" | "windows" | "linux"

export type ChangelogItem = {
  title: string
  description: string
  tag?: string
  shippedBy?: string
}

export type ChangelogRelease = {
  version: string
  slug: string
  date: string
  displayDate: string
  year: number
  month: number
  monthName: string
  headline: string
  summary: string
  platforms: ("mac" | "windows" | "linux")[]
  isLatest?: boolean
  items: ChangelogItem[]
  downloadUrl?: string
  assetName?: string
  githubReleaseUrl?: string
  githubTagUrl?: string
}

export type RawGithubRelease = {
  id: number
  tag_name: string
  name: string
  published_at: string
  html_url: string
  body: string
  prerelease?: boolean
  commits?: {
    sha: string
    message: string
    author: string
    html_url: string
  }[]
  assets: {
    name: string
    browser_download_url: string
    size: number
    download_count?: number
  }[]
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function parseReleaseMarkdown(markdown: string): {
  headline?: string
  summary?: string
  items: ChangelogItem[]
} {
  const lines = markdown.split("\n").map((l) => l.trim())
  let headline = ""
  let summary = ""
  const items: ChangelogItem[] = []
  let currentItem: ChangelogItem | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    if (line.startsWith("# ") || line.startsWith("## ")) {
      if (!headline) headline = line.replace(/^#+\s*/, "")
      continue
    }

    if (line.startsWith("* ") || line.startsWith("- ")) {
      if (currentItem) items.push(currentItem)
      const raw = line.slice(2).trim()
      const boldMatch = raw.match(/^\*\*([^\*]+)\*\*[:\s-]*(.*)/)
      if (boldMatch) {
        currentItem = {
          title: boldMatch[1].trim(),
          description: boldMatch[2].trim(),
          shippedBy: undefined,
        }
      } else {
        currentItem = {
          title: raw,
          description: "",
          shippedBy: undefined,
        }
      }
      continue
    }

    if (currentItem) {
      if (line.toLowerCase().startsWith("shipped by")) {
        currentItem.shippedBy = line.replace(/^shipped by\s*/i, "").trim()
      } else {
        currentItem.description = currentItem.description
          ? `${currentItem.description} ${line}`
          : line
      }
    } else if (!summary && !line.startsWith("#")) {
      summary = line
    }
  }

  if (currentItem) items.push(currentItem)

  // Inferred category tags based on title/content
  for (const item of items) {
    if (!item.tag) {
      const lower = item.title.toLowerCase()
      if (lower.includes("tray") || lower.includes("traffic"))
        item.tag = "NATIVE UI"
      else if (
        lower.includes("subscription") ||
        lower.includes("policy") ||
        lower.includes("proxy")
      )
        item.tag = "ROUTING"
      else if (
        lower.includes("persistence") ||
        lower.includes("outbound") ||
        lower.includes("core")
      )
        item.tag = "ENGINE"
      else if (lower.includes("windows")) item.tag = "WINDOWS"
      else if (lower.includes("mac") || lower.includes("macos"))
        item.tag = "MACOS"
      else if (
        lower.includes("profile") ||
        lower.includes("polish") ||
        lower.includes("layout")
      )
        item.tag = "POLISH"
      else item.tag = "FEATURE"
    }
  }

  return {
    headline: headline || undefined,
    summary: summary || undefined,
    items,
  }
}

function parseGithubRelease(gh: RawGithubRelease): ChangelogRelease {
  const tag = gh.tag_name
  const pubDate = new Date(gh.published_at || Date.now())
  const year = pubDate.getUTCFullYear()
  const month = pubDate.getUTCMonth() + 1
  const monthName = MONTH_NAMES[pubDate.getUTCMonth()] || "November"
  const dateStr = pubDate.toISOString().split("T")[0]
  const displayDate = `${monthName} ${pubDate.getUTCDate()}, ${year}`

  const {
    headline: parsedHeadline,
    summary: parsedSummary,
    items,
  } = parseReleaseMarkdown(gh.body || "")

  // Detect platforms from assets
  const platforms = new Set<"mac" | "windows" | "linux">()
  for (const asset of gh.assets || []) {
    const name = asset.name.toLowerCase()
    if (
      name.endsWith(".dmg") ||
      name.endsWith(".app.tar.gz") ||
      name.includes("macos")
    ) {
      platforms.add("mac")
    }
    if (
      name.endsWith(".exe") ||
      name.endsWith(".msi") ||
      name.includes("windows")
    ) {
      platforms.add("windows")
    }
    if (
      name.endsWith(".deb") ||
      name.endsWith(".rpm") ||
      name.endsWith(".appimage") ||
      name.includes("linux")
    ) {
      platforms.add("linux")
    }
  }

  // Look for installer asset (DMG for mac, EXE for windows)
  const installerAsset =
    gh.assets.find((a) => a.name.toLowerCase().endsWith(".dmg")) ||
    gh.assets.find((a) => a.name.toLowerCase().endsWith(".exe")) ||
    gh.assets[0]

  const headline = parsedHeadline || gh.name || `Release ${tag}`
  const summary =
    parsedSummary ||
    `Official ${gh.prerelease ? "pre-release" : "release"} published on GitHub with ${gh.assets.length} binary assets.`

  return {
    version: tag,
    slug: tag.replace(/^v/, "").replace(/\./g, "-"),
    date: dateStr,
    displayDate,
    year,
    month,
    monthName,
    headline,
    summary,
    platforms: platforms.size > 0 ? Array.from(platforms) : ["mac"],
    items,
    downloadUrl: installerAsset?.browser_download_url,
    assetName: installerAsset?.name,
    githubReleaseUrl: gh.html_url,
    githubTagUrl: gh.html_url,
  }
}

function buildReleases(): ChangelogRelease[] {
  const rawList = (rawGithubReleases as RawGithubRelease[]) || []
  const releases = rawList.map(parseGithubRelease)

  // Sort descending by date
  releases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (releases.length > 0) {
    releases[0].isLatest = true
  }

  return releases
}

export const CHANGELOG_RELEASES: ChangelogRelease[] = buildReleases()

export function getAllReleases(): ChangelogRelease[] {
  return CHANGELOG_RELEASES
}

export function getReleaseBySlug(slug: string): ChangelogRelease | undefined {
  const normalized = slug.toLowerCase().replace(/^v/, "")
  return CHANGELOG_RELEASES.find(
    (r) =>
      r.slug === normalized ||
      r.version.toLowerCase().replace(/^v/, "") === normalized ||
      r.version.toLowerCase() === slug.toLowerCase()
  )
}

export type TimelineMonth = {
  id: string
  year: number
  month: number
  monthName: string
  releasesCount: number
}

export type TimelineYear = {
  year: number
  months: TimelineMonth[]
}

export function getTimelineGroups(): TimelineYear[] {
  const groups = new Map<number, Map<number, TimelineMonth>>()

  for (const rel of CHANGELOG_RELEASES) {
    if (!groups.has(rel.year)) {
      groups.set(rel.year, new Map())
    }
    const yearMap = groups.get(rel.year)!
    if (!yearMap.has(rel.month)) {
      const monthStr = rel.month.toString().padStart(2, "0")
      yearMap.set(rel.month, {
        id: `m-${monthStr}-${rel.year}`,
        year: rel.year,
        month: rel.month,
        monthName: rel.monthName,
        releasesCount: 1,
      })
    } else {
      yearMap.get(rel.month)!.releasesCount += 1
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, monthsMap]) => ({
      year,
      months: Array.from(monthsMap.values()).sort((a, b) => b.month - a.month),
    }))
}
