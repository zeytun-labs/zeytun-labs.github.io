"use client"

import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | null = null
    let raf: number | null = null

    const start = () => {
      if (mediaQuery.matches) return
      lenis = new Lenis({ lerp: 0.1 })
      window.__lenis = lenis

      const loop = (t: number) => {
        lenis?.raf(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf)
        raf = null
      }
      if (lenis) {
        lenis.destroy()
        lenis = null
        delete window.__lenis
      }
    }

    start()

    const onAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (href?.startsWith("#") && href.length > 1 && href !== "#main-content") {
        const id = href.slice(1)
        const targetElement =
          document.getElementById(id) ||
          (() => {
            try {
              return document.querySelector(href)
            } catch {
              return null
            }
          })()
        if (targetElement) {
          e.preventDefault()
          if (lenis) {
            lenis.scrollTo(targetElement as HTMLElement, {
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            })
          } else {
            targetElement.scrollIntoView({ behavior: "smooth" })
          }
          history.pushState(null, "", href)
        }
      }
    }

    document.addEventListener("click", onAnchorClick)

    const onChange = () => {
      stop()
      start()
    }

    mediaQuery.addEventListener("change", onChange)

    return () => {
      document.removeEventListener("click", onAnchorClick)
      mediaQuery.removeEventListener("change", onChange)
      stop()
    }
  }, [])

  return null
}
