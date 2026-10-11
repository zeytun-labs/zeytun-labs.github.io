"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function SmoothScroll() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | null = null
    let raf: number | null = null

    const start = () => {
      if (mediaQuery.matches) return
      lenis = new Lenis({ lerp: 0.1 })
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
      }
    }

    start()

    const onChange = () => {
      stop()
      start()
    }

    mediaQuery.addEventListener("change", onChange)

    return () => {
      mediaQuery.removeEventListener("change", onChange)
      stop()
    }
  }, [])

  return null
}
