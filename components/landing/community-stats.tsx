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
import { ArrowUpRight, Code2, Download, ExternalLink } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerTerminal01Icon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons"
import { AppleIcon } from "./apple-icon"
import { DownloadLink } from "./download-link"

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
        <div data-reveal className={`${card} col-span-2 min-h-72 p-6 sm:p-8`}>
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
              <DownloadLink className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                <span>Download</span>
                <Download className="size-3.5" aria-hidden="true" />
              </DownloadLink>
            </div>
            <div className="my-8 sm:my-10">
              <p className="font-heading text-6xl leading-none tracking-[-0.04em] tabular-nums sm:text-7xl">
                {downloadCount}
              </p>
              <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                DMG downloads
              </p>
            </div>
            <div className="mt-auto border-t border-border/50 pt-4">
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
            </div>
          </div>
        </div>
        <div
          data-reveal
          className={`${card} col-span-2 flex min-h-48 flex-col justify-between gap-5 p-5 [--reveal-delay:60ms] sm:col-span-1 sm:p-7`}
        >
          <h3 className="text-sm text-muted-foreground">Platforms</h3>
          <div className="flex items-center gap-3">
            <AppleIcon className="size-5 text-primary" />
            <div className="min-w-0">
              <p className="font-heading text-lg leading-tight">macOS</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Apple Silicon
              </p>
            </div>
            <DownloadLink className="ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1.5 text-[10px] text-primary transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-primary">
              {DOWNLOAD_URL ? (
                <>
                  <Download className="size-3" aria-hidden="true" />
                  Download
                </>
              ) : (
                "Coming soon"
              )}
            </DownloadLink>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 text-muted-foreground/60">
            {[
              { label: "Windows", icon: WindowsNewIcon },
              { label: "Linux", icon: ComputerTerminal01Icon },
            ].map((platform) => (
              <div key={platform.label}>
                <p className="flex items-center gap-2 text-xs">
                  <HugeiconsIcon
                    icon={platform.icon}
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {platform.label}
                </p>
                <p className="mt-2 font-mono text-[10px]">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
        <a
          data-reveal
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${card} group col-span-2 flex min-h-48 flex-col justify-between p-5 transition-colors [--reveal-delay:120ms] hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-primary sm:col-span-1 sm:p-7`}
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
        <div
          data-reveal
          className="col-span-2 [--reveal-delay:100ms] lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1"
        >
          <StarHistoryChart
            history={stats.history}
            starsCount={stats.stars.value}
          />
        </div>
      </div>
      <div
        data-reveal
        className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] text-muted-foreground/60"
      >
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
