"use client"

import { useEffect, useState } from "react"
import { Mark } from "@/components/landing/mark"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { DOWNLOAD_URL, STAR_URL } from "@/lib/site"
import { Star } from "lucide-react"

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
              aria-label="Star Zeytun on GitHub"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-foreground! hover:bg-muted/80 sm:h-8 sm:px-3 sm:text-sm"
              )}
            >
              <Star className="size-3.5 text-lime-400" />
              <span className="hidden sm:inline">Star on GitHub</span>
              {typeof starsCount === "number" && starsCount > 0 && (
                <span className="py-0.2 hidden rounded-full bg-muted px-1.5 font-mono text-[10px] text-muted-foreground md:inline">
                  {starsCount}
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
                "h-8 shrink-0 rounded-full px-3 text-xs font-medium text-primary-foreground! sm:h-8 sm:px-4 sm:text-sm"
              )}
            >
              <span className="hidden sm:inline">Download beta</span>
              <span className="sm:hidden">Download</span>
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}
