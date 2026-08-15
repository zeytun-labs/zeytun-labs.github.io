"use client"

import { useEffect, useState } from "react"

import { Mark } from "@/components/landing/icons"

const links = [
  { href: "#visibility", label: "Visibility" },
  { href: "#routing", label: "Routing" },
  { href: "#dns", label: "DNS" },
  { href: "#firewall", label: "Firewall" },
  { href: "#architecture", label: "Architecture" },
  { href: "#roadmap", label: "Roadmap" },
]

export function SiteNav() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={stuck ? "nav is-stuck" : "nav"}>
      <div className="nav__in">
        <a className="brand" href="#top">
          <Mark />
          <span className="brand__word">Zeytun</span>
        </a>
        <nav className="nav__links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__end">
          <span className="chip">Private beta</span>
          <a className="btn btn--primary btn--sm" href="#waitlist">
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  )
}
