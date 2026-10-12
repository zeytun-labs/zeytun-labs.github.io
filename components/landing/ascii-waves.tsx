"use client"

import { useEffect, useRef } from "react"
import { useDemoActivity } from "@/hooks/use-demo-activity"

const GLYPHS = ".:+=*#@"
const FRAME_INTERVAL = 1000 / 18

export function AsciiWaves() {
  const { ref, canAnimate, reducedMotion } = useDemoActivity<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phase = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const field = ref.current
    const canvas = canvasRef.current
    const card = field?.closest<HTMLElement>("[data-download-card]")
    const context = canvas?.getContext("2d")
    if (!field || !canvas || !context || !card) return

    let width = 0
    let height = 0
    let frame = 0
    let lastDraw = 0
    let cursorX = 0
    let cursorY = 0
    const color = getComputedStyle(field).color

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = color
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
      context.textAlign = "center"
      context.textBaseline = "middle"

      const mobile = width < 768
      const time = phase.current

      // Mirrored flowing contours give both edges equal visual weight. The
      // middle fades out before the copy, rather than competing with it.
      for (let y = 6; y < height; y += 12) {
        for (let x = 4; x < width; x += 8) {
          const nx = (x / width - 0.5) * 2
          const ny = (y / height - 0.5) * 2
          const side = Math.abs(nx)
          const edgeWeight = Math.max(0, Math.min(1, (side - 0.22) / 0.54))
          const verticalFade = Math.sin((y / height) * Math.PI) ** 0.65
          const borderFade = Math.min(1, (1 - side) * 12)
          const distance = Math.hypot(nx - cursorX, ny - cursorY)
          const ripple =
            Math.sin(distance * 8 - time * 2) *
            Math.exp(-distance * 2) *
            Math.hypot(cursorX, cursorY) *
            0.25
          const surface =
            ny * 10 +
            Math.sin(side * 5 - time * 0.4) * 1.8 +
            Math.sin(ny * 3 + side * 4 + time * 0.3) * 0.9 +
            time * 0.65 +
            ripple
          const ridge = Math.exp(-(Math.sin(surface) ** 2) * 12)
          const texture = 0.5 + 0.5 * Math.sin(side * 14 + ny * 8 - time)
          const density = Math.min(1, ridge * 0.8 + texture * 0.15)
          const glyph = GLYPHS[Math.floor(density * (GLYPHS.length - 1))]
          context.globalAlpha =
            edgeWeight *
            verticalFade *
            borderFade *
            (0.05 + ridge * 0.43) *
            (mobile ? 0.6 : 1)
          if (context.globalAlpha < 0.015) continue
          context.fillText(glyph, x, y)
        }
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      const bounds = field.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion) return
      const bounds = card.getBoundingClientRect()
      pointer.current = {
        x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      }
    }
    const onLeave = () => {
      pointer.current = { x: 0, y: 0 }
    }
    const tick = (time: number) => {
      if (time - lastDraw >= FRAME_INTERVAL) {
        const elapsed = lastDraw ? Math.min(time - lastDraw, 100) : 0
        phase.current += elapsed * 0.0005
        cursorX += (pointer.current.x - cursorX) * 0.08
        cursorY += (pointer.current.y - cursorY) * 0.08
        lastDraw = time
        draw()
      }
      frame = requestAnimationFrame(tick)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(field)
    card.addEventListener("pointermove", onMove, { passive: true })
    card.addEventListener("pointerleave", onLeave, { passive: true })
    if (canAnimate) frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerleave", onLeave)
    }
  }, [canAnimate, reducedMotion, ref])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden text-primary"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}
