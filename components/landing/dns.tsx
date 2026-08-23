import { SectionHead } from "@/components/landing/chrome"
import { Icon, type IconName } from "@/components/landing/icons"

const feats = [
  {
    title: "Encrypted on your terms",
    body: "Pick the transport per server: DNS over HTTPS, QUIC, TLS, or plain UDP. Queries leave the way you configured them, not the way the operating system felt like resolving them.",
  },
  {
    title: "Split resolution",
    body: "Send .lan to the router, work domains to the corporate resolver, and everything else to a public one. Rules are evaluated in order, top to bottom.",
  },
  {
    title: "Nothing resolves in the dark",
    body: "Every query is attributed to the process that asked for it, so a hard-coded resolver inside some app shows up in the log instead of quietly working.",
  },
]

const transports: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "lock",
    title: "DNS over HTTPS",
    body: "RFC 8484 with a pooled connection per server.",
  },
  {
    icon: "zap",
    title: "DNS over QUIC",
    body: "Fewer round trips when the resolver supports it.",
  },
  {
    icon: "shield",
    title: "DNS over TLS",
    body: "Classic port 853 for resolvers that speak it.",
  },
  {
    icon: "globe",
    title: "FakeIP",
    body: "Synthetic addresses so hostnames survive into routing.",
  },
  {
    icon: "list",
    title: "Hosts & mDNS",
    body: "Static answers and local discovery without editing files.",
  },
  {
    icon: "server",
    title: "Independent caches",
    body: "One resolver's answers never pollute another's.",
  },
]

const tabs = ["Servers", "Rules", "Cache", "Log"]

type Token = ["" | "c-key" | "c-val" | "c-dim", string]

const snippet: Token[][] = [
  [["c-dim", "// resolver policy, evaluated top to bottom"]],
  [["", "{"]],
  [
    ["c-key", '  "servers"'],
    ["", ": ["],
  ],
  [
    ["", "    { "],
    ["c-key", '"tag"'],
    ["", ": "],
    ["c-val", '"secure"'],
    ["", ", "],
    ["c-key", '"type"'],
    ["", ": "],
    ["c-val", '"https"'],
    ["", ","],
  ],
  [
    ["", "      "],
    ["c-key", '"server"'],
    ["", ": "],
    ["c-val", '"dns.quad9.net"'],
    ["", " },"],
  ],
  [
    ["", "    { "],
    ["c-key", '"tag"'],
    ["", ": "],
    ["c-val", '"lan"'],
    ["", ", "],
    ["c-key", '"type"'],
    ["", ": "],
    ["c-val", '"local"'],
    ["", " }"],
  ],
  [["", "  ],"]],
  [
    ["c-key", '  "rules"'],
    ["", ": ["],
  ],
  [
    ["", "    { "],
    ["c-key", '"rule_set"'],
    ["", ": "],
    ["c-val", '"ads"'],
    ["", ", "],
    ["c-key", '"action"'],
    ["", ": "],
    ["c-val", '"reject"'],
    ["", " },"],
  ],
  [
    ["", "    { "],
    ["c-key", '"domain_suffix"'],
    ["", ": "],
    ["c-val", '".lan"'],
    ["", ","],
  ],
  [
    ["", "      "],
    ["c-key", '"server"'],
    ["", ": "],
    ["c-val", '"lan"'],
    ["", " }"],
  ],
  [["", "  ],"]],
  [
    ["c-key", '  "strategy"'],
    ["", ": "],
    ["c-val", '"prefer_ipv4"'],
    ["", ","],
  ],
  [
    ["c-key", '  "independent_cache"'],
    ["", ": "],
    ["c-val", "true"],
  ],
  [["", "}"]],
]

export function Dns() {
  return (
    <section className="band" id="dns">
      <div className="wrap">
        <div className="split split--rev">
          <div className="split__copy">
            <SectionHead
              eyebrow="DNS control"
              title="Resolution is a decision, not a default"
              lede="DNS is where most privacy stories quietly fall apart. Zeytun treats it as part of the routing table."
            />
            <ul className="feats">
              {feats.map((feat) => (
                <li key={feat.title}>
                  <Icon name="globe" />
                  <div>
                    <b>{feat.title}</b>
                    <p>{feat.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <div className="seg seg--line" aria-hidden="true">
              {tabs.map((tab, i) => (
                <button
                  className={i === 1 ? "is-on" : undefined}
                  key={tab}
                  tabIndex={-1}
                >
                  {tab}
                </button>
              ))}
            </div>
            <p className="segcap">
              The app writes the same configuration you would write by hand -
              and shows it to you.
            </p>
            <div className="code">
              <pre>
                {snippet.map((line, i) => (
                  <span key={i}>
                    {line.map(([cls, text], j) => (
                      <span className={cls || undefined} key={j}>
                        {text}
                      </span>
                    ))}
                    {"\n"}
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid4">
          {transports.map((transport) => (
            <div className="mini" key={transport.title} data-reveal>
              <Icon name={transport.icon} />
              <b>{transport.title}</b>
              <p>{transport.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
