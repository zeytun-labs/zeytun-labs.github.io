"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import type { PlatformType, TimelineYear } from "@/data/changelog"

const PLATFORMS: { id: PlatformType; label: string }[] = [
  { id: "all", label: "All Platforms" },
  { id: "mac", label: "macOS" },
  { id: "windows", label: "Windows" },
  { id: "linux", label: "Linux" },
]

export function ChangelogSidebar({
  timelineYears,
  activeMonthId,
  selectedPlatform,
  onSelectPlatform,
}: {
  timelineYears: TimelineYear[]
  activeMonthId: string
  selectedPlatform: PlatformType
  onSelectPlatform: (platform: PlatformType) => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <aside
      aria-label="Changelog navigation"
      className="w-full lg:w-56 lg:shrink-0"
    >
      <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-8">
        {/* Platform filter tabs */}
        <div>
          <span className="block font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Platform
          </span>
          <div className="mt-2.5 flex flex-wrap gap-1.5 lg:flex-col">
            {PLATFORMS.map((plat) => {
              const active = selectedPlatform === plat.id
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => onSelectPlatform(plat.id)}
                  className={cn(
                    "relative flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "font-semibold text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="platform-active-pill"
                      className="absolute inset-0 rounded-xl bg-primary"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 350, damping: 30 }
                      }
                    />
                  )}
                  <span className="relative z-10">{plat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Timeline by Year & Month (Desktop) */}
        <div className="hidden lg:block">
          <span className="block font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Timeline
          </span>
          <div className="mt-3 flex flex-col gap-6">
            {timelineYears.map((yearGroup) => (
              <div key={yearGroup.year} className="flex flex-col gap-2">
                <span className="font-heading text-sm font-semibold tracking-tight text-foreground/80">
                  {yearGroup.year}
                </span>
                <nav
                  aria-label={`Releases in ${yearGroup.year}`}
                  className="flex flex-col gap-1 border-l border-border/40 pl-3"
                >
                  {yearGroup.months.map((m) => {
                    const isActive = activeMonthId === m.id
                    return (
                      <a
                        key={m.id}
                        href={`#${m.id}`}
                        className={cn(
                          "group flex items-center gap-2.5 py-1 text-xs transition-colors",
                          isActive
                            ? "font-medium text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "relative block size-1.5 rounded-full transition-all duration-200",
                            isActive
                              ? "scale-125 bg-primary shadow-[0_0_8px_rgba(180,245,60,0.8)]"
                              : "bg-border group-hover:bg-muted-foreground"
                          )}
                        />
                        <span>{m.monthName}</span>
                        <span className="ms-auto font-mono text-[10px] text-muted-foreground/60">
                          {m.releasesCount}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
