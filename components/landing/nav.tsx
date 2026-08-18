"use client"

import { useEffect, useState, useRef } from "react"

import { Mark } from "@/components/landing/icons"
import Link from "next/link"
import { Button } from "../ui/button"

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Nav() {
  const [stuck, setStuck] = useState(false)

  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={
        "sticky top-4 z-50 mx-auto max-w-2xl rounded-full border border-border/40 bg-card/70 shadow-sm backdrop-blur transition-all duration-300 md:w-2xl" +
        (stuck ? "" : "")
      }
    >
      <div className="flex px-3 py-3">
        <Link className="flex items-center gap-2 px-3" href="/">
          <Mark className="size-6 text-primary" />
          <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
            Zeytun
          </span>
        </Link>
        <nav
          ref={navRef}
          className="relative ms-auto! flex items-center gap-1"
          onMouseLeave={() => setBlobStyle((prev) => ({ ...prev, opacity: 0 }))}
        >
          <div
            className="absolute left-0 z-0 h-8 rounded-full bg-white/10 transition-all duration-300 ease-out"
            style={blobStyle}
          />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative z-10 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground! transition-colors hover:text-foreground!"
              onMouseEnter={(e) => {
                const el = e.currentTarget
                setBlobStyle({
                  left: el.offsetLeft,
                  width: el.offsetWidth,
                  opacity: 1,
                })
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button className="ms-2 text-primary-foreground!">
          Join the waitlist
        </Button>
      </div>
    </header>
  )
}
