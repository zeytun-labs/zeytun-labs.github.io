"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

// Third-party taps must be trusted once since Homebrew 6.
const COMMAND =
  "brew tap zeytun-labs/tap && brew trust zeytun-labs/tap && brew install --cask zeytun"

export function BrewInstall() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable; the command stays selectable.
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground">
        or install with{" "}
        <a
          href="https://github.com/zeytun-labs/homebrew-tap"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Homebrew
        </a>
      </p>
      <div className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-background/70 py-2 ps-3.5 pe-2 font-mono text-xs backdrop-blur-sm">
        <code className="min-w-0 flex-1 overflow-x-auto text-start whitespace-nowrap text-primary select-all">
          {COMMAND}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy Homebrew install command"}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="inline-flex"
            >
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                className="size-3.5"
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
