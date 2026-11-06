"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mark } from "@/components/landing/mark"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { STAR_URL } from "@/lib/site"
import { DownloadLink } from "@/components/landing/download-link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon,
  GithubIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export function ChangelogNav({
  starsCount,
  currentVersion,
}: {
  starsCount?: number | null
  currentVersion?: string
}) {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="h-[50px] sm:h-[54px]">
      <header
        className={cn(
          "fixed inset-x-6 top-4 z-50 mx-auto max-w-4xl rounded-full border transition-all duration-300",
          stuck
            ? "border-border/60 bg-card/85 shadow-lg backdrop-blur-md"
            : "border-border/40 bg-card/45 shadow-sm backdrop-blur-sm"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 sm:py-2.5">
          <div className="flex items-center gap-3">
            <Link className="flex shrink-0 items-center gap-2" href="/">
              <Mark className="size-6 text-primary" />
              <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
                Zeytun
              </span>
            </Link>

            <span className="text-border/60">/</span>

            <Link
              href="/changelog"
              className={cn(
                "text-xs font-medium tracking-wide transition-colors sm:text-sm",
                currentVersion
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-foreground"
              )}
            >
              Changelog
            </Link>

            {currentVersion && (
              <>
                <span className="text-border/60">/</span>
                <span className="font-mono text-xs text-primary sm:text-sm">
                  {currentVersion}
                </span>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
              )}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              <span>Back home</span>
            </Link>

            {/* GitHub Stars */}
            <a
              href={STAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-foreground! hover:bg-muted/80 sm:h-8 sm:px-3 sm:text-sm"
              )}
            >
              <HugeiconsIcon icon={GithubIcon} className="size-4" />
              {typeof starsCount === "number" && (
                <span className="text-xs">
                  {starsCount.toLocaleString("en-US")} Stars
                </span>
              )}
            </a>

            {/* Download Button */}
            <DownloadLink
              className={cn(
                buttonVariants({ size: "sm" }),
                "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-primary-foreground! sm:h-8 sm:px-4 sm:text-sm"
              )}
            >
              <span>Download</span>
              <HugeiconsIcon
                icon={Download01Icon}
                className="size-4"
                strokeWidth={2}
              />
            </DownloadLink>
          </div>
        </div>
      </header>
    </div>
  )
}
