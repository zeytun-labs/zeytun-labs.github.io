"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function ShinyButton({
  children,
  className = "",
  ...props
}: ShinyButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "shiny-cta group relative isolate cursor-pointer overflow-hidden outline-offset-4",
        "flex items-center justify-center",
        "rounded-full px-10 py-5 text-lg leading-tight font-medium",
        "border border-transparent text-foreground",
        "transition-all duration-1000 ease-out active:translate-y-px",
        className
      )}
    >
      <span className="z-10 flex items-center gap-2 text-nowrap text-lime-200 text-lg">
        {children}
      </span>
    </button>
  )
}
