"use client"

import { useState, useEffect } from "react"
import type {
  ChangelogRelease,
  PlatformType,
  TimelineYear,
} from "@/data/changelog"
import { ChangelogSidebar } from "./changelog-sidebar"
import { ChangelogCard } from "./changelog-card"

export function ChangelogFeed({
  releases,
  timelineYears,
}: {
  releases: ChangelogRelease[]
  timelineYears: TimelineYear[]
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("all")
  const [activeMonthId, setActiveMonthId] = useState<string>(
    timelineYears[0]?.months[0]?.id || "m-11-2026"
  )

  // Filter releases by platform
  const filteredReleases = releases.filter((release) => {
    if (selectedPlatform === "all") return true
    return release.platforms.includes(
      selectedPlatform as "mac" | "windows" | "linux"
    )
  })

  // IntersectionObserver for scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveMonthId(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    )

    const monthElements = document.querySelectorAll("article[id]")
    monthElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [filteredReleases])

  return (
    <div
      data-selected-platform={selectedPlatform}
      className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14"
    >
      {/* Sidebar (Desktop sticky & Mobile tabs) */}
      <ChangelogSidebar
        timelineYears={timelineYears}
        activeMonthId={activeMonthId}
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
      />

      {/* Main timeline stream */}
      <main className="min-w-0 flex-1">
        {filteredReleases.length === 0 ? (
          <div className="flex animate-in flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm duration-300 fade-in">
            <p className="font-heading text-lg font-medium text-foreground">
              No releases found for this platform
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Binaries for this target are currently in testing or on the
              roadmap.
            </p>
            <button
              type="button"
              onClick={() => setSelectedPlatform("all")}
              className="mt-5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
            >
              Show all releases
            </button>
          </div>
        ) : (
          <div
            key={selectedPlatform}
            className="animate-in space-y-10 duration-300 fade-in slide-in-from-bottom-2 sm:space-y-12"
          >
            {filteredReleases.map((release) => (
              <ChangelogCard key={release.version} release={release} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
