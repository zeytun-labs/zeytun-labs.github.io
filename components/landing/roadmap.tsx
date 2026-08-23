// import { SectionHead } from "@/components/landing/chrome"

const phases = [
  {
    number: "phase 01",
    state: "in progress",
    title: "Take control",
    now: true,
    items: [
      "Live per-connection traffic monitor",
      "Per-process outbound routing",
      "DNS with DoH, DoQ, DoT and FakeIP",
      "Ask-on-connect prompts with remembered decisions",
    ],
  },
  {
    number: "phase 02",
    state: "next",
    title: "Make it fit your day",
    now: false,
    items: [
      "Subscriptions and shared rule sets",
      "Profiles that follow the network you join",
      "Per-rule bandwidth ceilings",
      "Windows and Linux tray parity",
    ],
  },
  {
    number: "phase 03",
    state: "later",
    title: "Open it up",
    now: false,
    items: [
      "Scriptable policies for unusual cases",
      "Connection export for offline analysis",
      "A CLI that speaks to the same daemon",
      "Team rule sets with review history",
    ],
  },
]

export function Roadmap() {
  return (
    <section className="band band--alt" id="roadmap">
      <div className="wrap">
        {/* <SectionHead
          eyebrow="Roadmap"
          title="Built in the open, in order"
          lede="Visibility first, then control, then everything that makes control comfortable. Here is the sequence."
        /> */}

        <div className="phases">
          {phases.map((phase) => (
            <div
              className={phase.now ? "phase phase--now" : "phase"}
              key={phase.number}
              data-reveal
            >
              <div className="phase__n">
                <span>{phase.number}</span>
                <span>{phase.state}</span>
              </div>
              <h3>{phase.title}</h3>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
