"use client"

import type React from "react"
import { cn } from "@/lib/utils"

type ShinyButtonProps = {
  children: React.ReactNode
  /** Render as a link instead of a button (same visuals). */
  href?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ShinyButton({
  children,
  className = "",
  href,
  ...props
}: ShinyButtonProps) {
  const classes = cn(
    "shiny-cta group relative isolate cursor-pointer overflow-hidden outline-offset-4",
    "flex items-center justify-center",
    "rounded-full px-10 py-5 text-lg leading-tight font-medium",
    "border border-transparent text-foreground",
    "transition-all duration-1000 ease-out active:translate-y-px",
    className
  )
  const inner = (
    <span className="z-10 flex items-center gap-2 text-lg text-nowrap text-lime-200">
      {children}
    </span>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <button {...props} className={classes}>
      {inner}
    </button>
  )
}
