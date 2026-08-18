"use client"
import React, { useEffect, useRef } from "react"

interface Particle {
  tx: number
  ty: number
  tz: number
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  k: number
  f: number
  s: number
  c: string
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const PATHS: string[] = [
      "M0 25C0 11.1929 11.1929 0 25 0C25 13.8071 13.8071 25 0 25Z",
      "M54 25C54 11.1929 42.8071 0 29 0C29 13.8071 40.1929 25 54 25Z",
      "M54 29C54 42.8071 42.8071 54 29 54C29 40.1929 40.1929 29 54 29Z",
      "M0 29C0 42.8071 11.1929 54 25 54C25 40.1929 13.8071 29 0 29Z",
    ]
    const COLORS: string[] = [
      "rgba(255,255,255,0.95)",
      "rgba(190,242,100,0.92)",
      "rgba(132,204,22,0.86)",
      "rgba(163,230,53,0.70)",
      "rgba(255,255,255,0.35)",
    ]

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const focal = 860
    let W = 0,
      H = 0,
      cx = 0,
      cy = 0,
      fieldAlpha = 1
    let pts: Particle[] = []
    const pointer = { x: 0, y: 0, active: false }
    let rotX = 0,
      rotY = 0,
      running = false,
      raf = 0
    let resizeTimeout: number = 0

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function size() {
      if (!canvas || !ctx) return
      const r = canvas.getBoundingClientRect()
      W = Math.max(320, r.width)
      H = Math.max(320, r.height)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function build() {
      size()
      const wide = W >= 1000
      cx = W * (wide ? 0.72 : 0.5)
      cy = H * (wide ? 0.5 : 0.5)
      fieldAlpha = wide ? 1 : 0.42
      const target = wide
        ? Math.min(560, Math.max(330, Math.min(W * 0.44, H * 0.9)))
        : Math.min(320, Math.max(200, Math.min(W * 0.72, H * 0.46)))

      const S = Math.round(target)
      const step = S > 420 ? 5 : 4

      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        S +
        '" height="' +
        S +
        '" viewBox="0 0 54 54">' +
        PATHS.map((d) => '<path d="' + d + '" fill="#ffffff"/>').join("") +
        "</svg>"

      const img = new Image()
      img.onload = () => {
        const off = document.createElement("canvas")
        off.width = S
        off.height = S
        const octx = off.getContext("2d")
        if (!octx) return

        octx.drawImage(img, 0, 0, S, S)
        let data: Uint8ClampedArray
        try {
          data = octx.getImageData(0, 0, S, S).data
        } catch {
          return
        }

        pts = []
        for (let y = 0; y < S; y += step) {
          for (let x = 0; x < S; x += step) {
            if (data[(y * S + x) * 4 + 3] > 128) {
              pts.push({
                tx: x - S / 2,
                ty: y - S / 2,
                tz: (Math.random() - 0.5) * 150,
                x: (Math.random() - 0.5) * 1600,
                y: (Math.random() - 0.5) * 1600,
                z: (Math.random() - 0.5) * 900,
                vx: 0,
                vy: 0,
                vz: 0,
                k: 0.018 + Math.random() * 0.03,
                f: 0.9 + Math.random() * 0.045,
                s: 0.9 + Math.random() * 1.5,
                c: COLORS[(Math.random() * COLORS.length) | 0],
              })
            }
          }
        }
        if (reduce) {
          still()
        } else {
          start()
        }
      }
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
    }

    function project(p: Particle): { x: number; y: number; s: number } {
      const sy = Math.sin(rotY),
        cyy = Math.cos(rotY)
      const sx = Math.sin(rotX),
        cxx = Math.cos(rotX)
      const x1 = p.x * cyy - p.z * sy
      const z1 = p.x * sy + p.z * cyy
      const y1 = p.y * cxx - z1 * sx
      const z2 = p.y * sx + z1 * cxx
      const sc = focal / (focal + z2)
      return { x: cx + x1 * sc, y: cy + y1 * sc, s: sc }
    }

    function paint() {
      if (!ctx) return
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        const q = project(p)
        if (q.s <= 0) continue
        const r = p.s * q.s
        if (r < 0.16) continue
        ctx.globalAlpha =
          Math.min(1, Math.max(0.06, (q.s - 0.45) * 1.5)) * fieldAlpha
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(q.x, q.y, r, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function still() {
      if (!ctx || !canvas) return
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x = p.tx
        p.y = p.ty
        p.z = p.tz
      }
      ctx.clearRect(0, 0, W, H)
      paint()
    }

    function frame() {
      if (!running || !ctx || !canvas) return
      ctx.fillStyle = "oklch(0.153 0.006 107.1)"
      // ctx.fillStyle = "rgba(7,8,7)"
      ctx.fillRect(0, 0, W, H)

      if (pointer.active) {
        rotY += ((pointer.x - cx) * 0.00035 - rotY) * 0.05
        rotX += ((pointer.y - cy) * -0.0003 - rotX) * 0.05
      } else {
        rotY += (0 - rotY) * 0.02
        rotX += (0 - rotX) * 0.02
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.vx += (p.tx - p.x) * p.k
        p.vy += (p.ty - p.y) * p.k
        p.vz += (p.tz - p.z) * p.k

        if (pointer.active) {
          const q = project(p)
          const dx = q.x - pointer.x,
            dy = q.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 12100 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const push = (1 - d / 110) * 3.4
            p.vx += (dx / d) * push
            p.vy += (dy / d) * push
          }
        }

        p.vx *= p.f
        p.vy *= p.f
        p.vz *= p.f
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
      }

      paint()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return
      const r = canvas.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom) {
        pointer.active = false
        return
      }
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(() => {
        stop()
        build()
      }, 220)
    }

    window.addEventListener("pointermove", handlePointerMove as EventListener, {
      passive: true,
    })
    window.addEventListener("pointerleave", handlePointerLeave)
    window.addEventListener("resize", handleResize)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    let observer: IntersectionObserver
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) start()
            else stop()
          })
        },
        { threshold: 0 }
      )
      observer.observe(canvas)
    }

    build()

    return () => {
      stop()
      clearTimeout(resizeTimeout)
      window.removeEventListener(
        "pointermove",
        handlePointerMove as EventListener
      )
      window.removeEventListener("pointerleave", handlePointerLeave)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-[calc(100vh-60px)] w-screen max-h-188"
      style={{
        width: "100vw",
        height: "calc(100vh-60px)",
        maxHeight: "752px",
        display: "block",
        backgroundColor: "transparent",
      }}
    />
  )
}

export default ParticleCanvas
