import Link from "next/link"
import {
  GithubIcon,
  NewTwitterIcon,
  TelegramIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Mark } from "@/components/landing/mark"
import { LICENSE_URL, RELEASES_URL, STAR_URL } from "@/lib/site"

const productLinks = [
  { label: "Release Notes", href: RELEASES_URL },
  {
    label: "Changelog",
    href: `${STAR_URL}/commits/main/`,
  },
]

const connectLinks = [
  {
    label: "GitHub",
    href: "https://github.com/zeytun-labs",
    icon: GithubIcon,
  },
  {
    label: "X",
    href: "https://x.com/ZeytunHQ",
    icon: NewTwitterIcon,
  },
  {
    label: "Telegram",
    href: "https://t.me/ZeytunHQ",
    icon: TelegramIcon,
  },
]

const resourceLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Security", href: "/security" },
]

const linkClassName =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div data-reveal>
      <h4 className="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-5">
          <div data-reveal className="col-span-2">
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
              Network visibility and routing for macOS.
            </p>
          </div>

          <FooterColumn title="Product">
            {productLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Connect">
            {connectLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>
                  <span className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={link.icon} className="size-4" />
                    {link.label}
                  </span>
                </FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources">
            {resourceLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div
          data-reveal
          className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <span>© 2026 Zeytun.</span>
          <span className="max-w-lg sm:text-end">
            Licensed under{" "}
            <a
              href={LICENSE_URL}
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
