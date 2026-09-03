/**
 * Ledger data + churn step for the Traffic Monitor mock. Kept out of the
 * component so the churn rule ("never fewer than three live rows") can be
 * checked by `node --experimental-strip-types ledger.check.ts` without pulling
 * JSX or motion into the run.
 *
 * Rows are seeded from real destinations the app sees.
 */
export const SEED = [
  {
    app: "Telegram",
    icon: "/process/telegram.png",
    host: "149.154.167.91:443",
    policy: "streaming-pool",
    tcp: true,
    up: 16,
    down: 396,
  },
  {
    app: "Safari",
    icon: "/process/safari.png",
    host: "cloudflare-dns.com:443",
    policy: "eu-fallback",
    tcp: true,
    up: 8,
    down: 124,
  },
  {
    app: "Spotify",
    icon: "/process/spotify.png",
    host: "audio-fa.scdn.co:443",
    policy: "Direct",
    tcp: true,
    up: 4,
    down: 412,
  },
  {
    app: "Chrome",
    icon: "/process/chrome.png",
    host: "142.250.185.78:443",
    policy: "streaming-pool",
    tcp: false,
    up: 21,
    down: 96,
  },
  {
    app: "Notion",
    icon: "/process/notion.png",
    host: "notion.so:443",
    policy: "eu-fallback",
    tcp: true,
    up: 2,
    down: 18,
  },
]

export type Row = (typeof SEED)[number] & { id: string; active: boolean }

/** ponytail: fixed seed — Math.random() in a useState initializer breaks SSR hydration. */
export const initialRows = (): Row[] =>
  SEED.map((s, i) => ({ ...s, id: `seed-${i}`, active: i < 3 }))

/**
 * One churn step: a new connection goes on top, the list stays five long, and
 * the three newest are the live ones. Marking only the new row active left the
 * Active tab showing a single row that blinked out and back every tick.
 */
export function churnRows(rows: Row[], n: number): Row[] {
  const seed = SEED[n % SEED.length]
  return [{ ...seed, id: `row-${n}`, active: true }, ...rows.slice(0, 4)].map(
    (r, i) => ({ ...r, active: i < 3 })
  )
}

/** Jitter the speeds, keeping them in the range the digit columns are sized for. */
export function jitterRows(rows: Row[]): Row[] {
  return rows.map((r) => ({
    ...r,
    up: Math.min(99, Math.max(1, Math.round(r.up + (Math.random() - 0.5) * 8))),
    down: Math.min(
      999,
      Math.max(4, Math.round(r.down + (Math.random() - 0.5) * 90))
    ),
  }))
}
