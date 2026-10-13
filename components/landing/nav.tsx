"use client"

import { useEffect, useState } from "react"
import { Mark } from "@/components/landing/mark"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { DOWNLOAD_URL, STAR_URL } from "@/lib/site"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, GithubIcon } from "@hugeicons/core-free-icons"

export function Nav({ starsCount }: { starsCount?: number | null }) {
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
          "fixed inset-x-6 top-4 z-50 mx-auto max-w-2xl rounded-full border transition-all duration-300",
          stuck
            ? "border-border/60 bg-card/80 shadow-lg backdrop-blur-md"
            : "border-border/40 bg-card/40 shadow-sm backdrop-blur-sm"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 sm:py-2.5">
          <Link className="flex shrink-0 items-center gap-2" href="/">
            <Mark className="size-6 text-primary" />
            <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
              Zeytun
            </span>
          </Link>

          <div className="ms-auto flex shrink-0 items-center gap-2">
            {/* Star Button */}
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
                <span className="font-mono text-xs">
                  {starsCount.toLocaleString("en-US")}
                </span>
              )}
            </a>

            {/* Download Button */}
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}
