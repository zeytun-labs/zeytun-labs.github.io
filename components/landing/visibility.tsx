import { AppRail, AppWindow, SectionHead } from "@/components/landing/chrome"
import { Icon } from "@/components/landing/icons"

const feats = [
  {
    title: "A ledger, not a graph",
    body: "Every socket your machine opens shows up as a row: the process that asked for it, the policy that matched, the destination, and the bytes in both directions.",
  },
  {
    title: "Streamed, never sampled",
    body: "Connection events arrive from the core over a local socket as they happen, so what you read is the current state rather than a five-second average.",
  },
  {
    title: "Search that keeps up",
    body: "Filter thousands of live rows by process, host, port, or policy while the capture keeps running underneath you.",
  },
]

const processes = [
  { name: "Firefox", initials: "FF", color: "#A3E635", count: "412" },
  { name: "Chrome", initials: "CH", color: "#60A5FA", count: "286" },
  { name: "Slack", initials: "SL", color: "#F59E0B", count: "94" },
  { name: "Spotify", initials: "SP", color: "#34D399", count: "61" },
  { name: "Docker", initials: "DK", color: "#818CF8", count: "38" },
]

const columns = [
  "",
  "age",
  "type",
  "process",
  "policy",
  "up",
  "down",
  "rtt",
  "destination",
]

const rows = [
  {
    age: "2s",
    type: "https",
    process: "Firefox",
    color: "#A3E635",
    policy: "relay-nl-01",
    up: "84 kB",
    down: "1.4 MB",
    rtt: "38 ms",
    destination: "cdn.example.com:443",
  },
  {
    age: "9s",
    type: "quic",
    process: "Chrome",
    color: "#60A5FA",
    policy: "direct",
    up: "12 kB",
    down: "246 kB",
    rtt: "11 ms",
    destination: "142.250.185.78:443",
  },
  {
    age: "14s",
    type: "dns",
    process: "resolver",
    color: "#BEF264",
    policy: "doh-quad9",
    up: "2 kB",
    down: "6 kB",
    rtt: "24 ms",
    destination: "dns.quad9.net:443",
  },
  {
    age: "31s",
    type: "tls",
    process: "Slack",
    color: "#F59E0B",
    policy: "relay-de-04",
    up: "96 kB",
    down: "512 kB",
    rtt: "46 ms",
    destination: "wss-primary.slack.com:443",
  },
  {
    age: "1m",
    type: "tcp",
    process: "ssh",
    color: "#94A3B8",
    policy: "direct",
    up: "1.1 MB",
    down: "8.4 MB",
    rtt: "3 ms",
    destination: "10.0.0.12:22",
  },
  {
    age: "4m",
    type: "https",
    process: "Spotify",
    color: "#34D399",
    policy: "relay-nl-01",
    up: "18 kB",
    down: "22.6 MB",
    rtt: "41 ms",
    destination: "audio-fa.scdn.co:443",
  },
  {
    age: "6m",
    type: "tls",
    process: "Docker",
    color: "#818CF8",
    policy: "block",
    up: "0 B",
    down: "0 B",
    rtt: "-",
    destination: "telemetry.docker.io:443",
  },
]

export function Visibility() {
  return (
    <section className="band" id="visibility">
      <div className="wrap">
        <SectionHead
          eyebrow="Live visibility"
          title="Watch every connection as it happens"
          lede="Most tools tell you how much traffic left your machine. Zeytun tells you which process sent it, where it went, and which rule let it through."
        />

        <ul className="feats feats--row">
          {feats.map((feat) => (
            <li key={feat.title} data-reveal>
              <Icon name="check" />
              <div>
                <b>{feat.title}</b>
                <p>{feat.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="appshot" data-reveal aria-hidden="true">
          <AppWindow title="Zeytun" subtitle="Traffic monitor">
            <AppRail active={0} />
            <div className="tmw">
              <div className="tmc">
                <div className="blk">
                  <h4>Processes</h4>
                  <div className="clients">
                    {processes.map((process, i) => (
                      <div
                        className={i === 0 ? "crow crow--on" : "crow"}
                        key={process.name}
                      >
                        <span
                          className="appico"
                          style={{ background: process.color }}
                        >
                          {process.initials}
                        </span>
                        <span className="row__name">{process.name}</span>
                        <i>{process.count}</i>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="blk">
                  <h4>Last 5 minutes</h4>
                  <div className="kv">
                    <span>Connections</span>
                    <b>1,284</b>
                  </div>
                  <div className="kv">
                    <span>Sent</span>
                    <b className="up">4.2 MB</b>
                  </div>
                  <div className="kv">
                    <span>Received</span>
                    <b className="dn">61.8 MB</b>
                  </div>
                  <div className="kv">
                    <span>Blocked</span>
                    <b>96</b>
                  </div>
                </div>
              </div>

              <div className="tmm">
                <div className="tool">
                  <span className="inp inp--grow">
                    <Icon name="search" />
                    <span>process:firefox OR port:443</span>
                  </span>
                  <span className="sel">
                    Last 5 min
                    <Icon name="chevron" />
                  </span>
                  <button className="iconbtn iconbtn--lime" tabIndex={-1}>
                    <Icon name="activity" />
                  </button>
                  <button className="iconbtn" tabIndex={-1}>
                    <Icon name="sliders" />
                  </button>
                </div>

                <div className="tmt">
                  <div className="tmhead">
                    {columns.map((column, i) => (
                      <span key={i}>{column}</span>
                    ))}
                  </div>
                  {rows.map((row) => (
                    <div className="trow" key={row.destination}>
                      <span className="dot" />
                      <span>{row.age}</span>
                      <span className="tchip">{row.type}</span>
                      <span className="cl">
                        <u style={{ background: row.color }} />
                        <span>{row.process}</span>
                      </span>
                      <span className="po">{row.policy}</span>
                      <span className="up">{row.up}</span>
                      <span className="dn">{row.down}</span>
                      <span>{row.rtt}</span>
                      <span className="url">{row.destination}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AppWindow>
        </div>
        <p className="mock-note">
          Interface preview: numbers are illustrative.
        </p>
      </div>
    </section>
  )
}
