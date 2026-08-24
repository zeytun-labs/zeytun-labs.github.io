"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Description, Heading, Section, Title } from "../common/section"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Asterisk02Icon,
  ListXIcon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"

export function Process() {
  return (
    <Section>
      <PHeader />
      <PBody />
    </Section>
  )
}

function PHeader() {
  return (
    <div className="mb-16 flex flex-col items-center text-center">
      {[
        <Title key="p-t">Process</Title>,
        <Heading key="p-h">Which app is doing that</Heading>,
        <Description key="p-d">
          {
            "Traffic doesn't come from nowhere. Process collapses the ledger into the applications behind it, with live speed and the details you need to act."
          }
        </Description>,
      ].map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.7,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {el}
        </motion.div>
      ))}
    </div>
  )
}

function PBody() {
  return (
    <div className="grid grid-cols-2">
      <div>
        <ProcessFig />
      </div>
      <div className="space-y-8">
        <Option
          title="Live per-app bandwidth"
          description="Current up and down speed for every application, next to the total it has moved."
        />
        <Separator />
        <Option
          title="Where it actually goes"
          description="Active and closed connection counts, the host it talks to most, and the binary the traffic came from."
        />
        <Separator />
        <Option
          title="Act from where you are"
          description="Right-click any process to write a rule for it, or kill its connections on the spot. No settings screen in between."
        />
      </div>
    </div>
  )
}

function Option({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        <HugeiconsIcon icon={Asterisk02Icon} className="size-6 text-primary" />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <p className="ps-7 text-muted-foreground">{description}</p>
    </div>
  )
}

const APPS = [
  { name: "Telegram", icon: "/process/telegram.png" },
  { name: "Safari", icon: "/process/safari.png" },
  { name: "Spotify", icon: "/process/spotify.png" },
  { name: "Notion", icon: "/process/notion.png" },
  { name: "Chrome", icon: "/process/chrome.png" },
]
const ROW_STEP = 64 // h-[52px] row + mb-3

function ProcessFig() {
  const [rows, setRows] = useState(
    APPS.map(({ name, icon }, id) => ({
      id,
      name,
      icon,
      // ponytail: fixed seeds — Math.random() in useState breaks SSR hydration; shuffle on mount if wanted
      speed: [34, 8, 21, 3, 12][id],
      total: [7, 24, 11, 2, 18][id],
    }))
  )
  const [phase, setPhase] = useState<"idle" | "menu" | "detail" | "closing">(
    "idle"
  )
  const [focus, setFocus] = useState(0)
  const [picked, setPicked] = useState("Direct")

  useEffect(() => {
    const iv = setInterval(() => {
      setRows((rs) =>
        rs.map((p) => ({
          ...p,
          speed: Math.min(
            60,
            Math.max(0.5, p.speed + (Math.random() - 0.5) * 12)
          ),
          total: p.total + (Math.random() < 0.5 ? 0.1 : 0),
        }))
      )
    }, 900)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const dur = phase === "idle" ? 4200 : phase === "menu" ? 2800 : 4800
    const t = setTimeout(() => {
      if (phase === "idle") {
        setFocus(Math.floor(Math.random() * APPS.length))
        setPhase("menu")
      } else if (phase === "menu") setPhase("detail")
      else if (phase === "detail") setPhase("closing")
      else setPhase("idle")
    }, dur)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    // closing: wait for the policy box exit (0.5s) before rows slide back in
    if (phase !== "closing") return
    const t = setTimeout(() => setPhase("idle"), 550)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="relative me-auto mt-8 h-98.5 max-w-100">
      <AnimatePresence initial={false}>
        {rows.map((p) => {
          if ((phase === "detail" || phase === "closing") && p.id !== focus)
            return null
          const active = phase !== "idle" && p.id === focus
          return (
            <motion.div
              key={p.id}
              layout
              className="mb-3 overflow-hidden"
              initial={{ opacity: 0, x: 24 }}
              animate={{
                opacity: phase === "menu" && !active ? 0.35 : 1,
                x: 0,
              }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProcessRow
                name={p.name}
                icon={p.icon}
                speed={`${Math.round(p.speed)}Mb/s`}
                total={`total:${Math.floor(p.total)}GB`}
                active={active}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: focus * ROW_STEP + 14 }}
            className="absolute left-[55%] z-20 w-max origin-top-left rounded-xl border border-border/60 bg-popover/90 p-1 shadow-2xl shadow-black/50 backdrop-blur-md"
          >
            {[
              {
                icon: QuillWrite01Icon,
                label: `Add Rule for ${APPS[focus].name}`,
              },
              { icon: ListXIcon, label: "Kill Connection" },
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
            animate={{ height: 162, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Policy
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["Direct", "🇺🇸 Proxy-US", "🇪🇺 Proxy-EU", "Reject"].map(
                  (pol) => (
                    <button
                      key={pol}
                      onClick={() => setPicked(pol)}
                      className={cn(
                        "rounded-xl border py-2.5 text-center font-mono text-sm transition-colors",
                        pol === picked
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border/40 bg-card text-muted-foreground hover:border-border"
                      )}
                    >
                      {pol}
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
