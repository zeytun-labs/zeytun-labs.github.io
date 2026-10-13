"use client"

import { useState } from "react"
import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const FAQ_ITEMS = [
  {
    q: "Is Zeytun free?",
    a: "Yes. Zeytun is free to download and use.",
  },
  {
    q: "Which operating systems are supported?",
    a: "Currently macOS with Apple Silicon. Support for Intel Macs, Windows, and Linux is planned for future releases.",
  },
  {
    q: "Does it include a VPN subscription?",
    a: "No. Zeytun manages your connections and routing; it does not provide a VPN service.",
  },
  {
    q: "Does it see every connection?",
    a: "Zeytun shows traffic captured by your selected network mode. What appears depends on how apps send traffic, and app details may not be available for every connection.",
  },
  {
    q: "What happens if I ignore a connection prompt?",
    a: "When the prompt times out, Zeytun uses your configured final route. The connection may be allowed or blocked, depending on that route.",
  },
  {
    q: "Why might macOS ask for permission?",
    a: "TUN mode creates a virtual network interface and requires administrator permission.",
  },
]

export function Faq() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (q: string) => {
    setOpenItems((prev) => ({ ...prev, [q]: !prev[q] }))
  }

  return (
    <Section id="faq" className="max-w-3xl">
      <SectionHead
        eyebrow="FAQ"
        title="A few things before you start."
        lede="Compatibility, connection prompts, and setup."
      />

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = !!openItems[item.q]
          return (
            <div
              key={item.q}
              className={cn(
                "rounded-2xl border border-border/40 p-4 transition-colors hover:border-border/60",
                isOpen ? "border-border/60 bg-card/70" : "bg-card/40"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.q)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer list-none items-center justify-between rounded-lg text-left text-base font-medium text-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
                    isOpen && "rotate-180 text-foreground"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.2, ease: "easeOut" },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 border-t border-border/30 pt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
