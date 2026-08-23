// import { AppRail, AppWindow, SectionHead } from "@/components/landing/chrome"
import { Icon } from "@/components/landing/icons"

const feats = [
  {
    title: "Outbounds bound to processes",
    body: "Send Firefox through a relay in Amsterdam, keep your package manager direct, and block a chatty updater: the rule follows the process, not a port number.",
  },
  {
    title: "Rules you can actually read",
    body: "Match on process path, domain suffix, geoip, IP range, port range, or a shared rule set. These are the same predicates the core evaluates, not an abstraction over them.",
  },
  {
    title: "Switch without dropping",
    body: "Change a policy and open sockets are re-evaluated in place. Only the connections that have to move actually move.",
  },
]

const protocols = [
  { name: "vless", on: true },
  { name: "vmess", on: false },
  { name: "trojan", on: false },
  { name: "hysteria2", on: true },
  { name: "tuic", on: false },
  { name: "shadowsocks", on: false },
  { name: "shadowtls", on: false },
  { name: "anytls", on: false },
  { name: "wireguard", on: true },
  { name: "ssh", on: false },
  { name: "socks", on: false },
  { name: "http", on: false },
  { name: "tor", on: false },
  { name: "tailscale", on: false },
]

const rows = [
  {
    name: "Firefox",
    initials: "FF",
    color: "#A3E635",
    policy: "relay-nl-01",
    rtt: "38 ms",
    on: true,
  },
  {
    name: "Chrome",
    initials: "CH",
    color: "#60A5FA",
    policy: "direct",
    rtt: "11 ms",
    on: false,
  },
  {
    name: "Slack",
    initials: "SL",
    color: "#F59E0B",
    policy: "relay-de-04",
    rtt: "46 ms",
    on: false,
  },
  {
    name: "Docker Desktop",
    initials: "DK",
    color: "#818CF8",
    policy: "block",
    rtt: "-",
    on: false,
  },
  {
    name: "Steam",
    initials: "ST",
    color: "#38BDF8",
    policy: "direct",
    rtt: "9 ms",
    on: false,
  },
  {
    name: "Telegram",
    initials: "TG",
    color: "#34D399",
    policy: "relay-nl-01",
    rtt: "40 ms",
    on: false,
  },
]

const tabs = ["By process", "By domain", "Rule sets"]

export function Routing() {
  return (
    <section className="band band--alt" id="routing">
      <div className="wrap">
        <div className="split">
          <div className="split__copy">
            {/* <SectionHead
              eyebrow="Per-process routing"
              title="One machine, many exits"
              lede="Your browser, your terminal, and your updater have nothing in common. Give each of them the path it deserves."
            /> */}
            <ul className="feats">
              {feats.map((feat) => (
                <li key={feat.title}>
                  <Icon name="route" />
                  <div>
                    <b>{feat.title}</b>
                    <p>{feat.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pills">
              {protocols.map((protocol) => (
                <span
                  className={protocol.on ? "pill pill--on" : "pill"}
                  key={protocol.name}
                >
                  {protocol.name}
                </span>
              ))}
            </div>
          </div>

          <div data-reveal aria-hidden="true">
            {/* <AppWindow title="Zeytun" subtitle="Routing"> */}
              {/* <AppRail active={1} /> */}
              <div className="app__main">
                <div className="seg">
                  {tabs.map((tab, i) => (
                    <button
                      className={i === 0 ? "is-on" : undefined}
                      key={tab}
                      tabIndex={-1}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="tool">
                  <span className="inp">
                    <Icon name="search" />
                    <span>Search processes</span>
                  </span>
                  <button className="iconbtn iconbtn--lime" tabIndex={-1}>
                    <Icon name="plus" />
                  </button>
                </div>
                <div className="rows">
                  {rows.map((row) => (
                    <div
                      className={row.on ? "row row--on" : "row"}
                      key={row.name}
                    >
                      <span
                        className="appico"
                        style={{ background: row.color }}
                      >
                        {row.initials}
                      </span>
                      <span className="row__name">{row.name}</span>
                      <span className="row__meta">
                        <span>
                          <b>{row.policy}</b>
                        </span>
                        <span>{row.rtt}</span>
                      </span>
                      <span className="kebab">···</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="app__side">
                <div className="side__hd">
                  <b>Firefox</b>
                  <Icon name="sliders" />
                </div>
                <div className="blk">
                  <h4>Policy</h4>
                  <div className="kv">
                    <span>Outbound</span>
                    <b>relay-nl-01</b>
                  </div>
                  <div className="kv">
                    <span>Network</span>
                    <b>tcp + udp</b>
                  </div>
                  <div className="kv">
                    <span>Fallback</span>
                    <b>block</b>
                  </div>
                </div>
                <div className="blk">
                  <h4>This session</h4>
                  <div className="kv">
                    <span>Sent</span>
                    <b className="up">84 kB</b>
                  </div>
                  <div className="kv">
                    <span>Received</span>
                    <b className="dn">1.4 MB</b>
                  </div>
                  <div className="kv">
                    <span>Connections</span>
                    <b>412</b>
                  </div>
                </div>
                <div className="blk">
                  <h4>Last endpoint</h4>
                  <div className="kv kv--stack">
                    <span>Destination</span>
                    <b>cdn.example.com:443</b>
                  </div>
                </div>
                <div className="pcard">
                  <span className="pcard__ico">
                    <Icon name="server" />
                  </span>
                  <span className="pcard__t">
                    <u>outbound</u>
                    <b>relay-nl-01</b>
                  </span>
                  <span className="pcard__e">
                    <span>rtt</span>
                    <b>38 ms</b>
                  </span>
                </div>
              </div>
            {/* </AppWindow> */}
          </div>
        </div>
      </div>
    </section>
  )
}
