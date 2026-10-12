import Link from "next/link"

import { Mark } from "@/components/landing/mark"
import { ISSUES_URL, SOURCE_URL, STAR_URL, SOCIAL_LINKS } from "@/lib/site"

const columns = [
  {
    title: "Explore",
    links: [
      { label: "How it works", href: "#model" },
      { label: "Features", href: "#features" },
      { label: "Community", href: "#community" },
      { label: "FAQ", href: "#faq" },
      { label: "Download", href: "#download" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: STAR_URL },
      { label: "View source", href: SOURCE_URL },
      { label: "Issues", href: ISSUES_URL },
      ...SOCIAL_LINKS.map((s) => ({ label: s.label, href: s.href })),
      { label: "Contact", href: "mailto:hi@zeytun.app" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link className="mb-4 flex items-center gap-2" href="/">
              <Mark className="size-6 text-primary" />
              <span className="translate-y-px font-kaine text-xl leading-none font-extrabold text-lime-100">
                Zeytun
              </span>
            </Link>
            <p className="mt-3 font-heading text-xl">
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
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
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

        <div className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
