"use client"

import { useEffect } from "react"

/**
 * Adds `.is-in` to every `[data-reveal]` element as it scrolls into view.
 * A single observer for the whole page keeps sections as server components.
 */
export function Reveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    )

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          entry.target.classList.add("is-in")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )

    for (const target of targets) observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return null
}
