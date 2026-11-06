import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { selectMacInstaller } from "./release-assets.mjs"

const REPO = "zeytun-labs/zeytun-app"
const STATS_FILE = path.resolve(process.cwd(), "data/github-stats.json")
const RELEASES_FILE = path.resolve(process.cwd(), "data/github-releases.json")

function getToken() {
  if (process.env.GITHUB_STATS_TOKEN) return process.env.GITHUB_STATS_TOKEN
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    const token = execSync("gh auth token", {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim()
    if (token) return token
  } catch {
    // ignore
  }
  return null
}

const token = getToken()
const baseHeaders = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "zeytun-stats-sync",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: baseHeaders })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  const linkHeader = res.headers.get("Link")
  const data = await res.json()
  return { data, linkHeader }
}

async function fetchAllPages(initialUrl) {
  let url = initialUrl
  const allItems = []

  while (url) {
    const { data, linkHeader } = await fetchJson(url)
    if (Array.isArray(data)) {
      allItems.push(...data)
    } else {
      allItems.push(data)
    }

    url = null
    if (linkHeader) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/)
      if (match) {
        url = match[1]
      }
    }
  }

  return allItems
}

async function sync() {
  let previous = {
    schemaVersion: 1,
    repo: REPO,
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

  if (fs.existsSync(STATS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(STATS_FILE, "utf8"))
      if (raw && raw.schemaVersion === 1) {
        previous = raw
      }
    } catch {
      // keep fallback
    }
  }

  const nextStats = { latestRelease: null, ...previous }
  const nowIso = new Date().toISOString()

  // 1. Fetch Stars Count
  try {
    let count = null
    try {
      const { data } = await fetchJson(
        `https://api.github.com/repos/${REPO}/stargazers/count`
      )
      if (typeof data.count === "number") count = data.count
    } catch {
      const { data } = await fetchJson(`https://api.github.com/repos/${REPO}`)
      if (typeof data.stargazers_count === "number")
        count = data.stargazers_count
    }

    if (typeof count === "number") {
      nextStats.stars = {
        value: count,
        updatedAt: nowIso,
      }
      console.log(`[sync] Stars count: ${count}`)
    }
  } catch (err) {
    console.warn(`[sync] Failed to fetch stars count: ${err.message}`)
  }

  // 2. Fetch Stargazers History
  try {
    const { data } = await fetchJson(
      `https://api.github.com/repos/${REPO}/stargazers/history?per_page=30&page=1`
    )
    if (Array.isArray(data)) {
      // data is newest-first, take up to 26 weeks and reverse to oldest-first
      const slice = data.slice(0, 26).reverse()
      const points = slice.map((item) => ({
        week: item.week,
        stars: typeof item.total === "number" ? item.total : 0,
      }))
      nextStats.history = {
        kind: "weekly-new-stars",
        points,
        updatedAt: nowIso,
      }
      console.log(`[sync] Star history points: ${points.length}`)
    }
  } catch (err) {
    console.warn(`[sync] Failed to fetch star history: ${err.message}`)
  }

  // 3. Fetch Releases & DMG Downloads
  try {
    const releases = await fetchAllPages(
      `https://api.github.com/repos/${REPO}/releases?per_page=100&page=1`
    )
    // Filter: skip drafts, include published prereleases
    const publishedReleases = releases.filter((r) => !r.draft)

    let totalDownloads = 0
    let dmgAssetCount = 0
    const seenAssetIds = new Set()

    for (const rel of publishedReleases) {
      let assets = rel.assets || []
      // If release assets are paginated beyond embedded array
      if (rel.assets_url && assets.length === 100) {
        try {
          assets = await fetchAllPages(rel.assets_url)
        } catch {
          // fallback to embedded assets
        }
      }
      rel.assets = assets

      for (const asset of assets) {
        if (!asset || seenAssetIds.has(asset.id)) continue
        seenAssetIds.add(asset.id)

        const name = (asset.name || "").toLowerCase()
        if (name.endsWith(".dmg") && asset.state === "uploaded") {
          totalDownloads += asset.download_count || 0
          dmgAssetCount += 1
        }
      }
    }

    nextStats.downloads = {
      value: totalDownloads,
      assetCount: dmgAssetCount,
      updatedAt: nowIso,
      kind: "macos-dmg-assets",
    }
    nextStats.latestRelease = selectMacInstaller(publishedReleases)
    console.log(
      `[sync] Installer: ${nextStats.latestRelease?.assetName || "no published macOS installer"}`
    )
    console.log(
      `[sync] DMG downloads: ${totalDownloads} (across ${dmgAssetCount} DMG assets in ${publishedReleases.length} published releases)`
    )

    const releasesPayload = []
    for (const rel of publishedReleases) {
      let body = rel.body || ""
      if (!body.trim()) {
        try {
          const notesRes = await fetch(
            `https://api.github.com/repos/${REPO}/releases/generate-notes`,
            {
              method: "POST",
              headers: baseHeaders,
              body: JSON.stringify({ tag_name: rel.tag_name }),
            }
          )
          if (notesRes.ok) {
            const notesData = await notesRes.json()
            if (notesData.body) {
              body = notesData.body
            }
          }
        } catch {
          // ignore
        }
      }

      let commits = []
      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${REPO}/commits?sha=${rel.tag_name}&per_page=15`,
          { headers: baseHeaders }
        )
        if (commitsRes.ok) {
          const rawCommits = await commitsRes.json()
          commits = rawCommits.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message,
            author: c.author?.login || c.commit.author?.name || "",
            html_url: c.html_url,
          }))
        }
      } catch {
        // ignore
      }

      releasesPayload.push({
        id: rel.id,
        tag_name: rel.tag_name,
        name: rel.name || rel.tag_name,
        published_at: rel.published_at,
        html_url: rel.html_url,
        body,
        prerelease: Boolean(rel.prerelease),
        commits,
        assets: (rel.assets || []).map((a) => ({
          name: a.name,
          browser_download_url: a.browser_download_url,
          size: a.size,
          download_count: a.download_count || 0,
        })),
      })
    }

    const relTmp = `${RELEASES_FILE}.tmp`
    fs.writeFileSync(relTmp, JSON.stringify(releasesPayload, null, 2) + "\n", "utf8")
    fs.renameSync(relTmp, RELEASES_FILE)
    console.log(`[sync] Successfully updated ${RELEASES_FILE} (${releasesPayload.length} releases)`)
  } catch (err) {
    console.warn(`[sync] Failed to fetch releases/downloads: ${err.message}`)
  }

  // Atomic write to data/github-stats.json
  const tmpFile = `${STATS_FILE}.tmp`
  fs.writeFileSync(tmpFile, JSON.stringify(nextStats, null, 2) + "\n", "utf8")
  fs.renameSync(tmpFile, STATS_FILE)
  console.log(`[sync] Successfully updated ${STATS_FILE}`)
}

sync().catch((err) => {
  console.error(`[sync] Fatal error: ${err.message}`)
  // Do not exit with failure so static build is never blocked by GitHub outages
  process.exit(0)
})
