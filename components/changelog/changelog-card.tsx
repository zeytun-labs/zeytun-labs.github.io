"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon,
  ArrowRight01Icon,
  GithubIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { AppleIcon } from "@/components/landing/apple-icon"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChangelogRelease } from "@/data/changelog"
import { useState } from "react"

export function ChangelogCard({
  release,
  isSingleView = false,
}: {
  release: ChangelogRelease
  isSingleView?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const monthId = `m-${release.month.toString().padStart(2, "0")}-${release.year}`

  const handleCopyLink = () => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}/changelog/${release.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article
      id={isSingleView ? undefined : monthId}
      className={cn(
        "relative",
        !isSingleView && "border-b border-border/30 pb-16 sm:pb-24"
      )}
    >
      <header>
        {/* Date */}
        <time
          dateTime={release.date}
          className="block font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          {release.displayDate}
        </time>

        {/* Release Headline */}
        <div className="mt-2.5">
          {isSingleView ? (
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {release.headline}
            </h1>
          ) : (
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary sm:text-4xl md:text-5xl">
              <Link href={`/changelog/${release.slug}`}>
                {release.headline}
              </Link>
            </h2>
          )}
        </div>

        {/* Platform & Version badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {release.platforms.map((plat) => (
            <span
              key={plat}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/20 px-3 py-1 font-mono text-xs text-foreground/90"
            >
              {plat === "mac" && (
                <AppleIcon className="size-3 text-foreground" />
              )}
              <span>
                {plat === "mac"
                  ? "macOS"
                  : plat === "windows"
                    ? "Windows"
                    : "Linux"}
              </span>
            </span>
          ))}

          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/20 px-3 py-1 font-mono text-xs text-foreground/90">
            {release.version}
          </span>

          {release.isLatest && (
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/15 px-3 py-1 font-mono text-xs font-medium text-primary">
              Latest
            </span>
          )}
        </div>
      </header>

      {/* Summary statement */}
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {release.summary}
      </p>

      {/* Feature items breakdown: 2-column open typography like Dia, NO BOXES */}
      {release.items.length > 0 && (
        <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {release.items.map((item, index) => (
            <li key={index} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {item.title}
                </h3>
                {item.tag && (
                  <span className="shrink-0 rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                    {item.tag}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
              {item.shippedBy && (
                <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                  Shipped by{" "}
                  <span className="font-sans font-medium text-foreground/80">
                    {item.shippedBy}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Footer action buttons: inline, lightweight */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/20 pt-6">
        <div className="flex flex-wrap items-center gap-2.5">
          {release.downloadUrl ? (
            <a
              href={release.downloadUrl}
              className={cn(
                buttonVariants({ size: "sm" }),
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-primary-foreground!"
              )}
            >
              <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
              <span>Download {release.assetName || "DMG"}</span>
            </a>
          ) : null}

          {!isSingleView && (
            <Link
              href={`/changelog/${release.slug}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-foreground! hover:bg-muted/80"
              )}
            >
              <span>Release details</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
            )}
            title="Copy link to release"
          >
            <HugeiconsIcon icon={Link01Icon} className="size-3.5" />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {release.githubReleaseUrl && (
          <a
            href={release.githubReleaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={GithubIcon} className="size-3.5" />
            <span>GitHub release</span>
          </a>
        )}
      </div>
    </article>
  )
}
