
import { Mark } from "@/components/landing/icons"
import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Traffic Monitor", href: "#traffic" },
      { label: "Routing", href: "#routing" },
      { label: "Rules", href: "#rules" },
      { label: "DNS", href: "#dns" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "X", href: "#" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Telegram", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
]

export function SiteFooterNew() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link className="mb-4 flex items-center gap-2" href="/">
              <Mark className="size-6 text-primary" />
              <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
                Zeytun
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed mt-4">
              A desktop network manager for people who want to see and decide every connection.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-medium text-foreground">{column.title}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Zeytun. All rights reserved.</span>
          <span>zeytun-core is derived from sing-box and distributed under GPLv3. The Zeytun app is closed source.</span>
        </div>
      </div>
    </footer>
  )
}
