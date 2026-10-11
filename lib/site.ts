export const RELEASES_URL = "https://github.com/zeytun-labs/zeytun-app/releases"
export const SOURCE_URL = "https://github.com/zeytun-labs/zeytun"
export const ISSUES_URL = "https://github.com/zeytun-labs/zeytun-app/issues"

export const DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ZEYTUN_DOWNLOAD_URL &&
  process.env.NEXT_PUBLIC_ZEYTUN_DOWNLOAD_URL.startsWith("https://")
    ? process.env.NEXT_PUBLIC_ZEYTUN_DOWNLOAD_URL
    : RELEASES_URL
