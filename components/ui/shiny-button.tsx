"use client"

import type React from "react"
import { cn } from "@/lib/utils"

type BaseShinyButtonProps = {
  children: React.ReactNode
  className?: string
}

type ShinyButtonAsAnchor = BaseShinyButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type ShinyButtonAsButton = BaseShinyButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

export type ShinyButtonProps = ShinyButtonAsAnchor | ShinyButtonAsButton

export function ShinyButton({
  children,
  className = "",
  ...props
}: ShinyButtonProps) {
  const classes = cn(
    "shiny-cta group relative isolate cursor-pointer overflow-hidden outline-offset-4",
    "flex items-center justify-center",
    "rounded-full px-10 py-5 text-lg leading-tight font-medium",
    "border border-transparent text-foreground",
    "transition-all duration-1000 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
    className
  )
  const inner = (
    <span className="z-10 flex items-center gap-2 text-lg text-nowrap text-lime-200">
      {children}
    </span>
  )

  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorProps } = props
    return (
      <a href={href} className={classes} {...anchorProps}>
        {inner}
      </a>
    )
  }

  const { type = "button", ...buttonProps } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={type} {...buttonProps} className={classes}>
      {inner}
    </button>
  )
}
