import { Section } from "../common/section"
import ParticleCanvas from "./particle-canvas"
import { Button } from "../ui/button"
import { AnimatedGradientText } from "../ui/animated-gradient-text"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { ShinyButton } from "../ui/shiny-button"
import { DOWNLOAD_URL, SOURCE_URL } from "@/lib/site"

/**
 * Live-feel counters under the CTAs. Illustrative of a real session rather
 * than fetched — the strip exists to say "this is a running thing" before the
 * first mock appears.
 */
const stats = [
  { label: "Live connections", value: "1,284", note: "across 37 processes" },
  { label: "Blocked today", value: "96", note: "12 processes · 7 rules" },
  { label: "DNS queries", value: "18.4k", note: "DoH resolver" },
]

export function Hero() {
  return (
    <Section
      // The hero takes the whole viewport and no more — `min-h`, never `max-h`.
      // A height cap was clipping the particle field on tall displays: the
      // canvas is the hero box, so a hero shorter than the screen cuts the logo
      // mid-assembly. Tall screens are kept sane by the content band below
      // (`my-auto`), which centres the text instead of stretching it.
      // `-mx-6` cancels the page gutter so the field runs edge to edge.
      className="relative -mx-6 flex min-h-[calc(100svh-60px)] max-w-none! flex-col overflow-hidden px-0 pt-[clamp(56px,8vw,112px)] pb-[clamp(52px,8vw,80px)]"
      id="top"
    >
      <ParticleCanvas />
      <div className="relative z-4 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-8">
        {/* `my-auto` centres the copy in the leftover space and still leaves the
            scroll cue pinned to the bottom — so a tall display grows the empty
            band evenly above and below instead of stranding the text at the top,
            which is the reason the height cap existed in the first place. */}
        <div className="my-auto flex w-full min-w-0 flex-col gap-2 md:w-3/5">
          <AnimatedGradientText>
            <span
              className={cn(
                `inline animate-gradient bg-linear-to-r from-primary via-primary/40 to-primary bg-size-[var(--bg-size)_100%] bg-clip-text font-mono text-transparent`
              )}
            >
              Beta · macOS
            </span>
          </AnimatedGradientText>
          <h1 className="mt-2 font-heading text-[clamp(46px,7.4vw,96px)] leading-[0.94] font-medium tracking-[-0.035em] uppercase">
            See it. <em className="block text-primary not-italic">Route it.</em>{" "}
            Stop it.
          </h1>
          <p className="max-w-xl text-muted-foreground break-words">
            See the connections Zeytun handles, understand which app and destination they belong to, and choose how they are routed — directly, through a proxy, or to rejection.
          </p>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground/70 break-words">
            Capture depends on your network mode. App details may not be available for every connection.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <ShinyButton
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Download beta
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-5.5!" />
            </ShinyButton>
            <Button
              nativeButton={false}
              render={<a href="#model" />}
              variant="outline"
              className="h-auto! w-full sm:w-auto min-w-0 sm:min-w-60.5 rounded-full px-8 sm:px-10 py-5 text-lg! leading-tight font-medium text-muted-foreground! hover:text-foreground!"
            >
              See how it works
            </Button>
          </div>
          <div className="mt-3">
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Source on GitHub
            </a>
          </div>

          <div className="mt-10">
            <span className="font-mono text-[11px] tracking-wider text-muted-foreground/60 uppercase">
              Example session
            </span>
            <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-heading text-3xl leading-none">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 font-mono text-xs text-muted-foreground/70">
                    {stat.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <a
          href="#problem"
          className="hidden flex-col items-center gap-2 self-center font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground md:flex"
        >
          <span className="block h-8 w-px animate-pulse bg-linear-to-b from-transparent to-primary" />
          Scroll
        </a>
      </div>
    </Section>
  )
}
