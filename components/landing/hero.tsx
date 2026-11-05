"use client"

import { useState } from "react"
import { Section } from "../common/section"
import ParticleCanvas from "./particle-canvas"
import { Button } from "../ui/button"
import { AnimatedGradientText } from "../ui/animated-gradient-text"
import { cn } from "@/lib/utils"
import { SOURCE_URL } from "@/lib/site"
import { DownloadButton } from "./download-button"
import { DamagedDialog } from "./damaged-dialog"

export function Hero() {
  const [damagedOpen, setDamagedOpen] = useState(false)

  return (
    <Section
      className="relative -mx-6 flex min-h-[calc(100svh-60px)] max-w-none! flex-col overflow-hidden px-0 pt-[clamp(56px,8vw,112px)] pb-[clamp(52px,8vw,80px)]"
      id="top"
    >
      <ParticleCanvas />
      <div className="relative z-4 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-8">
        <div className="my-auto flex w-full min-w-0 flex-col gap-2 md:w-3/5">
          <div data-reveal>
            <AnimatedGradientText className="gap-1.5">
              <span className="text-xs" aria-hidden="true">
                ✨
              </span>
              <span
                className={cn(
                  `inline animate-gradient bg-linear-to-r from-primary via-primary/40 to-primary bg-size-[var(--bg-size)_100%] bg-clip-text font-mono text-transparent`
                )}
              >
                Public Beta
              </span>
            </AnimatedGradientText>
          </div>
          <h1
            data-reveal
            className="mt-2 font-heading text-[clamp(46px,7.4vw,96px)] leading-[0.94] font-medium tracking-[-0.035em] uppercase [--reveal-delay:60ms]"
          >
            See it. <em className="block text-primary not-italic">Route it.</em>{" "}
            Stop it.
          </h1>
          <p
            data-reveal
            className="max-w-xl text-lg break-words text-muted-foreground [--reveal-delay:120ms]"
          >
            A free, open-source network manager for macOS. Inspect app
            connections, choose their routes, and decide what gets through.
          </p>
          <div
            data-reveal
            className="mt-3 flex flex-wrap gap-2 [--reveal-delay:180ms]"
          >
            <DownloadButton className="w-full sm:w-auto" />
            <Button
              nativeButton={false}
              render={<a href="#model" />}
              onClick={(e) => {
                const target = document.getElementById("model")
                if (target) {
                  e.preventDefault()
                  if (window.__lenis) {
                    window.__lenis.scrollTo(target, {
                      duration: 1.2,
                      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    })
                  } else {
                    target.scrollIntoView({ behavior: "smooth" })
                  }
                  history.pushState(null, "", "#model")
                }
              }}
              variant="outline"
              className="h-auto! w-full min-w-0 rounded-full px-8 py-5 text-lg! leading-tight font-medium text-muted-foreground! hover:text-foreground! sm:w-auto sm:min-w-60.5 sm:px-10"
            >
              See it in action
            </Button>
          </div>
          <div
            data-reveal
            className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 [--reveal-delay:220ms]"
          >
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Source on GitHub
            </a>
            <span className="text-muted-foreground/40">·</span>
            <button
              type="button"
              onClick={() => setDamagedOpen(true)}
              className="w-fit cursor-pointer text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Says &ldquo;damaged&rdquo;?
            </button>
          </div>
        </div>

        <DamagedDialog open={damagedOpen} onOpenChange={setDamagedOpen} />
      </div>
    </Section>
  )
}
