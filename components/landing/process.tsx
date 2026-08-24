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
      <div>
        <ProcessFig />
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

const APPS = ["Telegram", "Safari", "Spotify", "Dropbox", "Signal"]
const ROW_STEP = 64 // h-[52px] row + mb-3

function ProcessFig() {
  const [rows, setRows] = useState(
    APPS.map((name, id) => ({
      id,
      name,
      // ponytail: fixed seeds — Math.random() in useState breaks SSR hydration; shuffle on mount if wanted
      speed: [34, 8, 21, 3, 12][id],
      total: [7, 24, 11, 2, 18][id],
    }))
  )
  const [phase, setPhase] = useState<"idle" | "menu" | "detail">("idle")
  const [focus, setFocus] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setRows((rs) =>
        rs.map((p) => ({
          ...p,
          speed: Math.min(60, Math.max(0.5, p.speed + (Math.random() - 0.5) * 12)),
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
      else setPhase("idle")
    }, dur)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="relative max-w-100 ms-auto h-98.5">
      <AnimatePresence initial={false}>
        {rows.map((p) => {
          if (phase === "detail" && p.id !== focus) return null
          const active = phase !== "idle" && p.id === focus
          return (
            <motion.div
              key={p.id}
              layout
              className="overflow-hidden mb-3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: phase === "menu" && !active ? 0.35 : 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProcessRow
                name={p.name}
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
            className="absolute left-[55%] z-20 w-max rounded-xl border border-border/60 bg-popover/90 backdrop-blur-md p-1 shadow-2xl shadow-black/50 origin-top-left"
          >
            {[
              { icon: QuillWrite01Icon, label: `Add Rule for ${APPS[focus]}` },
              { icon: ListXIcon, label: "Kill Connection" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 ps-2 pe-4 py-1 rounded-lg text-sm cursor-default"
              >
                <HugeiconsIcon icon={item.icon} className="size-4 text-foreground" />
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="h-72 rounded-2xl border border-border/40 bg-card/70" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProcessRow({
  name,
  speed,
  total,
  active,
}: {
  name: string
  speed: string
  total: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-2.5 rounded-2xl items-center h-[52px] border bg-card/70",
        active ? "border-border" : "border-border/40"
      )}
    >
      <span className="block size-7 rounded-lg bg-muted-foreground/40 shrink-0" />
      <p className="font-mono">{name}</p>
      <div className="ms-auto text-end font-mono">
        <p className="text-sm leading-tight">{speed}</p>
        <p className="text-xs leading-tight text-muted-foreground">{total}</p>
      </div>
    </div>
  )
}
