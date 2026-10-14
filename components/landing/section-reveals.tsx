"use client"

import { useEffect } from "react"

/** Progressive enhancement: content stays visible without JavaScript. */
export function SectionReveals() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (preference.matches || typeof IntersectionObserver === "undefined")
      return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const element = entry.target as HTMLElement
          element.dataset.revealState = "visible"
          observer.unobserve(element)
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    )

    elements.forEach((element) => {
      element.dataset.revealState = "pending"
      observer.observe(element)
    })

    const finish = (event: AnimationEvent) => {
      if (event.animationName !== "section-reveal") return
      const element = event.target as HTMLElement
      // Remove the animation's transform so fixed overlays and sticky scenes
      // retain their normal containing blocks after the entrance.
      delete element.dataset.revealState
    }
    const onFocus = (event: FocusEvent) => {
      let element = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-reveal]"
      )
      while (element) {
        observer.unobserve(element)
        delete element.dataset.revealState
        element = element.parentElement?.closest("[data-reveal]") ?? null
      }
    }
    const showAll = () => {
      if (!preference.matches) return
      observer.disconnect()
      elements.forEach((element) => delete element.dataset.revealState)
    }

    document.addEventListener("animationend", finish)
    document.addEventListener("focusin", onFocus)
    preference.addEventListener("change", showAll)
    return () => {
      observer.disconnect()
      elements.forEach((element) => delete element.dataset.revealState)
      document.removeEventListener("animationend", finish)
      document.removeEventListener("focusin", onFocus)
      preference.removeEventListener("change", showAll)
    }
  }, [])

  return null
}
