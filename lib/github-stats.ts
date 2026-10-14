import rawStats from "@/data/github-stats.json"

export type GithubStats = {
  schemaVersion: 1
  repo: "zeytun-labs/zeytun-app"
  latestRelease?: {
    url: string
    version: string
    assetName: string
    publishedAt: string
  } | null
  stars: {
    value: number | null
    updatedAt: string | null
  }
  downloads: {
    value: number | null
    assetCount: number | null
    updatedAt: string | null
    kind: "macos-dmg-assets"
  }
  history: {
    kind: "weekly-new-stars"
    points: { week: number; stars: number }[]
    updatedAt: string | null
  }
}

export function getGithubStats(): GithubStats {
  try {
    const stats = rawStats as unknown as GithubStats
    if (
      stats &&
      stats.schemaVersion === 1 &&
      stats.repo === "zeytun-labs/zeytun-app"
    ) {
      return stats
    }
  } catch {
    // fallback if malformed
  }

  return {
    schemaVersion: 1,
    repo: "zeytun-labs/zeytun-app",
    latestRelease: null,
    stars: { value: null, updatedAt: null },
    downloads: {
      value: null,
      assetCount: null,
      updatedAt: null,
      kind: "macos-dmg-assets",
    },
    history: { kind: "weekly-new-stars", points: [], updatedAt: null },
  }
}

export function formatCount(n: number | null): string {
  if (n === null || typeof n !== "number" || isNaN(n)) return "—"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString("en-US")
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "—"
    return d.toISOString().split("T")[0]
  } catch {
    return "—"
  }
}
