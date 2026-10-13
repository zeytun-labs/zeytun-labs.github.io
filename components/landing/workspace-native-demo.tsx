"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import {
  Home04Icon,
  DashboardSquare01Icon,
  CommandLineIcon,
  ArrowDataTransferHorizontalIcon,
  Book02Icon,
  AddressBookIcon,
  TestTube01Icon,
  BorderFullIcon,
  Cardiogram01Icon,
  Settings03Icon,
  Notification01Icon,
  Add01Icon,
  ReloadIcon,
  ZapIcon,
  DatabaseIcon,
  InternetIcon,
  Link04Icon,
  Upload01Icon,
  Download01Icon,
  Edit03Icon,
  Delete01Icon,
  CheckIcon,
  Rotate02Icon,
  ChevronsLeftRightEllipsisIcon,
  CurvyRightDirectionIcon,
  TrendingUpDownIcon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { Mark } from "./mark"
import { AppWordmark } from "./app-wordmark"
import { cn } from "@/lib/utils"
import { useDemoActivity } from "@/hooks/use-demo-activity"
import { WorkspaceHome } from "./workspace-home"
import { WorkspaceProcess } from "./workspace-process"
import { WorkspaceRules, WorkspaceRulesetEditor } from "./workspace-rules"
import { WorkspaceTraffic, WorkspaceConnectionSheet } from "./workspace-traffic"
import { WorkspaceRuleEditor } from "./workspace-rule-editor"
import {
  initialConnections,
  closeProcessConnections,
  processRule,
  saveRouteRule,
} from "./workspace-activity-data"
import type { DemoConnection, RuleDraft } from "./workspace-activity-data"
import {
  AppButton,
  AppMenuItem,
  AppSelect,
  AppSwitch,
  AppIcon,
  AppTabs,
  AppModal,
  ProxyCard,
  PolicyCard,
  CellEnabled,
  APP_INPUT,
  APP_CONTROL,
} from "./workspace-demo-ui"
import {
  APP_THEME,
  DNS_PROTOCOL_COLORS,
  APP_WIDTH,
  APP_HEIGHT,
  initialProfiles,
  newProfile,
} from "./workspace-demo-data"
import type {
  DemoProfile,
  WorkspaceView,
  ProxyNode,
  DemoRuleset,
} from "./workspace-demo-data"

type Menu = {
  kind: "profile" | "add" | "policy" | "proxy"
  id?: string
  x: number
  y: number
}
type Modal =
  | "profile"
  | "proxy"
  | "policy"
  | "chain"
  | "subscription"
  | "server"
  | "rule"
  | "host"
  | null
const NAV = [
  { label: "Home", icon: Home04Icon, view: "home" },
  { label: "Control Center", icon: DashboardSquare01Icon },
  { label: "Process", icon: CommandLineIcon, view: "process" },
  { label: "Policy", icon: ArrowDataTransferHorizontalIcon, view: "policies" },
  { label: "Rule", icon: Book02Icon, view: "routing" },
  { label: "DNS", icon: AddressBookIcon, view: "dns" },
  { label: "Tools", icon: TestTube01Icon, view: "tools" },
  { label: "Logs", icon: BorderFullIcon },
] as const
const MODE_DESCRIPTIONS = {
  direct: "All requests will be sent to the target server directly.",
  global: "All requests will be forwarded to a proxy server.",
  rule: "Using rule system to determine how to process requests.",
}
const MODAL_TITLES = {
  profile: "Add new Profile",
  proxy: "Add new Proxy",
  policy: "Add new Policy",
  chain: "Create Proxy Chain",
  subscription: "Add Subscription",
  server: "Add DNS Server",
  rule: "Add DNS Rule",
  host: "Add Local Host",
}

export function WorkspaceDemo({
  view,
  onViewChange,
  guided,
}: {
  view: WorkspaceView
  onViewChange: (view: WorkspaceView) => void
  guided?: "overview" | "process" | "rule"
}) {
  const [profiles, setProfiles] = useState<DemoProfile[]>(() => {
    const profiles = initialProfiles()
    // Every fresh story session starts in the mode that applies its Safari rule.
    return profiles.map((profile) => ({ ...profile, mode: "rule" as const }))
  })
  const [activeId, setActiveId] = useState("personal")
  const [pendingRestart, setPendingRestart] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [, setNotice] = useState("")
  const [menu, setMenu] = useState<Menu | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [dnsTab, setDnsTab] = useState("servers")
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [hoverNav, setHoverNav] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [protocol, setProtocol] = useState("DoH")
  const [routing, setRouting] = useState("")
  const [dnsFinal, setDnsFinal] = useState<Record<string, string>>({})
  const [sequence, setSequence] = useState<string[]>([])
  const [error, setError] = useState("")
  const [testResult, setTestResult] = useState(false)
  const [stunResult, setStunResult] = useState(false)
  const [serialTest, setSerialTest] = useState(false)
  const [http3, setHttp3] = useState(false)
  const [connections, setConnections] = useState(initialConnections)
  const [clearedConnections, setClearedConnections] = useState<string[]>([])
  const [tick, setTick] = useState(0)
  const [ruleEditor, setRuleEditor] = useState<{
    draft: RuleDraft
    context?: string
    owner: string
  } | null>(null)
  const [rulesetEditor, setRulesetEditor] =
    useState<Partial<DemoRuleset> | null>(null)
  const [inspectedConnection, setInspectedConnection] =
    useState<DemoConnection | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const { ref: activityRef, canAnimate } = useDemoActivity(
    view === "home" || view === "process"
  )
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const counter = useRef(0)
  const current = profiles.find((item) => item.id === activeId) ?? profiles[0]
  const systemProxy = current.systemProxy
  const tun = current.tun
  const page =
    view === "home"
      ? "Home"
      : view === "process"
        ? "Process"
        : view === "routing"
          ? "Rule"
          : view === "traffic"
            ? "Traffic Monitor"
            : view === "dns"
              ? "DNS"
              : view === "tools"
                ? "Tools"
                : "Policy"
  const policyTab = view === "profiles" ? "subscriptions" : "proxies"

  useEffect(() => {
    if (!canAnimate) return
    const interval = setInterval(
      () => setTick((previous) => previous + 1),
      1500
    )
    return () => clearInterval(interval)
  }, [canAnimate])

  useEffect(() => {
    // Scroll navigation should not leave a popup from the previous page over
    // the next scene; profile edits and saved rules remain in the same session.
    const frame = requestAnimationFrame(() => {
      setMenu(null)
      setModal(null)
      setRuleEditor(null)
      setRulesetEditor(null)
      setInspectedConnection(null)
      setReportOpen(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [view])

  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    const resize = () => {
      element.style.setProperty(
        "--demo-scale",
        String(element.clientWidth / APP_WIDTH)
      )
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )
  useEffect(() => {
    if (!menu) return
    const close = (event: PointerEvent) => {
      if ((event.target as Element).closest?.("[data-profile-trigger]")) return
      if (!menuRef.current?.contains(event.target as Node)) setMenu(null)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [menu])
  const update = (changes: Partial<DemoProfile>, id = current.id) =>
    setProfiles((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...changes } : item))
    )
  const run = (task: string, action: () => void) => {
    if (timer.current) clearTimeout(timer.current)
    setBusy(task)
    timer.current = setTimeout(() => {
      action()
      setBusy(null)
      timer.current = null
    }, 650)
  }
  const navigate = (next: WorkspaceView) => {
    setMenu(null)
    setModal(null)
    setSelectedRow(null)
    setRuleEditor(null)
    setRulesetEditor(null)
    setInspectedConnection(null)
    setReportOpen(false)
    onViewChange(next)
  }
  const editRule = (draft: RuleDraft, context?: string) => {
    setMenu(null)
    setInspectedConnection(null)
    setRuleEditor({ draft, context, owner: current.id })
  }
  const updateRouting = (changes: Partial<DemoProfile>) => {
    update(changes)
    setPendingRestart(true)
    setNotice("Sample routing changes saved.")
  }
  const openMenu = (kind: Menu["kind"], target: HTMLElement, id?: string) => {
    if (kind === "profile") {
      setMenu((previous) =>
        previous?.kind === "profile" ? null : { kind, x: 88, y: 366 }
      )
      return
    }
    const root = canvas.current!.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    const scale = root.width / APP_WIDTH
    setMenu({
      kind,
      id,
      x: Math.min(
        APP_WIDTH - 250,
        Math.max(104, (rect.left - root.left) / scale)
      ),
      y: Math.min(APP_HEIGHT - 230, (rect.bottom - root.top) / scale + 8),
    })
  }
  const openModal = (next: Exclude<Modal, null>) => {
    setMenu(null)
    setName("")
    setAddress("")
    setProtocol(next === "proxy" ? "VLESS" : "DoH")
    setRouting("")
    setSequence([])
    setError("")
    setModal(next)
  }
  const sync = (id?: string) => {
    const owner = current.id
    run("subscription", () => {
      setProfiles((previous) =>
        previous.map((profile) =>
          profile.id !== owner
            ? profile
            : {
                ...profile,
                subscriptions: profile.subscriptions.map((source) =>
                  !id || source.id === id
                    ? { ...source, updated: true }
                    : source
                ),
              }
        )
      )
      setNotice("Sample subscriptions refreshed.")
    })
    setNotice("Refreshing sample subscriptions…")
  }
  const testProxies = () => {
    const owner = current.id
    run("latency", () => {
      setProfiles((previous) =>
        previous.map((profile) =>
          profile.id !== owner
            ? profile
            : {
                ...profile,
                proxies: profile.proxies.map((node) => ({
                  ...node,
                  latency: node.latency + 2,
                })),
              }
        )
      )
      setNotice("Sample latency test complete.")
    })
  }
  const selectProxy = (node: ProxyNode) => {
    if (current.mode === "direct") {
      setNotice("Select Global Proxy or Rule-based Proxy to choose a route.")
      return
    }
    update({ selected: node.id })
    setMenu(null)
    setNotice(`${node.name} selected.`)
  }
  const submit = () => {
    if (modal !== "profile" && !name.trim()) {
      setError("Enter a name.")
      return
    }
    const id = `demo-${++counter.current}`
    if (modal === "profile") {
      const created = {
        ...newProfile(id, name.trim() || `Profile ${profiles.length + 1}`),
        mode: "direct" as const,
        systemProxy: false,
        tun: false,
        selected: "",
        proxies: [],
        policies: [],
        subscriptions: [],
        servers: [],
        rules: [],
        hosts: [],
        routeRules: [
          {
            id: "route-final",
            kind: "FINAL",
            value: "",
            outbound: "direct",
            comment: "",
            enabled: true,
          },
        ],
        rulesets: [],
      }
      setProfiles((previous) => [...previous, created])
      setActiveId(id)
    } else if (modal === "chain") {
      if (sequence.length < 2) {
        setError("Add at least two proxies to the sequence.")
        return
      }
      update({
        proxies: [
          ...current.proxies,
          {
            id,
            name: name.trim(),
            protocol: "chain",
            flag: "",
            address: "",
            port: 0,
            source: "Manual",
            latency: 110,
            sequence: sequence.map(
              (tag) => current.proxies.find((node) => node.id === tag)!.name
            ),
          },
        ],
      })
      setPendingRestart(true)
    } else if (modal === "proxy") {
      if (!address.trim()) {
        setError("Enter a server address.")
        return
      }
      update({
        proxies: [
          ...current.proxies,
          {
            id,
            name: name.trim(),
            protocol: protocol.toLowerCase(),
            flag: "",
            address: address.trim(),
            port: 443,
            source: "Manual",
            latency: 80,
          },
        ],
      })
      setPendingRestart(true)
    } else if (modal === "policy") {
      update({
        policies: [
          ...current.policies,
          {
            id,
            name: name.trim(),
            kind: protocol === "Auto" ? "auto" : "manual",
            member: current.proxies[0]?.id ?? "",
          },
        ],
      })
    } else if (modal === "subscription") {
      let host: string
      try {
        const url = new URL(address)
        if (url.protocol !== "https:" || !url.hostname) throw new Error()
        host = url.hostname.toUpperCase()
      } catch {
        setError("Enter a valid HTTPS subscription URL.")
        return
      }
      update({
        subscriptions: [
          ...current.subscriptions,
          {
            id,
            name: name.trim(),
            host,
            nodes: 0,
            used: 0,
            total: 0,
            updated: false,
          },
        ],
      })
    } else if (modal === "server") {
      if (!address.trim()) {
        setError("Enter a server address.")
        return
      }
      update({
        servers: [
          ...current.servers,
          {
            id,
            name: name.trim(),
            protocol,
            address: address.trim(),
            routing:
              routing === "direct"
                ? "direct (Local DNS)"
                : (current.policies.find((policy) => policy.id === routing)
                    ?.name ?? "default"),
          },
        ],
      })
      setPendingRestart(true)
    } else if (modal === "rule") {
      update({
        rules: [
          ...current.rules,
          {
            id,
            type: "DOMAIN-SUFFIX",
            match: name.trim(),
            resolver: current.servers[0]?.name ?? "Reject",
            enabled: true,
          },
        ],
      })
      setPendingRestart(true)
    } else if (modal === "host") {
      if (!address.trim()) {
        setError("Enter an address.")
        return
      }
      update({
        hosts: [
          ...current.hosts,
          { id, domain: name.trim(), address: address.trim(), enabled: true },
        ],
      })
      setPendingRestart(true)
    }
    setModal(null)
    setNotice("Sample changes saved.")
  }
  const empty = (
    title: string,
    description: string,
    action: () => void,
    button: string
  ) => (
    <div className="rounded-3xl border border-dashed border-border/50 bg-card/20 px-6 py-12 text-center">
      <AppIcon
        icon={InternetIcon}
        className="mx-auto mb-3 size-6 text-muted-foreground"
      />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <AppButton className="mt-4" onClick={action}>
        {button}
      </AppButton>
    </div>
  )

  return (
    <div ref={activityRef} className="min-w-0">
      <div
        ref={viewport}
        style={{
          ...APP_THEME,
          aspectRatio: `${APP_WIDTH} / ${APP_HEIGHT}`,
          borderRadius: "calc(28px * var(--demo-scale, 0.8))",
        }}
        className="relative isolate overflow-hidden border border-border/60 bg-background font-sans text-foreground shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)]"
      >
        <div
          style={{
            width: APP_WIDTH,
            height: APP_HEIGHT,
            minWidth: APP_WIDTH,
            position: "absolute",
            transform: "scale(var(--demo-scale, 0.8))",
            transformOrigin: "top left",
          }}
          ref={canvas}
          data-app-canvas
          className="relative overflow-hidden bg-background text-sm"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenu(null)
              setModal(null)
            }
          }}
        >
          <div
            aria-hidden="true"
            className="absolute top-[18px] left-6 z-30 flex gap-2"
          >
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <aside
            aria-label="App navigation"
            className="pointer-events-none absolute inset-y-0 left-6 z-40 flex w-12 flex-col items-start pt-12 pb-8"
          >
            <div className="mb-4 flex size-12 shrink-0 items-center justify-center">
              <Mark className="size-9 text-primary drop-shadow-sm" />
            </div>
            <nav
              aria-label="Primary app navigation"
              onPointerLeave={() => setHoverNav(null)}
              className="group/pill pointer-events-auto relative flex w-12 flex-col gap-1 overflow-hidden rounded-[24px] border border-border/40 bg-popover/70 p-1 shadow-lg backdrop-blur-xl transition-[width] duration-300 hover:w-48"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-1 top-1 h-9.5 rounded-full bg-accent transition-[transform,opacity] duration-200"
                style={{
                  transform: `translateY(${(hoverNav ?? 0) * 42}px)`,
                  opacity: hoverNav === null ? 0 : 1,
                }}
              />
              {NAV.map((item, index) => {
                const target =
                  "view" in item ? (item.view as WorkspaceView) : null
                const active = item.label === page
                return (
                  <button
                    type="button"
                    key={item.label}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    disabled={!target}
                    title={
                      target
                        ? item.label
                        : `${item.label} · not included in this preview`
                    }
                    onPointerEnter={() => setHoverNav(index)}
                    onClick={() => target && navigate(target)}
                    className={cn(
                      "relative z-10 flex h-9.5 w-full shrink-0 cursor-pointer items-center rounded-full text-sm",
                      APP_CONTROL,
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      !target && "disabled:opacity-100"
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center">
                      <AppIcon icon={item.icon} />
                    </span>
                    <span className="truncate pr-2.5 opacity-0 transition-opacity duration-200 group-hover/pill:opacity-100">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </nav>
            <div className="min-h-8 flex-1" />
            <nav
              aria-label="Secondary app navigation"
              className="group/secondary pointer-events-auto mb-4 flex w-12 flex-col gap-1 overflow-hidden rounded-[24px] border border-border/40 bg-popover/70 p-1 shadow-lg transition-[width] duration-300 hover:w-48"
            >
              {[
                { label: "Traffic Monitor", icon: Cardiogram01Icon },
                { label: "Settings", icon: Settings03Icon },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  disabled={item.label === "Settings"}
                  aria-current={item.label === page ? "page" : undefined}
                  title={
                    item.label === "Settings"
                      ? "Not included in this preview"
                      : item.label
                  }
                  onClick={() => navigate("traffic")}
                  className={cn(
                    "flex h-9.5 w-full shrink-0 items-center rounded-full text-muted-foreground hover:bg-accent",
                    APP_CONTROL,
                    item.label === page &&
                      "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center">
                    <AppIcon icon={item.icon} />
                  </span>
                  <span className="truncate pr-2.5 opacity-0 transition-opacity group-hover/secondary:opacity-100">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
            <button
              type="button"
              data-profile-trigger
              aria-label="Choose active profile"
              aria-haspopup="menu"
              aria-expanded={menu?.kind === "profile"}
              onClick={(event) => openMenu("profile", event.currentTarget)}
              className={cn(
                "pointer-events-auto flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-card/85 shadow-lg backdrop-blur-xl hover:bg-accent",
                APP_CONTROL
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-muted font-medium">
                {current.name[0].toUpperCase()}
              </span>
            </button>
          </aside>

          <header className="absolute top-4 right-6 left-[104px] z-30 flex h-11 items-center gap-2 rounded-full border border-border/40 bg-card/70 px-3 shadow-lg backdrop-blur-xl">
            <AppWordmark />
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">{page}</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="mr-1 border-r border-border pr-3 text-muted-foreground">
                <AppIcon icon={Notification01Icon} className="size-4" />
              </span>
              {[
                {
                  label: "System Proxy",
                  on: systemProxy,
                  action: () => update({ systemProxy: !systemProxy }),
                },
                {
                  label: "TUN Mode",
                  on: tun,
                  action: () => update({ tun: !tun }),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={item.on}
                  aria-label={`Preview ${item.label}`}
                  onClick={item.action}
                  className={cn(
                    "flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 text-muted-foreground hover:bg-foreground/5",
                    APP_CONTROL,
                    item.on && "text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      item.on ? "bg-primary" : "bg-muted-foreground/50"
                    )}
                  />
                  {item.label}
                </button>
              ))}
              {pendingRestart && (
                <AppButton
                  primary
                  className="h-8 border-0 bg-primary/10 text-primary hover:bg-primary/30"
                  icon={Rotate02Icon}
                  disabled={busy === "restart"}
                  onClick={() =>
                    run("restart", () => {
                      setPendingRestart(false)
                      setNotice("Sample core restarted.")
                    })
                  }
                >
                  Restart Core
                </AppButton>
              )}
              <span
                className="mx-2 size-2 rounded-full bg-lime-500"
                title="Example core status"
              />
            </div>
          </header>

          <main
            key={view}
            data-preview-page={view}
            className="absolute top-20 right-6 bottom-6 left-[104px] overflow-y-auto motion-safe:animate-in motion-safe:duration-150 motion-safe:fade-in"
            onClick={() => setMenu(null)}
          >
            {page === "Home" && (
              <WorkspaceHome
                profile={current}
                connections={connections}
                tick={tick}
                diagnosing={busy === "diagnostics"}
                running={canAnimate}
                onDiagnostics={() =>
                  run("diagnostics", () =>
                    setNotice("Sample diagnostics complete.")
                  )
                }
                onReport={() => setReportOpen(true)}
              />
            )}
            {page === "Process" && (
              <WorkspaceProcess
                guided={guided === "process"}
                connections={connections}
                tick={tick}
                onCloseConnections={(name) => {
                  setConnections((previous) =>
                    closeProcessConnections(previous, name)
                  )
                  setNotice(`Sample connections for ${name} closed.`)
                }}
                onAddRule={(process) =>
                  editRule(processRule(process), process.name)
                }
              />
            )}
            {page === "Rule" && (
              <WorkspaceRules
                guided={guided === "rule"}
                key={current.id}
                profile={current}
                onUpdate={updateRouting}
                onEdit={(draft) => editRule(draft)}
                onEditSet={setRulesetEditor}
              />
            )}
            {page === "Traffic Monitor" && (
              <WorkspaceTraffic
                connections={connections.filter(
                  (item) =>
                    item.status === "active" ||
                    !clearedConnections.includes(item.id)
                )}
                profile={current}
                onClear={() => {
                  setClearedConnections(
                    connections
                      .filter((item) => item.status === "closed")
                      .map((item) => item.id)
                  )
                  setNotice(
                    "Closed sample connections cleared; active connections remain."
                  )
                }}
                onInspect={setInspectedConnection}
                onAddRule={(draft) => editRule(draft)}
              />
            )}
            {page === "Policy" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <AppTabs
                      label="Outbound mode"
                      equal
                      value={current.mode}
                      onChange={(mode) => {
                        update({ mode })
                        setNotice(
                          `${mode === "direct" ? "Direct Outbound" : mode === "global" ? "Global Proxy" : "Rule-based Proxy"} selected.`
                        )
                      }}
                      items={[
                        {
                          value: "direct",
                          label: "Direct Outbound",
                          icon: ChevronsLeftRightEllipsisIcon,
                        },
                        {
                          value: "global",
                          label: "Global Proxy",
                          icon: CurvyRightDirectionIcon,
                        },
                        {
                          value: "rule",
                          label: "Rule-based Proxy",
                          icon: TrendingUpDownIcon,
                        },
                      ]}
                    />
                    <p className="px-3 py-1 text-sm text-muted-foreground/60">
                      {MODE_DESCRIPTIONS[current.mode]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppTabs
                      label="Policy views"
                      value={policyTab}
                      onChange={(tab) =>
                        navigate(
                          tab === "subscriptions" ? "profiles" : "policies"
                        )
                      }
                      items={[
                        { value: "proxies", label: "Proxies & Policies" },
                        { value: "subscriptions", label: "Subscriptions" },
                      ]}
                    />
                    <AppButton
                      aria-label={
                        policyTab === "subscriptions"
                          ? "Refresh all subscriptions"
                          : "Test all proxies"
                      }
                      disabled={busy !== null}
                      icon={
                        policyTab === "subscriptions" ? ReloadIcon : ZapIcon
                      }
                      onClick={() =>
                        policyTab === "subscriptions" ? sync() : testProxies()
                      }
                    />
                    <AppButton
                      icon={Add01Icon}
                      aria-label="Add policy item"
                      aria-haspopup="menu"
                      onClick={(event) => {
                        event.stopPropagation()
                        openMenu("add", event.currentTarget)
                      }}
                    />
                  </div>
                </div>
                {policyTab === "subscriptions" ? (
                  current.subscriptions.length ? (
                    <div className="grid grid-cols-3 gap-3.5">
                      {current.subscriptions.map((source) => (
                        <div
                          key={source.id}
                          className="flex flex-col justify-between gap-4 rounded-4xl border border-border/40 bg-card/70 p-4 pb-5 transition-colors hover:bg-card"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-semibold">
                              {source.nodes}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">
                                {source.name}
                              </div>
                              <div className="truncate font-mono text-xs text-muted-foreground uppercase">
                                {source.host}
                              </div>
                            </div>
                            <AppButton
                              aria-label={`Sync ${source.name}`}
                              title="Sync now"
                              icon={ReloadIcon}
                              disabled={busy !== null}
                              onClick={() => sync(source.id)}
                            />
                          </div>
                          <div className="flex flex-col gap-2 rounded-2xl bg-muted/40 p-3">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Usage</span>
                              <span>No Expiry</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              {source.total ? (
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{
                                    width: `${(source.used / source.total) * 100}%`,
                                  }}
                                />
                              ) : (
                                <div
                                  className="h-full w-full"
                                  style={{
                                    background:
                                      "repeating-linear-gradient(-45deg,color-mix(in oklab,var(--primary) 45%,transparent) 0 4px,color-mix(in oklab,var(--primary) 12%,transparent) 4px 8px)",
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{source.used} GB</span>
                              <span>
                                {source.total
                                  ? `${source.total} GB (${source.used}%)`
                                  : "Unlimited"}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {source.updated
                                ? "Updated just now"
                                : "Ready to sync"}
                            </span>
                            <span>{source.nodes} nodes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    empty(
                      "No subscriptions yet",
                      "Add a subscription URL to import and synchronize proxy nodes automatically.",
                      () => openModal("subscription"),
                      "Add Subscription"
                    )
                  )
                ) : (
                  <>
                    {current.policies.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs tracking-wide text-muted-foreground">
                          POLICY
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                          {current.policies.map((policy) => (
                            <PolicyCard
                              key={policy.id}
                              policy={policy}
                              member={
                                current.proxies.find(
                                  (node) => node.id === policy.member
                                )?.name ?? "Direct"
                              }
                              selected={
                                current.mode !== "direct" &&
                                current.selected === policy.id
                              }
                              count={current.proxies.length}
                              onClick={(event) => {
                                event.stopPropagation()
                                if (current.mode === "direct") {
                                  setNotice(
                                    "Select Global Proxy or Rule-based Proxy to choose a route."
                                  )
                                  return
                                }
                                if (policy.kind === "manual")
                                  openMenu(
                                    "policy",
                                    event.currentTarget,
                                    policy.id
                                  )
                                else {
                                  update({ selected: policy.id })
                                  setNotice("Auto policy selected.")
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className="text-xs tracking-wide text-muted-foreground">
                        PROXY
                      </p>
                      {current.proxies.length ? (
                        <div className="grid grid-cols-4 gap-3">
                          {current.proxies.map((node) => (
                            <ProxyCard
                              key={node.id}
                              proxy={node}
                              selected={
                                current.mode !== "direct" &&
                                current.selected === node.id
                              }
                              testing={busy === "latency"}
                              onClick={() => selectProxy(node)}
                              onContextMenu={(
                                event: MouseEvent<HTMLButtonElement>
                              ) => {
                                event.preventDefault()
                                event.stopPropagation()
                                openMenu("proxy", event.currentTarget, node.id)
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        empty(
                          "No proxies in this group",
                          "Add a proxy server to start routing traffic through this group.",
                          () => openModal("proxy"),
                          "Add Proxy"
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {page === "DNS" && (
              <div className="flex min-w-0 flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <AppTabs
                      label="DNS views"
                      value={dnsTab}
                      onChange={(tab) => {
                        setDnsTab(tab)
                        setSelectedRow(null)
                      }}
                      items={[
                        { value: "servers", label: "Servers" },
                        { value: "rules", label: "DNS Rules" },
                        { value: "hosts", label: "Local Hosts" },
                      ]}
                    />
                    <div className="flex items-center gap-1.5">
                      {selectedRow && (
                        <AppButton
                          icon={Delete01Icon}
                          aria-label="Delete selected DNS item"
                          className="text-red-400"
                          onClick={() => {
                            update(
                              dnsTab === "servers"
                                ? {
                                    servers: current.servers.filter(
                                      (item) => item.id !== selectedRow
                                    ),
                                  }
                                : dnsTab === "rules"
                                  ? {
                                      rules: current.rules.filter(
                                        (item) => item.id !== selectedRow
                                      ),
                                    }
                                  : {
                                      hosts: current.hosts.filter(
                                        (item) => item.id !== selectedRow
                                      ),
                                    }
                            )
                            setSelectedRow(null)
                            setPendingRestart(true)
                          }}
                        />
                      )}
                      <AppButton
                        icon={Add01Icon}
                        onClick={() =>
                          openModal(
                            dnsTab === "servers"
                              ? "server"
                              : dnsTab === "rules"
                                ? "rule"
                                : "host"
                          )
                        }
                      >
                        {dnsTab === "servers"
                          ? "Add Server"
                          : dnsTab === "rules"
                            ? "Add Rule"
                            : "Add Host"}
                      </AppButton>
                    </div>
                  </div>
                  <p className="mt-1 px-2 text-[13px] text-muted-foreground/80">
                    {dnsTab === "servers"
                      ? "List of all DNS servers used for resolution. Assign outbounds to control routing and whether it is a Local or Remote DNS."
                      : dnsTab === "rules"
                        ? "Route matching domains through a configured DNS server or block them."
                        : "Resolve a domain to a fixed IPv4 or IPv6 address before querying upstream DNS."}
                  </p>
                </div>
                {dnsTab === "servers" ? (
                  <div
                    role="table"
                    aria-label="DNS servers"
                    className="px-2 text-sm"
                  >
                    <div
                      role="row"
                      className="grid h-8 grid-cols-[80px_200px_1fr_180px] border-b border-border/70 px-2 text-xs text-muted-foreground uppercase"
                    >
                      {["Type", "Name", "Address", "Routing"].map((label) => (
                        <span
                          key={label}
                          role="columnheader"
                          className="flex items-center px-2 font-medium"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    {current.servers.map((server) => (
                      <div
                        key={server.id}
                        role="row"
                        tabIndex={0}
                        aria-selected={selectedRow === server.id}
                        onClick={() => setSelectedRow(server.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setSelectedRow(server.id)
                          }
                        }}
                        className={cn(
                          "grid h-12 cursor-pointer grid-cols-[80px_200px_1fr_180px] items-center rounded-xl px-2 transition-colors hover:bg-card/70",
                          APP_CONTROL,
                          selectedRow === server.id && "bg-card/70"
                        )}
                      >
                        <span role="cell" className="px-2">
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-mono text-xs",
                              DNS_PROTOCOL_COLORS[server.protocol] ??
                                "border-border bg-muted text-muted-foreground"
                            )}
                          >
                            {server.protocol}
                          </span>
                        </span>
                        <span role="cell" className="truncate px-2 font-medium">
                          {server.name}
                        </span>
                        <span
                          role="cell"
                          className="truncate px-2 font-mono text-muted-foreground"
                        >
                          {server.address}
                        </span>
                        <span role="cell" className="px-2">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {server.routing}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    role="table"
                    aria-label={
                      dnsTab === "rules" ? "DNS rules" : "Local hosts"
                    }
                    className="px-2"
                  >
                    <div
                      role="row"
                      className={cn(
                        "grid h-8 border-b border-border/70 px-2 text-xs text-muted-foreground uppercase",
                        dnsTab === "rules"
                          ? "grid-cols-[44px_110px_1fr_160px_1fr]"
                          : "grid-cols-[60px_1fr_1fr]"
                      )}
                    >
                      {(dnsTab === "rules"
                        ? [
                            "",
                            "Type",
                            "Pattern / Value",
                            "Resolver Target",
                            "Comment",
                          ]
                        : ["", "Domain", "Address"]
                      ).map((label, index) => (
                        <span
                          key={index}
                          role="columnheader"
                          className="flex items-center px-2"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    {dnsTab === "rules"
                      ? current.rules.map((rule) => (
                          <div
                            key={rule.id}
                            role="row"
                            onClick={() => setSelectedRow(rule.id)}
                            className={cn(
                              "grid h-12 grid-cols-[44px_110px_1fr_160px_1fr] items-center rounded-xl px-2 hover:bg-card/70",
                              !rule.enabled && "opacity-50"
                            )}
                          >
                            <span role="cell" className="px-2">
                              <CellEnabled
                                label={`Enable ${rule.match} DNS rule`}
                                checked={rule.enabled}
                                onChange={() => {
                                  update({
                                    rules: current.rules.map((item) =>
                                      item.id === rule.id
                                        ? { ...item, enabled: !item.enabled }
                                        : item
                                    ),
                                  })
                                  setPendingRestart(true)
                                }}
                              />
                            </span>
                            <span
                              role="cell"
                              className="px-2 font-mono text-[10px]"
                            >
                              {rule.type}
                            </span>
                            <span
                              role="cell"
                              className="truncate px-2 font-mono text-xs"
                            >
                              {rule.match}
                            </span>
                            <span role="cell" className="px-2 text-xs">
                              {rule.resolver}
                            </span>
                            <span
                              role="cell"
                              className="px-2 text-muted-foreground"
                            >
                              —
                            </span>
                          </div>
                        ))
                      : current.hosts.map((host) => (
                          <div
                            key={host.id}
                            role="row"
                            onClick={() => setSelectedRow(host.id)}
                            className={cn(
                              "grid h-12 grid-cols-[60px_1fr_1fr] items-center rounded-xl px-2 hover:bg-muted/30",
                              !host.enabled && "opacity-50"
                            )}
                          >
                            <span role="cell" className="px-2">
                              <CellEnabled
                                label={`Enable ${host.domain} host mapping`}
                                checked={host.enabled}
                                onChange={() => {
                                  update({
                                    hosts: current.hosts.map((item) =>
                                      item.id === host.id
                                        ? { ...item, enabled: !item.enabled }
                                        : item
                                    ),
                                  })
                                  setPendingRestart(true)
                                }}
                              />
                            </span>
                            <span role="cell" className="px-2">
                              {host.domain}
                            </span>
                            <span
                              role="cell"
                              className="px-2 font-mono text-muted-foreground"
                            >
                              {host.address}
                            </span>
                          </div>
                        ))}
                    {dnsTab === "rules" && (
                      <>
                        <div className="h-px bg-border/70" />
                        <div
                          role="row"
                          className="grid h-12 grid-cols-[44px_110px_1fr_160px_1fr] items-center bg-muted/20 px-2"
                        >
                          <span role="cell" className="px-2">
                            <CellEnabled
                              checked
                              disabled
                              label="FINAL DNS rule is always enabled"
                              onChange={() => {}}
                            />
                          </span>
                          <span role="cell" className="px-2">
                            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                              FINAL
                            </span>
                          </span>
                          <span
                            role="cell"
                            className="truncate px-2 text-muted-foreground"
                          >
                            Everything else (unmatched queries)
                          </span>
                          <span role="cell" className="px-2">
                            <AppSelect
                              label="Final DNS resolver"
                              value={dnsFinal[current.id] ?? ""}
                              onChange={(value) => {
                                setDnsFinal((previous) => ({
                                  ...previous,
                                  [current.id]: value,
                                }))
                                setPendingRestart(true)
                              }}
                              options={[
                                { value: "", label: "Local (System)" },
                                ...current.servers.map((server) => ({
                                  value: server.id,
                                  label: server.name,
                                })),
                                ...(dnsFinal[current.id] &&
                                !current.servers.some(
                                  (server) => server.id === dnsFinal[current.id]
                                )
                                  ? [
                                      {
                                        value: dnsFinal[current.id],
                                        label: `${dnsFinal[current.id]} (missing)`,
                                      },
                                    ]
                                  : []),
                              ]}
                            />
                          </span>
                          <span role="cell" />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {page === "Tools" && (
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-4xl border border-border/40 bg-card/70 py-3">
                  <div className="flex items-center justify-between border-b border-border/40 px-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <AppIcon icon={ZapIcon} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">
                          Network Quality Test
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Test latency, download, and upload capacity.
                        </p>
                      </div>
                    </div>
                    <AppButton
                      primary
                      disabled={busy !== null}
                      onClick={() =>
                        run("network", () => {
                          setTestResult(true)
                          setNotice("Sample network test complete.")
                        })
                      }
                    >
                      Start Test
                    </AppButton>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-5 pt-3">
                    <label className="text-xs text-muted-foreground uppercase">
                      Configuration URL
                      <input
                        aria-label="Network quality configuration URL"
                        defaultValue="https://mensura.cdn-apple.com/api/v1/gm/config"
                        className={cn(APP_INPUT, "mt-2 normal-case")}
                      />
                    </label>
                    <label className="text-xs text-muted-foreground uppercase">
                      Outbound
                      <AppSelect
                        label="Network test outbound"
                        initial="direct"
                        className="mt-2 normal-case"
                        options={[
                          { value: "direct", label: "Direct" },
                          ...current.policies.map((item) => ({
                            value: item.id,
                            label: item.name,
                          })),
                          ...current.proxies.map((item) => ({
                            value: item.id,
                            label: item.name,
                          })),
                        ]}
                      />
                    </label>
                    <label className="text-xs text-muted-foreground uppercase">
                      Max runtime
                      <AppSelect
                        label="Network test max runtime"
                        className="mt-2 normal-case"
                        options={["20", "30", "60"].map((value) => ({
                          value,
                          label: `${value} Seconds`,
                        }))}
                      />
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <AppSwitch
                          label="Serial"
                          checked={serialTest}
                          onChange={setSerialTest}
                          disabled={busy === "network"}
                        />
                        Serial
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AppSwitch
                          label="HTTP/3"
                          checked={http3}
                          onChange={setHttp3}
                          disabled={busy === "network"}
                        />
                        HTTP/3
                      </div>
                    </div>
                  </div>
                  {testResult && (
                    <div className="mx-5 mt-3 grid grid-cols-6 gap-3 rounded-2xl bg-muted/50 p-3">
                      {[
                        ["Latency", "42 ms"],
                        ["Download", "84.6 Mbps"],
                        ["Upload", "21.3 Mbps"],
                        ["DL RPM", "840"],
                        ["UL RPM", "720"],
                        ["Elapsed", "20000 ms"],
                      ].map(([label, value]) => (
                        <div key={label} className="text-center">
                          <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {label}
                          </p>
                          <p className="mt-1 font-mono text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-4xl border border-border/40 bg-card/70 py-3">
                  <div className="flex items-center justify-between border-b border-border/40 px-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <AppIcon icon={DatabaseIcon} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">STUN Test</h3>
                        <p className="text-xs text-muted-foreground">
                          Test NAT traversal and mapping behavior.
                        </p>
                      </div>
                    </div>
                    <AppButton
                      primary
                      disabled={busy !== null}
                      onClick={() =>
                        run("stun", () => {
                          setStunResult(true)
                          setNotice("Sample STUN test complete.")
                        })
                      }
                    >
                      Start Test
                    </AppButton>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-5 pt-3">
                    <label className="text-xs tracking-wide text-muted-foreground uppercase">
                      Server
                      <input
                        aria-label="STUN server"
                        defaultValue="stun.voipgate.com:3478"
                        className={cn(APP_INPUT, "mt-2 normal-case")}
                      />
                    </label>
                    <label className="text-xs tracking-wide text-muted-foreground uppercase">
                      Outbound
                      <AppSelect
                        label="STUN outbound"
                        initial="direct"
                        className="mt-2 normal-case"
                        options={[
                          { value: "direct", label: "Direct" },
                          ...current.policies.map((item) => ({
                            value: item.id,
                            label: item.name,
                          })),
                          ...current.proxies.map((item) => ({
                            value: item.id,
                            label: item.name,
                          })),
                        ]}
                      />
                    </label>
                    {stunResult && (
                      <div className="col-span-2 mt-1 grid grid-cols-4 gap-3 rounded-2xl bg-muted/50 p-3">
                        {[
                          ["External Address", "198.51.100.10:54321"],
                          ["Latency", "42 ms"],
                          ["NAT Mapping", "Endpoint-independent"],
                          ["NAT Filtering", "Endpoint-independent"],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0 text-center">
                            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                              {label}
                            </p>
                            <p
                              className="mt-1 truncate font-mono text-sm"
                              title={value}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>

          {ruleEditor && (
            <WorkspaceRuleEditor
              draft={ruleEditor.draft}
              context={ruleEditor.context}
              profile={
                profiles.find((p) => p.id === ruleEditor.owner) ?? current
              }
              onClose={() => setRuleEditor(null)}
              onSave={(draft) => {
                const id = `route-demo-${++counter.current}`
                setProfiles((previous) =>
                  previous.map((profile) =>
                    profile.id === ruleEditor.owner
                      ? {
                          ...profile,
                          routeRules: saveRouteRule(
                            profile.routeRules,
                            draft,
                            id
                          ),
                        }
                      : profile
                  )
                )
                setRuleEditor(null)
                setPendingRestart(true)
                setNotice("Sample rule saved. Open Rule to review it.")
              }}
            />
          )}
          {rulesetEditor && (
            <WorkspaceRulesetEditor
              draft={rulesetEditor}
              profile={current}
              onClose={() => setRulesetEditor(null)}
              onSave={(draft) => {
                const saved = {
                  ...draft,
                  id: draft.id ?? `ruleset-demo-${++counter.current}`,
                  enabled: draft.enabled ?? true,
                } as DemoRuleset
                updateRouting({
                  rulesets: draft.id
                    ? current.rulesets.map((item) =>
                        item.id === draft.id ? saved : item
                      )
                    : [...current.rulesets, saved],
                })
                setRulesetEditor(null)
              }}
            />
          )}
          {inspectedConnection && (
            <WorkspaceConnectionSheet
              connection={inspectedConnection}
              profile={current}
              onClose={() => setInspectedConnection(null)}
              onAddRule={(draft) => editRule(draft)}
            />
          )}
          {reportOpen && (
            <AppModal title="Report" sheet onClose={() => setReportOpen(false)}>
              <pre className="mt-5 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {"Network diagnostics · Example data\n\nRouter: 2 ms\nDNS resolution: 12 ms\nDirect policy: 24 ms\n" +
                  (current.mode === "global"
                    ? "Proxy policy: 42 ms"
                    : "Proxy policy: N/A in this mode")}
              </pre>
            </AppModal>
          )}
          {menu && (
            <div
              ref={menuRef}
              role="menu"
              aria-label={menu.kind === "profile" ? "Profiles" : "App actions"}
              style={
                menu.kind === "profile"
                  ? { left: 88, bottom: 32 }
                  : { left: menu.x, top: menu.y }
              }
              className={cn(
                "absolute z-50 max-h-[600px] overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-xl",
                menu.kind === "add" ? "w-52" : "w-56"
              )}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault()
                  const elements = Array.from(
                    event.currentTarget.querySelectorAll<HTMLButtonElement>(
                      "button[role=menuitem]:not(:disabled)"
                    )
                  )
                  const index = elements.indexOf(
                    document.activeElement as HTMLButtonElement
                  )
                  elements[
                    (index +
                      (event.key === "ArrowDown" ? 1 : elements.length - 1)) %
                      elements.length
                  ]?.focus()
                }
              }}
            >
              {menu.kind === "profile" ? (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                      {current.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{current.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Active Profile
                      </p>
                    </div>
                  </div>
                  <div className="my-1 border-t border-border" />
                  {profiles
                    .filter((item) => item.id !== current.id)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveId(item.id)
                          setMenu(null)
                          setPendingRestart(false)
                          setNotice(`${item.name} profile selected.`)
                        }}
                        className={cn(
                          "flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left hover:bg-accent",
                          APP_CONTROL
                        )}
                      >
                        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                          {item.name[0]}
                        </span>
                        {item.name}
                      </button>
                    ))}
                  <div className="my-1 border-t border-border" />
                  <AppMenuItem
                    icon={Add01Icon}
                    onClick={() => openModal("profile")}
                  >
                    Create new Profile
                  </AppMenuItem>
                  <AppMenuItem
                    icon={Upload01Icon}
                    onClick={() => {}}
                    disabled={true}
                  >
                    Import Profile
                  </AppMenuItem>
                  <div className="my-1 border-t border-border" />
                  <AppMenuItem
                    icon={Download01Icon}
                    onClick={() => {}}
                    disabled={true}
                  >
                    Export Profile
                  </AppMenuItem>
                  <AppMenuItem
                    icon={Edit03Icon}
                    onClick={() => {}}
                    disabled={true}
                  >
                    Edit
                  </AppMenuItem>
                  <div className="my-1 border-t border-border" />
                  <AppMenuItem
                    icon={Delete01Icon}
                    onClick={() => {}}
                    disabled={true}
                  >
                    Delete
                  </AppMenuItem>
                </>
              ) : menu.kind === "add" ? (
                <>
                  <AppMenuItem
                    icon={InternetIcon}
                    onClick={() => openModal("proxy")}
                  >
                    Add new Proxy
                  </AppMenuItem>
                  <AppMenuItem
                    icon={ArrowDataTransferHorizontalIcon}
                    onClick={() => {
                      openModal("policy")
                      setProtocol("Manual")
                    }}
                  >
                    Add new Policy
                  </AppMenuItem>
                  <AppMenuItem
                    icon={Link04Icon}
                    onClick={() => openModal("chain")}
                  >
                    Create Proxy Chain
                  </AppMenuItem>
                  <AppMenuItem
                    icon={Link04Icon}
                    onClick={() => openModal("subscription")}
                  >
                    Add Subscription
                  </AppMenuItem>
                  <div className="my-1 border-t border-border" />
                  <AppMenuItem
                    icon={Upload01Icon}
                    onClick={() => {}}
                    disabled={true}
                  >
                    Add from Clipboard
                  </AppMenuItem>
                </>
              ) : menu.kind === "policy" ? (
                <>
                  {current.proxies.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        update({
                          selected: menu.id!,
                          policies: current.policies.map((item) =>
                            item.id === menu.id
                              ? { ...item, member: node.id }
                              : item
                          ),
                        })
                        setMenu(null)
                        setNotice(`${node.name} selected in policy.`)
                      }}
                      className={cn(
                        "flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 text-left text-sm hover:bg-accent",
                        APP_CONTROL
                      )}
                    >
                      {node.name}
                      {current.policies.find((item) => item.id === menu.id)
                        ?.member === node.id && (
                        <AppIcon icon={CheckIcon} className="size-4" />
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <AppMenuItem
                    icon={CheckIcon}
                    onClick={() => {
                      const node = current.proxies.find(
                        (item) => item.id === menu.id
                      )
                      if (node) selectProxy(node)
                    }}
                    disabled={current.mode === "direct"}
                  >
                    Select
                  </AppMenuItem>
                  <AppMenuItem
                    icon={ZapIcon}
                    onClick={() => {
                      setMenu(null)
                      testProxies()
                    }}
                  >
                    Test Latency
                  </AppMenuItem>
                  <div className="my-1 border-t border-border" />
                  <AppMenuItem
                    icon={Delete01Icon}
                    onClick={() => {
                      update({
                        proxies: current.proxies.filter(
                          (node) => node.id !== menu.id
                        ),
                        selected:
                          current.selected === menu.id ? "" : current.selected,
                      })
                      setMenu(null)
                      setPendingRestart(true)
                    }}
                  >
                    Delete
                  </AppMenuItem>
                </>
              )}
            </div>
          )}

          {modal && (
            <AppModal
              title={MODAL_TITLES[modal]}
              sheet={
                modal === "chain" ||
                modal === "subscription" ||
                modal === "proxy" ||
                modal === "policy"
              }
              description={
                modal === "chain"
                  ? "Route traffic through a sequence of proxies. Traffic will enter the first proxy and exit from the last."
                  : modal === "profile"
                    ? "A profile owns its own proxies, policies, rules, and subscription sources."
                    : undefined
              }
              onClose={() => setModal(null)}
            >
              <form
                className="mt-6 flex flex-1 flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit()
                }}
              >
                <label className="text-sm">
                  {modal === "chain"
                    ? "Chain Name"
                    : modal === "server"
                      ? "Server Name"
                      : modal === "host"
                        ? "Domain"
                        : modal === "rule"
                          ? "Domain suffix"
                          : "Name"}
                  <input
                    autoFocus
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      setError("")
                    }}
                    className={cn(APP_INPUT, "mt-2")}
                    placeholder={
                      modal === "profile"
                        ? "Home"
                        : modal === "chain"
                          ? "e.g., Double VPN"
                          : "Name"
                    }
                  />
                </label>
                {modal === "chain" ? (
                  <>
                    <div>
                      <p className="mb-2">Sequence (First to Last)</p>
                      {sequence.length ? (
                        <div className="flex flex-col gap-2">
                          {sequence.map((id, index) => (
                            <div
                              key={id}
                              draggable
                              onDragStart={(event) =>
                                event.dataTransfer.setData("text/plain", id)
                              }
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => {
                                event.preventDefault()
                                const source =
                                  event.dataTransfer.getData("text/plain")
                                if (!sequence.includes(source)) return
                                const next = sequence.filter(
                                  (item) => item !== source
                                )
                                next.splice(index, 0, source)
                                setSequence(next)
                              }}
                              className="flex h-11 items-center gap-3 rounded-xl border border-border bg-card/70 px-3"
                            >
                              <AppIcon
                                icon={Menu01Icon}
                                className="size-4 text-muted-foreground"
                              />
                              <span className="flex-1">
                                {
                                  current.proxies.find((item) => item.id === id)
                                    ?.name
                                }
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove proxy ${index + 1} from chain`}
                                onClick={() =>
                                  setSequence(
                                    sequence.filter((item) => item !== id)
                                  )
                                }
                                className={cn(
                                  "cursor-pointer p-1",
                                  APP_CONTROL
                                )}
                              >
                                <AppIcon
                                  icon={Cancel01Icon}
                                  className="size-4"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                          No proxies added yet. Select below to add.
                        </p>
                      )}
                    </div>
                    <label className="border-t border-border pt-4">
                      Add Proxy to Chain
                      <AppSelect
                        label="Add Proxy to Chain"
                        className="mt-2"
                        value=""
                        onChange={(id) => {
                          if (id) setSequence([...sequence, id])
                        }}
                        options={[
                          { value: "", label: "Select a proxy" },
                          ...current.proxies
                            .filter(
                              (node) =>
                                !node.sequence && !sequence.includes(node.id)
                            )
                            .map((node) => ({
                              value: node.id,
                              label: node.name,
                            })),
                        ]}
                      />
                    </label>
                  </>
                ) : modal !== "profile" &&
                  modal !== "rule" &&
                  modal !== "policy" ? (
                  <label>
                    {modal === "subscription"
                      ? "URL"
                      : modal === "host"
                        ? "Address"
                        : "Server Address"}
                    <input
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className={cn(APP_INPUT, "mt-2")}
                      placeholder={
                        modal === "subscription"
                          ? "https://subs.example.com"
                          : modal === "server"
                            ? "dns.google/dns-query"
                            : "203.0.113.10"
                      }
                    />
                  </label>
                ) : null}
                {(modal === "server" ||
                  modal === "proxy" ||
                  modal === "policy") && (
                  <label>
                    {modal === "policy" ? "Type" : "Protocol"}
                    <AppSelect
                      label={modal === "policy" ? "Policy Type" : "Protocol"}
                      className="mt-2"
                      value={protocol}
                      onChange={setProtocol}
                      options={(modal === "server"
                        ? ["DoH", "DoT", "UDP", "TCP", "QUIC"]
                        : modal === "policy"
                          ? ["Manual", "Auto"]
                          : ["VLESS", "Shadowsocks", "Trojan"]
                      ).map((value) => ({ value, label: value }))}
                    />
                  </label>
                )}
                {modal === "server" && (
                  <label>
                    Outbound
                    <AppSelect
                      label="DNS server outbound"
                      className="mt-2"
                      value={routing}
                      onChange={setRouting}
                      options={[
                        { value: "", label: "No detour (core default)" },
                        { value: "direct", label: "direct (Local DNS)" },
                        ...current.policies.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      ]}
                    />
                  </label>
                )}
                {error && (
                  <p role="alert" className="text-sm text-red-400">
                    {error}
                  </p>
                )}
                <div className="mt-auto flex justify-end gap-2 border-t border-border pt-5">
                  <AppButton onClick={() => setModal(null)}>Cancel</AppButton>
                  <AppButton primary type="submit">
                    {modal === "chain"
                      ? "Create Chain"
                      : modal === "profile"
                        ? "Create Profile"
                        : "Save"}
                  </AppButton>
                </div>
              </form>
            </AppModal>
          )}
        </div>
      </div>
    </div>
  )
}
