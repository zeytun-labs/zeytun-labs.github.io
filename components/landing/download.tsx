import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { Section, Title } from "../common/section"
import { ShinyButton } from "../ui/shiny-button"
import { DOWNLOAD_URL, ISSUES_URL, RELEASES_URL, SOURCE_URL } from "@/lib/site"

export function Download() {
  const isFallback = DOWNLOAD_URL === RELEASES_URL

  return (
    <Section className="max-w-4xl text-center" id="download">
      <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-10 md:p-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="size-64 rounded-full bg-primary/20 blur-[100px]" />
        </div>

        <div className="relative flex flex-col items-center">
          <Title>Beta · macOS</Title>
          <h2 className="mb-4 font-heading text-4xl tracking-tight md:text-5xl">
            Your network. Your rules.
          </h2>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            Try the Zeytun beta for macOS. Free and open source.
          </p>

          <div className="flex flex-col items-center gap-3">
            <ShinyButton
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download beta
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-5.5!" />
            </ShinyButton>
            {isFallback && (
              <p className="text-xs text-muted-foreground/80">
                Choose the macOS Apple Silicon DMG on GitHub Releases.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              View source
            </a>
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Report a bug
            </a>
          </div>

          <div className="mt-8 space-y-2">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              macOS · Apple Silicon · Beta software
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
