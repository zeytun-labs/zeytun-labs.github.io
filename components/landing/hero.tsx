import { Eyebrow } from "@/components/landing/chrome"
import { HeroField } from "@/components/landing/hero-field"
import { Icon } from "@/components/landing/icons"

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
    <section className="hero" id="top">
      <HeroField />
      <div className="hero__veil" />
      <div className="wrap">
        <div className="hero__grid">
          <Eyebrow>Desktop network manager</Eyebrow>
          <h1>
            See every connection.
            <em>Decide what leaves.</em>
          </h1>
          <p className="hero__sub">
            Zeytun watches every connection your machine makes, routes traffic
            per process, and hands you full control of DNS — so nothing reaches
            the network without a rule you wrote.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#waitlist">
              Join the waitlist
              <Icon name="arrowRight" />
            </a>
            <a className="btn btn--ghost" href="#visibility">
              See how it works
            </a>
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
    </section>
  )
}
