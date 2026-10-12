"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ListXIcon, QuillWrite01Icon } from "@hugeicons/core-free-icons"

import { Section } from "../common/section"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"
import { Option, Rise, SectionHead } from "./chrome"
import { useDemoActivity } from "@/hooks/use-demo-activity"

export function Process() {
  return (
    <Section id="process">
      <SectionHead
        eyebrow="Process"
        title="Know which app is talking."
        lede="Review available process details for traffic handled by Zeytun, with live bandwidth and shortcuts to create rules or close connections."
      />
      <PBody />
    </Section>
  )
}

function PBody() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
      <Rise className="order-2 md:order-1" delay={0.15}>
        <ProcessFig />
      </Rise>
      <div className="order-1 space-y-8 md:order-2">
        <Rise>
          <Option
            title="Live per-app bandwidth"
            description="Current up and down speed for every application, next to the total it has moved."
          />
        </Rise>
        <Separator />
        <Rise delay={0.1}>
          <Option
            title="Where it actually goes"
            description="Active and closed connection counts, the host it talks to most, and the binary the traffic came from."
          />
        </Rise>
        <Separator />
        <Rise delay={0.2}>
          <Option
            title="Act from where you are"
            description="Right-click a process to write a rule for it, or kill its live connections on the spot. No settings screen in between."
          />
        </Rise>
      </div>
    </div>
  )
}

/** Speeds and totals are the v3 mock values, in the app's own formatting. */
const APPS = [
  {
    name: "Telegram",
    icon: "/process/telegram.png",
    speed: 412,
    total: "842 MB",
    up: "16 KB/s",
    down: "396 KB/s",
    active: 3,
    closed: 27,
    host: "149.154.167.91:443",
    path: "/Applications/Telegram.app",
  },
  {
    name: "Safari",
    icon: "/process/safari.png",
    speed: 2100,
    total: "6.4 GB",
    up: "44 KB/s",
    down: "2.0 MB/s",
    active: 11,
    closed: 214,
    host: "cloudflare-dns.com:443",
    path: "/Applications/Safari.app",
  },
  {
    name: "Spotify",
    icon: "/process/spotify.png",
    speed: 96,
    total: "1.2 GB",
    up: "6 KB/s",
    down: "90 KB/s",
    active: 2,
    closed: 41,
    host: "audio-fa.scdn.co:443",
    path: "/Applications/Spotify.app",
  },
  {
    name: "Notion",
    icon: "/process/notion.png",
    speed: 18,
    total: "96 MB",
    up: "3 KB/s",
    down: "15 KB/s",
    active: 1,
    closed: 8,
    host: "notion.so:443",
    path: "/Applications/Notion.app",
  },
  {
    name: "Chrome",
    icon: "/process/chrome.png",
    speed: 0,
    total: "318 MB",
    up: "0 B/s",
    down: "0 B/s",
    active: 0,
    closed: 62,
    host: "142.250.185.78:443",
    path: "/Applications/Google Chrome.app",
  },
]

const ROW_STEP = 64 // row height + mb-3

function fmt(kbps: number) {
  if (kbps === 0) return "0 B/s"
  return kbps >= 1000 ? `${(kbps / 1000).toFixed(1)} MB/s` : `${kbps} KB/s`
}

const PHASE_DURATIONS: Record<"idle" | "menu" | "detail" | "closing", number> =
  {
    idle: 4200,
    menu: 2200,
    detail: 5000,
    closing: 550,
  }

export function ProcessFig({ active = true }: { active?: boolean } = {}) {
  const { ref, canAnimate, reducedMotion } = useDemoActivity(active)
  const [rows, setRows] = useState(
    // ponytail: fixed seeds — Math.random() in useState breaks SSR hydration
    APPS.map((a, id) => ({ id, speed: a.speed }))
  )
  const [phase, setPhase] = useState<"idle" | "menu" | "detail" | "closing">(
    "idle"
  )
  const [focus, setFocus] = useState(0)

  const remainingRef = useRef<number>(PHASE_DURATIONS.idle)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!canAnimate) return
    const iv = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          const seed = APPS[r.id].speed
          return {
            ...r,
            speed:
              seed === 0
                ? 0
                : Math.max(4, Math.round(seed * (0.8 + Math.random() * 0.4))),
          }
        })
      )
    }, 900)
    return () => clearInterval(iv)
  }, [canAnimate])

  useEffect(() => {
    if (!canAnimate) return

    startTimeRef.current = Date.now()
    let completed = false
    const t = setTimeout(() => {
      completed = true
      if (phase === "idle") {
        setFocus(Math.floor(Math.random() * APPS.length))
        setPhase("menu")
        remainingRef.current = PHASE_DURATIONS.menu
      } else if (phase === "menu") {
        setPhase("detail")
        remainingRef.current = PHASE_DURATIONS.detail
      } else if (phase === "detail") {
        setPhase("closing")
        remainingRef.current = PHASE_DURATIONS.closing
      } else {
        setPhase("idle")
        remainingRef.current = PHASE_DURATIONS.idle
      }
    }, remainingRef.current)

    return () => {
      clearTimeout(t)
      if (!completed) {
        const elapsed = Date.now() - startTimeRef.current
        remainingRef.current = Math.max(0, remainingRef.current - elapsed)
      }
    }
  }, [phase, canAnimate])

  const app = APPS[focus]

  return (
    <div
      ref={ref}
      className="relative mx-auto grid h-98.5 w-full max-w-112 items-center"
    >
      <div className="relative flow-root w-full">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
            Process Activity
          </span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50 uppercase">
            Illustrative preview
          </span>
        </div>
        {rows.map((r) => {
          const collapsed =
            (phase === "detail" || phase === "closing") && r.id !== focus
          const selected = phase !== "idle" && r.id === focus
          return (
            <motion.div
              key={r.id}
              aria-hidden={collapsed}
              className="overflow-hidden"
              initial={false}
              animate={{
                height: collapsed ? 0 : 52,
                marginBottom: collapsed ? 0 : 12,
                opacity: collapsed
                  ? 0
                  : phase === "menu" && !selected
                    ? 0.35
                    : 1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProcessRow
                name={APPS[r.id].name}
                icon={APPS[r.id].icon}
                speed={fmt(r.speed)}
                total={`total: ${APPS[r.id].total}`}
                active={selected}
              />
            </motion.div>
          )
        })}

        <AnimatePresence>
          {phase === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ top: focus * ROW_STEP + 38 }}
              className="absolute right-0 z-20 w-max max-w-full origin-top-left rounded-xl border border-border/60 bg-popover/90 p-1 shadow-2xl shadow-black/50 backdrop-blur-md sm:right-auto sm:left-[55%]"
            >
              {[
                { icon: QuillWrite01Icon, label: "Create rule…" },
                { icon: ListXIcon, label: "Kill connections" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex cursor-default items-center gap-2 rounded-lg py-1 ps-2 pe-4 text-sm"
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    className="size-4 text-foreground"
                  />
                  {item.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "detail" && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { delay: reducedMotion ? 0 : 0.4 },
              }}
              exit={{ height: 0, opacity: 0, transition: { delay: 0 } }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <div className="space-y-3 rounded-2xl border border-border/40 bg-card/70 p-4">
                <Detail label="Bandwidth">
                  <span className="text-foreground">↓ {app.down}</span>
                  <span className="text-muted-foreground">↑ {app.up}</span>
                </Detail>
                <Detail label="Connections">
                  <span className="text-foreground">{app.active} active</span>
                  <span className="text-muted-foreground">
                    {app.closed} closed
                  </span>
                </Detail>
                <Detail label="Details">
                  <span className="truncate text-muted-foreground">
                    {app.host}
                  </span>
                </Detail>
                <Detail label="Binary">
                  <span className="truncate text-muted-foreground">
                    {app.path}
                  </span>
                </Detail>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-baseline gap-3">
      <span className="w-24 shrink-0 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="flex min-w-0 gap-4 font-mono text-xs">{children}</span>
    </div>
  )
}

function ProcessRow({
  name,
  icon,
  speed,
  total,
  active,
}: {
  name: string
  icon: string
  speed: string
  total: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-13 items-center gap-4 rounded-2xl border bg-card/70 px-4 py-2.5",
        active ? "border-border" : "border-border/40"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt={name}
        className="size-7 shrink-0 rounded-lg object-contain"
      />
      <p className="font-mono">{name}</p>
      <div className="ms-auto text-end font-mono">
        <p className="text-sm leading-tight">{speed}</p>
        <p className="text-xs leading-tight text-muted-foreground">{total}</p>
      </div>
    </div>
  )
}
