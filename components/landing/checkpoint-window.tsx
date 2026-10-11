"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function CheckpointWindowMinimal() {
  return (
    <div className="absolute z-20 mb-4 w-full max-w-60 animate-[ckpt_3s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex px-2.5 pb-0">
          <div className="flex gap-1 pt-2.5">
            <span className="block size-2 rounded-full bg-red-500" />
            <span className="block size-2 rounded-full bg-yellow-500" />
            <span className="block size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 mr-8 w-full text-center font-heading text-[10px] font-bold text-muted-foreground/50">
            CHECKPOINT
          </p>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3 pb-3">
            <div className="size-8 shrink-0 rounded-full bg-white/10" />
            <div className="flex w-full flex-col gap-2">
              <div className="h-2 w-2/3 rounded bg-white/20" />
              <div className="h-2 w-1/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 flex-1 rounded-full border border-white/15" />
            <div className="h-6 flex-1 rounded-full bg-white/15" />
            <div className="h-6 flex-1 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const
const LOOP = 7000 // ms — full cycle: open → pick policy → allow
const APPS = [
  { name: "Telegram", icon: "/process/telegram.png" },
  { name: "Spotify", icon: "/process/spotify.png" },
]
const POLICIES = ["Proxy-US", "Proxy-EU", "Direct", "Reject"]
const DEST = ["185.94.99.12:443", "35.186.224.25:8080"]

export function CheckpointWindow() {
  const [cycle, setCycle] = useState(0)
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(0)
  const [allowed, setAllowed] = useState(false)

  // loop timeline (fractions of LOOP): window in @0, dropdown opens @0.3,
  // pick policy @0.45, hit Allow @0.65, everything fades out @0.82
  useEffect(() => {
    const t = [
      setTimeout(() => setOpen(true), LOOP * 0.3),
      setTimeout(
        () => setPicked((p) => (p + 1) % POLICIES.length),
        LOOP * 0.45
      ),
      setTimeout(() => {
        setAllowed(true)
        setOpen(false)
      }, LOOP * 0.62),
      setTimeout(() => {
        setAllowed(false)
        setCycle((c) => c + 1)
      }, LOOP * 0.86),
    ]
    return () => t.forEach(clearTimeout)
  }, [cycle])

  const app = APPS[cycle % APPS.length]

  return (
    <div className="absolute z-20 mb-4 w-full max-w-60">
      <motion.div
        key={cycle}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: allowed ? 0.97 : 1,
          transition: { duration: 0.5, ease: EASE },
        }}
        exit={{ opacity: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        {/* title bar */}
        <div className="flex px-2.5 pb-0">
          <div className="flex gap-1 pt-2.5">
            <span className="block size-2 rounded-full bg-red-500" />
            <span className="block size-2 rounded-full bg-yellow-500" />
            <span className="block size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 mr-8 w-full text-center font-heading text-[10px] font-bold text-muted-foreground/50">
            CHECKPOINT
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4">
          {/* process */}
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={app.name}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-3 pb-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.icon}
                alt={app.name}
                className="size-8 shrink-0 rounded-lg object-contain"
              />
              <div>
                <p className="font-mono text-sm leading-tight">{app.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {DEST[cycle % DEST.length]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* policy dropdown */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-10 flex h-8 items-center justify-between rounded-lg border border-white/15 px-3 font-mono text-xs text-muted-foreground"
          >
            {POLICIES[picked]}
            <HugeiconsIcon
              icon={ChevronDownIcon}
              className={cn(
                "size-3.5 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
            <AnimatePresence>
              {open && (
                <motion.ul
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute inset-x-0 top-full z-20 mt-1 origin-top overflow-hidden rounded-lg border border-border bg-popover shadow-xl shadow-black/50"
                >
                  {POLICIES.map((pol, i) => (
                    <li
                      key={pol}
                      onClick={() => {
                        setPicked(i)
                        setOpen(false)
                      }}
                      className={cn(
                        "cursor-pointer px-3 py-1.5 text-start hover:bg-white/5",
                        i === picked && "bg-primary/10 text-primary"
                      )}
                    >
                      {pol}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </button>

          {/* remember me */}
          <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-muted-foreground">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded border transition-colors",
                picked === POLICIES.length - 1 || allowed
                  ? "border-primary bg-primary/20"
                  : "border-white/25"
              )}
            />
            Remember this choice
          </label>

          {/* action buttons */}
          <div className="flex gap-2">
            {[
              { label: "Allow", cls: "bg-emerald-500/90" },
              { label: "Direct", cls: "bg-yellow-500/90" },
              { label: "Block", cls: "bg-red-500/90" },
            ].map(({ label, cls }) => (
              <span
                key={label}
                className={cn(
                  "flex h-7 flex-1 items-center justify-center rounded-full font-mono text-[11px] font-medium transition-all duration-300",
                  label === "Allow"
                    ? cls + (allowed ? " ring-2 ring-emerald-400/60" : "")
                    : POLICIES[picked].startsWith(label)
                      ? cls + " brightness-125"
                      : cls + " opacity-40 grayscale"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
