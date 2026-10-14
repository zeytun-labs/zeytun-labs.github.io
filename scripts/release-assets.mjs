const REPO = "zeytun-labs/zeytun-app"

/** Latest published Apple Silicon installer, including public prereleases. */
export function selectMacInstaller(releases) {
  const published = releases
    .filter((release) => !release.draft && release.published_at)
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))

  for (const release of published) {
    const candidates = (release.assets || []).filter((asset) => {
      if (asset.state !== "uploaded" || !/\.dmg$/i.test(asset.name || ""))
        return false
      if (/(?:x86|x64|amd64|intel)/i.test(asset.name)) return false
      try {
        const url = new URL(asset.browser_download_url)
        return (
          url.protocol === "https:" &&
          url.hostname === "github.com" &&
          url.pathname.startsWith(`/${REPO}/releases/download/`) &&
          /\.dmg$/i.test(url.pathname)
        )
      } catch {
        return false
      }
    })
    const installer =
      candidates.find((asset) => /(?:aarch64|arm64)/i.test(asset.name)) ||
      candidates[0]
    if (!installer) continue
    return {
      url: installer.browser_download_url,
      version: release.tag_name,
      assetName: installer.name,
      publishedAt: release.published_at,
    }
  }
  return null
}
