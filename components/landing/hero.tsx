import { Section } from "../common/section"
import ParticleCanvas from "./particle-canvas"
import { Button } from "../ui/button"
import { AnimatedGradientText } from "../ui/animated-gradient-text"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { ShinyButton } from "../ui/shiny-button"

// const glance = [
//   {
//     label: "Live connections",
//     value: "1,284",
//     note: <>across 37 processes</>,
//   },
//   {
//     label: "Blocked today",
//     value: "96",
//     note: (
//       <>
//         12 processes · <em>7 rules</em>
//       </>
//     ),
//   },
//   {
//     label: "DNS queries",
//     value: "18.4k",
//     note: (
//       <>
//         <em>DoH</em> · 0 leaks
//       </>
//     ),
//   },
// ]

// const legs = [
//   { name: "local", width: "18%", value: "4 ms" },
//   { name: "relay", width: "62%", value: "26 ms" },
//   { name: "exit", width: "31%", value: "12 ms" },
// ]

export function Hero() {
  return (
    <Section
      className="hero relative h-[calc(100vh-60px)] max-h-188 max-w-none! overflow-hidden px-0 pt-[clamp(56px,8vw,112px)] pb-[clamp(52px,8vw,80px)]"
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
          <h1 className="mt-2 font-medium uppercase font-heading text-[clamp(46px,7.4vw,96px)] leading-[0.94] tracking-[-0.035em] ">
            See it. <em className="text-primary block not-italic">Route it.</em> Stop it.
          </h1>
          <p className="text-muted-foreground">
            Zeytun is a desktop network manager. Every connection your machine
            opens, attributed to the app that opened it — and yours to route,
            hold or refuse.
          </p>
          <div className="mt-2 flex gap-2">
            <ShinyButton>
              Join the waitlist
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                className="size-5.5!"
              />{" "}
            </ShinyButton>
            <Button
              variant={"outline"}
              className="h-auto! min-w-60.5 rounded-full px-10 py-5 text-lg! leading-tight font-medium text-muted-foreground! hover:text-foreground!"
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* <div className="glance" data-reveal>
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
        </div> */}

        {/* <div className="scrollcue" aria-hidden="true">
          <i />
          Scroll to explore
        </div> */}
      </div>
    </Section>
  )
}
