import type { CSSProperties } from "react"

// Dark tokens from app/src/routes/layout.css. Keep this theme scoped to the
// preview so the landing's Space Grotesk headings and brighter lime stay intact.
export const APP_THEME = {
  "--background": "oklch(0.153 0.006 107.1)",
  "--foreground": "oklch(0.988 0.003 106.5)",
  "--card": "oklch(0.228 0.013 107.4)",
  "--popover": "oklch(0.228 0.013 107.4)",
  "--primary": "oklch(0.768 0.233 130.85)",
  "--primary-foreground": "oklch(0.405 0.101 131.063)",
  "--muted": "oklch(0.286 0.016 107.4)",
  "--muted-foreground": "oklch(0.737 0.021 106.9)",
  "--accent": "oklch(0.286 0.016 107.4)",
  "--secondary": "oklch(0.274 0.006 286.033)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--ring": "oklch(0.58 0.031 107.3)",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--radius-4xl": "26px",
  "--radius-3xl": "22px",
  "--radius-2xl": "18px",
  "--radius-xl": "14px",
  "--radius-lg": "10px",
  "--font-heading": "var(--font-sans)",
  "--font-mono":
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as CSSProperties

export const APP_WIDTH = 1040
export const APP_HEIGHT = 700
export const DNS_PROTOCOL_COLORS: Record<string, string> = {
  DoH: "border-sky-500/20 bg-sky-500/10 text-sky-500",
  DoT: "border-violet-500/20 bg-violet-500/10 text-violet-500",
  QUIC: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  TCP: "border-orange-500/20 bg-orange-500/10 text-orange-500",
  UDP: "border-teal-500/20 bg-teal-500/10 text-teal-500",
}
export type WorkspaceView =
  | "home"
  | "process"
  | "profiles"
  | "policies"
  | "routing"
  | "dns"
  | "tools"
  | "traffic"
export type RouteRule = {
  id: string
  kind: string
  value: string
  outbound: string
  comment: string
  enabled: boolean
  temporary?: boolean
  expiry?: string
}
export type DemoRuleset = {
  id: string
  name: string
  source: string
  outbound: string
  downloadVia: string
  enabled: boolean
}
export type ProxyNode = {
  id: string
  name: string
  protocol: string
  flag: string
  address: string
  port: number
  source: string
  latency: number
  sequence?: string[]
}
export type Policy = {
  id: string
  name: string
  kind: "manual" | "auto"
  member: string
}
export type DnsServer = {
  id: string
  name: string
  protocol: string
  address: string
  routing: string
}
export type DnsRule = {
  id: string
  type: string
  match: string
  resolver: string
  enabled: boolean
}
export type Host = {
  id: string
  domain: string
  address: string
  enabled: boolean
}
export type Subscription = {
  id: string
  name: string
  host: string
  nodes: number
  used: number
  total: number
  updated: boolean
}
export type DemoProfile = {
  id: string
  name: string
  mode: "direct" | "global" | "rule"
  systemProxy: boolean
  tun: boolean
  selected: string
  proxies: ProxyNode[]
  policies: Policy[]
  subscriptions: Subscription[]
  servers: DnsServer[]
  rules: DnsRule[]
  hosts: Host[]
  routeRules: RouteRule[]
  rulesets: DemoRuleset[]
}

export function newProfile(id: string, name: string): DemoProfile {
  return {
    id,
    name,
    mode: "global",
    systemProxy: true,
    tun: true,
    selected: "nl",
    routeRules: [
      {
        id: "route-safari",
        kind: "PROCESS-NAME",
        value: "Safari",
        outbound: "direct",
        comment: "Browser traffic",
        enabled: true,
      },
      {
        id: "route-streaming",
        kind: "DOMAIN-SUFFIX",
        value: "scdn.co",
        outbound: "streaming",
        comment: "Streaming",
        enabled: true,
      },
      {
        id: "route-temp",
        kind: "DOMAIN",
        value: "preview.example.com",
        outbound: "direct",
        comment: "Temporary bypass",
        enabled: true,
        temporary: true,
        expiry: "1 Hour",
      },
      {
        id: "route-final",
        kind: "FINAL",
        value: "",
        outbound: "auto",
        comment: "",
        enabled: true,
      },
    ],
    rulesets: [
      {
        id: "set-ads",
        name: "Ads & trackers",
        source: "https://rules.example.com/ads.srs",
        outbound: "block",
        downloadVia: "direct",
        enabled: true,
      },
    ],
    proxies: [
      {
        id: "nl",
        name: "Amsterdam",
        protocol: "vless",
        flag: "🇳🇱",
        address: "203.0.113.10",
        port: 443,
        source: "Everyday routes",
        latency: 42,
      },
      {
        id: "de",
        name: "Frankfurt",
        protocol: "vless",
        flag: "🇩🇪",
        address: "203.0.113.20",
        port: 443,
        source: "Everyday routes",
        latency: 68,
      },
      {
        id: "us",
        name: "New York",
        protocol: "shadowsocks",
        flag: "🇺🇸",
        address: "198.51.100.30",
        port: 8388,
        source: "Extra routes",
        latency: 119,
      },
      {
        id: "sg",
        name: "Singapore",
        protocol: "trojan",
        flag: "🇸🇬",
        address: "198.51.100.40",
        port: 443,
        source: "Extra routes",
        latency: 151,
      },
    ],
    policies: [
      { id: "streaming", name: "Streaming pool", kind: "manual", member: "nl" },
      { id: "auto", name: "Auto", kind: "auto", member: "nl" },
    ],
    subscriptions: [
      {
        id: "everyday",
        name: "Everyday routes",
        host: "SUBS.EXAMPLE.COM",
        nodes: 2,
        used: 12.3,
        total: 100,
        updated: false,
      },
      {
        id: "extras",
        name: "Extra routes",
        host: "EXTRAS.EXAMPLE.COM",
        nodes: 2,
        used: 0,
        total: 0,
        updated: false,
      },
    ],
    servers: [
      {
        id: "cloudflare",
        name: "Cloudflare",
        protocol: "DoH",
        address: "cloudflare-dns.com/dns-query",
        routing: "direct (Local DNS)",
      },
      {
        id: "google",
        name: "Google",
        protocol: "DoH",
        address: "dns.google/dns-query",
        routing: "Streaming pool",
      },
      {
        id: "local",
        name: "Local DNS",
        protocol: "UDP",
        address: "192.0.2.1",
        routing: "default",
      },
    ],
    rules: [
      {
        id: "work-domains",
        type: "DOMAIN-SUFFIX",
        match: "example.com",
        resolver: "Cloudflare",
        enabled: true,
      },
      {
        id: "ads",
        type: "GEOSITE",
        match: "geosite-ads",
        resolver: "Reject",
        enabled: true,
      },
    ],
    hosts: [
      {
        id: "local-host",
        domain: "dev.example.com",
        address: "192.0.2.10",
        enabled: true,
      },
    ],
  }
}
export function initialProfiles() {
  return [
    newProfile("personal", "Personal"),
    { ...newProfile("work", "Work"), selected: "de", mode: "rule" as const },
  ]
}
