import type { DemoProfile, RouteRule } from "./workspace-demo-data"

export type DemoProcess = {
  name: string
  icon: string
  path: string
  down: number
  up: number
  total: number
  closed: number
  subprocesses: number
}
export type DemoConnection = {
  id: string
  process: string
  host: string
  address: string
  network: "TCP" | "UDP"
  policy: string
  status: "active" | "closed"
  up: number
  down: number
  start: string
  duration: string
}
export const DEMO_PROCESSES: DemoProcess[] = [
  {
    name: "Safari",
    icon: "/process/safari.png",
    path: "/Applications/Safari.app/Contents/MacOS/Safari",
    down: 2048000,
    up: 44000,
    total: 6400000000,
    closed: 214,
    subprocesses: 0,
  },
  {
    name: "Telegram",
    icon: "/process/telegram.png",
    path: "/Applications/Telegram.app/Contents/MacOS/Telegram",
    down: 396000,
    up: 16000,
    total: 842000000,
    closed: 27,
    subprocesses: 0,
  },
  {
    name: "Spotify",
    icon: "/process/spotify.png",
    path: "/Applications/Spotify.app/Contents/MacOS/Spotify",
    down: 90000,
    up: 6000,
    total: 1200000000,
    closed: 41,
    subprocesses: 0,
  },
  {
    name: "Notion",
    icon: "/process/notion.png",
    path: "/Applications/Notion.app/Contents/MacOS/Notion",
    down: 15000,
    up: 3000,
    total: 96000000,
    closed: 8,
    subprocesses: 0,
  },
  {
    name: "Chrome",
    icon: "/process/chrome.png",
    path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    down: 0,
    up: 0,
    total: 318000000,
    closed: 62,
    subprocesses: 0,
  },
]

// Deterministic fixtures: no hydration-time randomness, network, or native IPC.
export function initialConnections(): DemoConnection[] {
  const hosts = [
    ["Safari", "cloudflare-dns.com", "direct"],
    ["Safari", "github.com", "direct"],
    ["Telegram", "149.154.167.91", "nl"],
    ["Spotify", "audio-fa.scdn.co", "streaming"],
    ["Notion", "notion.so", "auto"],
    ["Chrome", "example.org", "direct"],
  ]
  return hosts.map(([process, host, policy], index) => ({
    id: `conn-${index}`,
    process,
    host,
    policy,
    address: `203.0.113.${index + 10}:443`,
    network: index === 0 ? "UDP" : "TCP",
    status: index < 5 ? "active" : "closed",
    up: 24000 * (index + 1),
    down: 860000 * (index + 1),
    start: `10:24:${String(59 - index * 3).padStart(2, "0")}`,
    duration: `${18 + index * 4}s`,
  }))
}
export function formatBytes(value: number) {
  if (value < 1000) return `${Math.round(value)} B`
  const unit = value < 1e6 ? "KB" : value < 1e9 ? "MB" : "GB"
  const divisor = unit === "KB" ? 1000 : unit === "MB" ? 1e6 : 1e9
  return `${(value / divisor).toFixed(value / divisor < 10 ? 1 : 0)} ${unit}`
}
export function outboundOptions(profile: DemoProfile) {
  return [
    { value: "direct", label: "Direct" },
    { value: "block", label: "Block" },
    ...profile.policies.map((item) => ({ value: item.id, label: item.name })),
    ...profile.proxies.map((item) => ({ value: item.id, label: item.name })),
  ]
}
export function outboundLabel(profile: DemoProfile, id: string) {
  return (
    outboundOptions(profile).find((item) => item.value === id)?.label ??
    `${id} (missing)`
  )
}
export type RuleDraft = Omit<RouteRule, "id" | "enabled"> & { id?: string }
export function connectionHostRule(connection: DemoConnection): RuleDraft {
  const host = connection.host
  const ipv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
  return {
    kind: ipv4 ? "IP-CIDR" : "DOMAIN",
    value: ipv4 ? `${host}/32` : host,
    outbound: "direct",
    comment: `Rule for ${host}`,
  }
}
export function processRule(process: DemoProcess): RuleDraft {
  const bundle = process.path.match(/^(.*\.app)\//)?.[1]
  return {
    kind: bundle ? "PROCESS-PATH-REGEX" : "PROCESS-PATH",
    value: bundle
      ? `^${bundle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`
      : process.path,
    outbound: "direct",
    comment: `Bypass/proxy rule for ${process.name}`,
  }
}
export function saveRouteRule(
  rules: RouteRule[],
  draft: RuleDraft,
  id: string
): RouteRule[] {
  const existing = rules.find((item) => item.id === draft.id)
  const saved: RouteRule = {
    ...draft,
    id: existing?.id ?? id,
    enabled: existing?.enabled ?? true,
  }
  if (existing)
    return rules.map((item) => (item.id === existing.id ? saved : item))
  return [
    saved,
    ...rules.filter((item) => item.kind !== "FINAL"),
    ...rules.filter((item) => item.kind === "FINAL"),
  ]
}
export function closeProcessConnections(
  connections: DemoConnection[],
  name: string
) {
  return connections.map((item) =>
    item.process === name && item.status === "active"
      ? { ...item, status: "closed" as const }
      : item
  )
}
