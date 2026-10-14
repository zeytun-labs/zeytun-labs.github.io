import Link from "next/link"

import { Mark } from "@/components/landing/mark"
import { SiteFooter } from "@/components/landing/site-footer"

export function ResourcePage({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mark className="size-6 text-primary" />
            <span className="font-kaine text-xl font-extrabold text-lime-100">
              Zeytun
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </header>

        <main id="main-content" className="mx-auto max-w-3xl py-16 sm:py-24">
          <p className="mb-4 font-mono text-xs tracking-wider text-primary uppercase">
            Resources
          </p>
          <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
          <div className="mt-12 space-y-10 text-sm leading-7 text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground">
            {children}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
