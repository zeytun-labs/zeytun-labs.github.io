"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const TOP = 96
const stickyTop = () => (window.innerWidth < 1024 ? 80 : TOP)
export function useWorkspaceStory(reducedMotion: boolean, stepCount: number) {
  const root = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ step: 0, complete: false, revision: 0 })
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      if (!root.current || !card.current) return
      const height = card.current.offsetHeight
      const top = stickyTop()
      const travel = window.innerHeight * Math.max(1.15, stepCount * 0.32)
      root.current.style.minHeight = `${height + travel}px`
      // A short viewport uses normal flow instead of clipping the scene.
      const fits = height + top + 4 <= window.innerHeight
      card.current.style.position = fits ? "sticky" : "relative"
      card.current.style.top = fits ? `${top}px` : "0px"
      const progress = Math.max(
        0,
        Math.min(1, (top - root.current.getBoundingClientRect().top) / travel)
      )
      const next = {
        step: Math.min(stepCount - 1, Math.floor(progress * stepCount)),
        complete: progress >= 0.995,
      }
      setState((previous) =>
        previous.step === next.step && previous.complete === next.complete
          ? previous
          : {
              ...next,
              revision:
                previous.revision + (previous.step === next.step ? 0 : 1),
            }
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    if (card.current) observer.observe(card.current)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [stepCount])
  const goToStep = useCallback(
    (step: number) => {
      if (!root.current) return
      const start =
        root.current.getBoundingClientRect().top + window.scrollY - stickyTop()
      const fraction = step === 0 ? 0 : (step + 0.15) / stepCount
      window.scrollTo({
        top:
          start +
          window.innerHeight * Math.max(1.15, stepCount * 0.32) * fraction,
        behavior: reducedMotion ? "instant" : "smooth",
      })
    },
    [reducedMotion, stepCount]
  )
  return { root, card, ...state, goToStep }
}
