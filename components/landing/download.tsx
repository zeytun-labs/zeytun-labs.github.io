import { Section } from "../common/section"
import { DownloadButton } from "./download-button"
import { DOWNLOAD_URL, ISSUES_URL, SOURCE_URL } from "@/lib/site"
import { AsciiWaves } from "./ascii-waves"
import { AppleIcon } from "./apple-icon"

export function Download() {
  return (
    <Section className="text-center" id="download">
      <div
        data-download-card
        className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-10 md:p-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 isolate z-0 flex items-center justify-center"
        >
          <AsciiWaves />
          <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--background)_10%,transparent_75%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2
            data-reveal
            className="mb-4 font-heading text-4xl tracking-tight md:text-5xl"
          >
            Your network. Your rules.
          </h2>
          <p
            data-reveal
            className="mb-8 max-w-lg text-lg text-muted-foreground [--reveal-delay:120ms]"
          >
            Try it with your apps and share your feedback.
          </p>

          <div
            data-reveal
            className="flex flex-col items-center gap-3 [--reveal-delay:160ms]"
          >
            <DownloadButton />
            <p className="flex items-center justify-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              <AppleIcon className="size-3.5" />
              {DOWNLOAD_URL
                ? "Apple Silicon"
                : "Apple Silicon · Coming soon"}
            </p>
          </div>

          <div
            data-reveal
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm [--reveal-delay:200ms]"
          >
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
        </div>
      </div>
    </Section>
  )
}
