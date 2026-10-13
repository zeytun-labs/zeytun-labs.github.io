import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { StarHistoryChart } from "./star-history-chart"
import { formatCount, formatDate, type GithubStats } from "@/lib/github-stats"
import {
  DOWNLOAD_URL,
  RELEASES_URL,
  SOURCE_URL,
  SOCIAL_LINKS,
} from "@/lib/site"
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react"
import { AppleIcon } from "./apple-icon"

export function CommunityStats({ stats }: { stats: GithubStats }) {
  const updateDates = [
    stats.stars.updatedAt,
    stats.downloads.updatedAt,
    stats.history.updatedAt,
  ]
    .filter(
      (value): value is string =>
        value !== null && Number.isFinite(Date.parse(value))
    )
    .sort()
  const updatedAt = updateDates[0]
  const downloads = stats.downloads.value
  const downloadCount =
    downloads !== null && Number.isFinite(downloads)
      ? downloads.toLocaleString("en-US")
      : formatCount(null)
  const card =
    "relative overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-card/60 to-card/15"

  return (
    <Section id="community">
      <SectionHead
        eyebrow="Community"
        title="Built in the open."
        lede="Follow development on GitHub, share feedback, or contribute a change."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className={`${card} col-span-2 min-h-72 p-6 sm:p-8`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent)] [background-size:48px_48px] opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-12 size-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                Downloads
              </h3>
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span>Download</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="my-8 sm:my-10">
              <p className="font-heading text-6xl leading-none tracking-[-0.04em] tabular-nums sm:text-7xl">
                {downloadCount}
              </p>
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <AppleIcon className="size-3 text-primary" />
                macOS DMG downloads
              </p>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
                  Source
                </p>
                <a
                  href={RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                >
                  GitHub releases{" "}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
                  Platform
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <AppleIcon className="size-3.5" />
                  macOS · Apple Silicon
                </p>
              </div>
            </div>
          </div>
        </div>
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${card} group flex min-h-48 flex-col justify-between p-5 transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-primary sm:p-7`}
        >
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-2">
              <AppleIcon className="size-4 shrink-0 text-primary" />
              For your Mac
            </span>
            <ArrowUpRight
              className="hidden size-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 sm:block"
              aria-hidden="true"
            />
          </div>
          <div className="mt-8">
            <h3 className="font-heading text-4xl leading-none tracking-tight sm:text-5xl">
              Beta
            </h3>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground sm:text-xs">
              Apple Silicon
            </p>
          </div>
        </a>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${card} group flex min-h-48 flex-col justify-between p-5 transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-primary sm:p-7`}
        >
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-2">
              <Code2 className="size-4 shrink-0" aria-hidden="true" />
              Open source
            </span>
            <ArrowUpRight
              className="hidden size-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 sm:block"
              aria-hidden="true"
            />
          </div>
          <div className="mt-8">
            <h3 className="font-heading text-2xl leading-none tracking-tight sm:text-4xl">
              GPL‑3.0
            </h3>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground sm:text-xs">
              Browse the code & contribute
            </p>
          </div>
        </a>
        <div className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <StarHistoryChart
            history={stats.history}
            starsCount={stats.stars.value}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] text-muted-foreground/60">
        <p className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full bg-primary/60"
            aria-hidden="true"
          />
          GitHub snapshot
          {updatedAt
            ? ` · Updated ${formatDate(updatedAt)}`
            : " · Stats unavailable"}
        </p>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            {link.label}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        ))}
      </div>
    </Section>
  )
}
