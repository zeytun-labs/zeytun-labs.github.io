import { Section } from "../common/section"
import ParticleCanvas from "./particle-canvas"
import { Button } from "../ui/button"
import { AnimatedGradientText } from "../ui/animated-gradient-text"
import { cn } from "@/lib/utils"
import { ShinyButton } from "../ui/shiny-button"
import { DOWNLOAD_URL, SOURCE_URL } from "@/lib/site"
import { AppleIcon } from "./apple-icon"
import { HugeiconsIcon } from "@hugeicons/react"
import { BetaIcon } from "@hugeicons/core-free-icons"

export function Hero() {
  return (
    <Section
      className="relative -mx-6 flex min-h-[calc(100svh-60px)] max-w-none! flex-col overflow-hidden px-0 pt-[clamp(56px,8vw,112px)] pb-[clamp(52px,8vw,80px)]"
      id="top"
    >
      <ParticleCanvas />
      <div className="relative z-4 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-8">
        <div className="my-auto flex w-full min-w-0 flex-col gap-2 md:w-3/5">
          <AnimatedGradientText className="gap-1.5">
            <HugeiconsIcon
              icon={BetaIcon}
              className="size-3.5 text-primary"
              strokeWidth={2}
            />
            <span
              className={cn(
                `inline animate-gradient bg-linear-to-r from-primary via-primary/40 to-primary bg-size-[var(--bg-size)_100%] bg-clip-text font-mono text-transparent`
              )}
            >
              Public Beta
            </span>
          </AnimatedGradientText>
          <h1 className="mt-2 font-heading text-[clamp(46px,7.4vw,96px)] leading-[0.94] font-medium tracking-[-0.035em] uppercase">
            See it. <em className="block text-primary not-italic">Route it.</em>{" "}
            Stop it.
          </h1>
          <p className="max-w-xl text-lg break-words text-muted-foreground">
            A free, open-source network manager for macOS. Inspect app
            connections, choose their routes, and decide what gets through.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ShinyButton
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <AppleIcon className="size-5" />
              Download for Mac
            </ShinyButton>
            <Button
              nativeButton={false}
              render={<a href="#model" />}
              variant="outline"
              className="h-auto! w-full min-w-0 rounded-full px-8 py-5 text-lg! leading-tight font-medium text-muted-foreground! hover:text-foreground! sm:w-auto sm:min-w-60.5 sm:px-10"
            >
              See it in action
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-x-3 gap-y-1.5 sm:flex-row sm:items-center">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80">
              <AppleIcon className="size-3.5" />
              macOS · Apple Silicon
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline">·</span>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Source on GitHub
            </a>
          </div>
        </div>

        <a
          href="#model"
          className="hidden flex-col items-center gap-2 self-center font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground md:flex"
        >
          <span className="block h-8 w-px animate-pulse bg-linear-to-b from-transparent to-primary" />
          Scroll
        </a>
      </div>
    </Section>
  )
}
