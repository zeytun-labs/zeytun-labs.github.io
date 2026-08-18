import { Eyebrow } from "@/components/landing/chrome"
import { Icon } from "@/components/landing/icons"
import { Section } from "../common/section"
import ParticleCanvas from "./particle-canvas"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { AnimatedGradientText } from "../ui/animated-gradient-text"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { ShinyButton } from "../ui/shiny-button"

const glance = [
  {
    label: "Live connections",
    value: "1,284",
    note: <>across 37 processes</>,
  },
  {
    label: "Blocked today",
    value: "96",
    note: (
      <>
        12 processes · <em>7 rules</em>
      </>
    ),
  },
  {
    label: "DNS queries",
    value: "18.4k",
    note: (
      <>
        <em>DoH</em> · 0 leaks
      </>
    ),
  },
]

const legs = [
  { name: "local", width: "18%", value: "4 ms" },
  { name: "relay", width: "62%", value: "26 ms" },
  { name: "exit", width: "31%", value: "12 ms" },
]

export function Hero() {
  return (
    <Section
      className="hero relative max-w-none! overflow-hidden px-0 pt-[clamp(56px,9vw,112px)] pb-[clamp(52px,6vw,80px)]"
      id="top"
    >
      <ParticleCanvas />
      <div className="relative z-4 mx-auto flex max-w-6xl flex-col px-8">
        <div className="flex w-1/2 flex-col gap-2">
          <AnimatedGradientText>
            <span
              className={cn(
                `inline animate-gradient bg-linear-to-r from-primary via-primary/40 to-primary bg-size-[var(--bg-size)_100%] bg-clip-text font-mono text-transparent`
              )}
            >
              Alpha v0.1 · macOS
            </span>
          </AnimatedGradientText>
          <h1 className="mt-2! font-medium! uppercase">
            See it. <em>Route it.</em> Stop it.
          </h1>
          <p className="text-muted-foreground">
            Zeytun is a desktop network manager. Every connection your machine
            opens, attributed to the app that opened it — and yours to route,
            hold or refuse.
          </p>
          <div className="mt-2 flex gap-2">
            <ShinyButton>
               Join the waitlist
              <HugeiconsIcon icon={ArrowRight02Icon} className="size-5.5!" />{" "}
            </ShinyButton>
            {/* <Button size={'lg'}>
              Join the waitlist
              <HugeiconsIcon icon={ArrowRight02Icon} />{" "}
            </Button>
            <Button size={'lg'} variant={"secondary"}>See how it works</Button> */}
            {/* <a className="btn btn--ghost" href="#visibility"></a> */}
          </div>
          <p className="hero__meta">
            <span>macOS · Windows · Linux</span>
            <span>Rust &amp; Go core</span>
            <span>No account required</span>
          </p>
        </div>

        <div className="glance" data-reveal>
          {glance.map((tile) => (
            <div className="gtile" key={tile.label}>
              <h4>{tile.label}</h4>
              <b>{tile.value}</b>
              <i>{tile.note}</i>
            </div>
          ))}
          <div className="hero__card gcard">
            <h3>Active route · handshake</h3>
            <div className="lat">
              <b>42</b>
              <i>ms round-trip</i>
            </div>
            <div className="legs">
              {legs.map((leg) => (
                <div className="leg" key={leg.name}>
                  <span>{leg.name}</span>
                  <div className="bar">
                    <i style={{ width: leg.width }} />
                  </div>
                  <b>{leg.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scrollcue" aria-hidden="true">
          <i />
          Scroll to explore
        </div>
      </div>
    </Section>
  )
}
