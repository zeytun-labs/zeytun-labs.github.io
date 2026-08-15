"use client"

import { useEffect, useRef } from "react"

type Node = { x: number; y: number; vx: number; vy: number; r: number }

const DENSITY = 1 / 15000 // nodes per css pixel²
const MAX_NODES = 90
const LINK_DIST = 132

/**
 * The drifting connection graph behind the hero. It is purely decorative: the
 * canvas is `pointer-events:none` and `aria-hidden`, and it renders a single
 * static frame when the visitor prefers reduced motion.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let nodes: Node[] = []
    let width = 0
    let height = 0
    let frame = 0

    const seed = () => {
      const target = Math.min(MAX_NODES, Math.round(width * height * DENSITY))

      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.9 + Math.random() * 1.5,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()

      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)

          if (dist > LINK_DIST) continue

          ctx.strokeStyle = `rgba(132,204,22,${0.16 * (1 - dist / LINK_DIST)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        ctx.fillStyle = "rgba(163,230,53,.5)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      }

      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reduced.matches) draw()
      else frame = requestAnimationFrame(step)
    }

    const onResize = () => {
      resize()
      start()
    }

    resize()
    start()

    window.addEventListener("resize", onResize)
    reduced.addEventListener("change", start)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      reduced.removeEventListener("change", start)
    }
  }, [])

  return <canvas id="field" ref={ref} aria-hidden="true" />
}
