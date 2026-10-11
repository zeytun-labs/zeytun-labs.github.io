import Link from "next/link"

import { Mark } from "@/components/landing/mark"
import { ISSUES_URL, SOURCE_URL } from "@/lib/site"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Traffic Monitor", href: "#traffic" },
      { label: "Process", href: "#process" },
      { label: "Checkpoint", href: "#checkpoint" },
      { label: "Rules", href: "#rules" },
      { label: "Policies", href: "#policy" },
      { label: "DNS", href: "#dns" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Roadmap", href: "#roadmap" },
      { label: "Download", href: "#download" },
      { label: "Support", href: "mailto:hi@zeytun.app" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: SOURCE_URL },
      { label: "Issues", href: ISSUES_URL },
      { label: "Contact", href: "mailto:hi@zeytun.app" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-42 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link className="mb-4 flex items-center gap-2" href="/">
              <Mark className="size-6 text-primary" />
              <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
                Zeytun
              </span>
            </Link>
            <p className="mt-4 font-heading text-xl">
              See it. Route it. Stop it.
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A free, open-source network manager for macOS, with connection
              visibility and routing controls.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Zeytun. All rights reserved.</span>
          <span className="max-w-lg sm:text-end">
            Zeytun is free and open source under{" "}
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              GPL-3.0
            </a>
            . <code className="font-mono">zeytun-core</code> is derived from
            sing-box.
          </span>
        </div>
      </div>
    </footer>
  )
}
