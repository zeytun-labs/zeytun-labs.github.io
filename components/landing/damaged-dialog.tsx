"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { AppleIcon } from "./apple-icon"

const COMMAND = "xattr -cr /Applications/Zeytun.app"

export function DamagedDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup className="relative w-full max-w-lg rounded-2xl border border-border/70 bg-card p-6 shadow-2xl transition-all duration-200 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
                  <AppleIcon className="size-4 text-foreground" />
                </div>
                <Dialog.Title className="font-heading text-lg font-medium tracking-tight text-foreground sm:text-xl">
                  macOS says &ldquo;damaged&rdquo;?
                </Dialog.Title>
              </div>
              <Dialog.Close
                aria-label="Close dialog"
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              </Dialog.Close>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Move Zeytun to Applications, then run this once in Terminal and
                open it again.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground/80">
                Only do this if you trust your download from the official Zeytun
                release. This clears the app’s extended attributes, including
                macOS quarantine.
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 font-mono text-xs sm:text-sm">
                <code className="select-all overflow-x-auto text-primary">
                  {COMMAND}
                </code>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy command to clipboard"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-sans text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                >
                  <HugeiconsIcon
                    icon={copied ? Tick02Icon : Copy01Icon}
                    className="size-3.5"
                  />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Use Copy, or select the command and copy it manually.
              </p>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
