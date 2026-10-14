"use client"

import { useEffect, useRef } from "react"

import { useDemoActivity } from "@/hooks/use-demo-activity"

type Particle = {
  x: number
  y: number
  depth: number
  radius: number
  opacity: number
  phase: number
  light: boolean
}

/** Suspended dust with depth, carried by the direction and speed of scrolling. */
export function WorkspaceBackdrop() {
  const { ref, canAnimate, reducedMotion } = useDemoActivity<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const field = ref.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!field || !canvas || !context) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let lastTime = 0
    let lastScroll = window.scrollY
    let velocity = 0
    // Resolve the actual brand colors, including OKLCH theme tokens, once.
    const styles = getComputedStyle(field)
    const green = styles.color
    const light = styles.getPropertyValue("--color-lime-100").trim() || green

    const paint = (time: number, dt = 0) => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        const previousX = particle.x
        const previousY = particle.y
        // Scroll down carries the field up/right; scrolling up reverses it.
        // Inertia settles smoothly back to a very slow ambient drift.
        const dx = (2 + velocity * 0.1) * particle.depth * dt
        const dy = (-3 - velocity * 0.18) * particle.depth * dt
        particle.x += dx
        particle.y += dy
        const wrapped =
          particle.x < -12 ||
          particle.x > width + 12 ||
          particle.y < -12 ||
          particle.y > height + 12
        particle.x = ((particle.x + 12 + width + 24) % (width + 24)) - 12
        particle.y = ((particle.y + 12 + height + 24) % (height + 24)) - 12

        const bob = reducedMotion
          ? 0
          : Math.sin(time * 0.0004 + particle.phase) * 2
        context.fillStyle = particle.light ? light : green
        context.strokeStyle = context.fillStyle
        context.globalAlpha = particle.opacity

        // A short trail lends faster scrolls a sense of direction, without
        // turning the field into long streaks or overpowering the app.
        if (!wrapped && Math.abs(velocity) > 180 && dt > 0) {
          context.globalAlpha = particle.opacity * 0.35
          context.lineWidth = particle.radius * 0.7
          context.beginPath()
          context.moveTo(previousX, previousY + bob)
          context.lineTo(particle.x, particle.y + bob)
          context.stroke()
        }

        context.globalAlpha = particle.opacity
        context.beginPath()
        context.arc(
          particle.x,
          particle.y + bob,
          particle.radius,
          0,
          Math.PI * 2
        )
        context.fill()
        if (particle.depth > 0.8) {
          context.globalAlpha = particle.opacity * 0.08
          context.beginPath()
          context.arc(
            particle.x,
            particle.y + bob,
            particle.radius * 3,
            0,
            Math.PI * 2
          )
          context.fill()
        }
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      const bounds = field.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(
        180,
        Math.max(55, Math.round((width * height) / 5200))
      )
      particles = Array.from({ length: count }, () => {
        const depth = 0.25 + Math.random() * 0.75
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          radius: 0.45 + depth * 1.2,
          opacity: 0.16 + depth * 0.38,
          phase: Math.random() * Math.PI * 2,
          light: Math.random() > 0.68,
        }
      })
      paint(0)
    }

    const tick = (time: number) => {
      const elapsed = lastTime ? (time - lastTime) / 1000 : 1 / 60
      const dt = Math.min(elapsed, 0.05)
      const scroll = window.scrollY
      // Sampling the actual scroll position also follows Lenis smoothing,
      // keyboard navigation, touch scrolling, and the story's step buttons.
      const measured = (scroll - lastScroll) / Math.max(elapsed, 1 / 240)
      const target = Math.max(-1800, Math.min(1800, measured))
      velocity += (target - velocity) * (1 - Math.exp(-dt * 8))
      lastScroll = scroll
      lastTime = time
      paint(time, dt)
      frame = requestAnimationFrame(tick)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(field)
    if (canAnimate) frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [canAnimate, reducedMotion, ref])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-6 -inset-y-20 -z-10 text-primary sm:-inset-x-12 lg:-inset-x-24 lg:-inset-y-28"
    >
      <canvas
        ref={canvasRef}
        data-workspace-particles
        className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
      />
    </div>
  )
}
