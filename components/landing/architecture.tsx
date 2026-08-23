import { SectionHead } from "@/components/landing/chrome"
import { Icon, type IconName } from "@/components/landing/icons"

const layers = [
  {
    tag: "L1",
    title: "Castle: the desktop app",
    body: "Svelte 5 inside Tauri. It renders state and sends intent; it never touches a packet.",
    core: false,
  },
  {
    tag: "L2",
    title: "zeytun-config",
    body: "A Rust library that turns share links and form input into validated outbound definitions.",
    core: false,
  },
  {
    tag: "L3",
    title: "zeytun-core",
    body: "A sing-box fork in Go. Owns the TUN device, the routing table, the DNS resolver, and the event stream.",
    core: true,
  },
  {
    tag: "L4",
    title: "Operating system",
    body: "TUN interface, process attribution, and the system proxy hand-off.",
    core: false,
  },
]

const cards: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "cpu",
    title: "The core does the work",
    body: "Routing, DNS, and every protocol implementation live in one daemon. The interface is a client of that daemon, so closing the window never changes your traffic.",
  },
  {
    icon: "code",
    title: "Configuration you can keep",
    body: "Everything the app sets up is plain JSON on disk. Read it, diff it, copy it to another machine, or check it into a repository.",
  },
  {
    icon: "lock",
    title: "No account, no telemetry",
    body: "Zeytun speaks to a local socket and to the destinations you configured. There is no third address in the list.",
  },
]

export function Architecture() {
  return (
    <section className="band" id="architecture">
      <div className="wrap">
        <div className="split">
          <div className="split__copy">
            <SectionHead
              eyebrow="Architecture"
              title="A thin interface over a serious engine"
              lede="Zeytun is three pieces with clear jobs. Each one is small enough to reason about, and the one that moves your packets is written for exactly that."
            />
          </div>

          <div className="stack" data-reveal>
            {layers.map((layer) => (
              <div
                className={layer.core ? "layer layer--core" : "layer"}
                key={layer.tag}
              >
                <u>{layer.tag}</u>
                <div>
                  <b>{layer.title}</b>
                  <p>{layer.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cards">
          {cards.map((card) => (
            <div className="card" key={card.title} data-reveal>
              <div className="card__ico">
                <Icon name={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
