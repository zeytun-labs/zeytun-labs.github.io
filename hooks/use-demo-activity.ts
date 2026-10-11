"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot() {
  return false
}

export function useDemoActivity<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    let isIntersecting = false
    let isVisible = document.visibilityState === "visible"

    const update = () => {
      const active = isIntersecting && isVisible && !reducedMotion
      setCanAnimate(active)
    }

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible"
      update()
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== "undefined" && ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting
          update()
        },
        { threshold: 0 }
      )
      observer.observe(ref.current)
    } else {
      isIntersecting = true
      update()
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      observer?.disconnect()
    }
  }, [reducedMotion])

  return { ref, canAnimate, reducedMotion }
}
