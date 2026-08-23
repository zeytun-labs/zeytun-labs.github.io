// import { SectionHead } from "@/components/landing/chrome"
import { Icon, type IconName } from "@/components/landing/icons"

const feats = [
  {
    title: "Ask before the first packet",
    body: "When an unknown process reaches for the network, Zeytun holds the connection and asks. Nothing is sent while the prompt is open.",
  },
  {
    title: "Rules in order, always visible",
    body: "The rule list is the whole truth. Drag to reorder, toggle a rule off, and watch the next connection take a different path.",
  },
  {
    title: "A default you choose",
    body: "The final rule is yours: allow, block, or ask. There is no hidden fallback deciding on your behalf.",
  },
]

const head = ["", "match", "value", "policy", "note"]

const rules: {
  icon: IconName
  match: string
  value: string
  policy: string
  note: string
}[] = [
  {
    icon: "monitor",
    match: "process_name",
    value: "firefox",
    policy: "relay-nl-01",
    note: "browsing leaves through NL",
  },
  {
    icon: "globe",
    match: "domain_suffix",
    value: ".internal.corp",
    policy: "direct",
    note: "split tunnel for work",
  },
  {
    icon: "share",
    match: "geoip",
    value: "ir",
    policy: "direct",
    note: "local services stay local",
  },
  {
    icon: "sliders",
    match: "port_range",
    value: "6881-6889",
    policy: "block",
    note: "no peer-to-peer on this box",
  },
  {
    icon: "list",
    match: "rule_set",
    value: "ads-and-trackers",
    policy: "reject",
    note: "shared list, refreshed daily",
  },
]

export function Firewall() {
  return (
    <section className="band band--alt" id="firewall">
      <div className="wrap">
        <div className="split">
          <div className="split__copy">
            {/* <SectionHead
              eyebrow="Outbound firewall"
              title="Nothing leaves without a rule"
              lede="An inbound firewall protects you from the network. An outbound firewall protects the network from your machine: and that is where the interesting traffic is."
            /> */}
            <ul className="feats">
              {feats.map((feat) => (
                <li key={feat.title}>
                  <Icon name="shield" />
                  <div>
                    <b>{feat.title}</b>
                    <p>{feat.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal aria-hidden="true">
            <div className="ask">
              <div className="ask__hd">Connection request</div>
              <div className="ask__bd">
                <div className="ask__app">
                  <span className="appico" style={{ background: "#818CF8" }}>
                    DK
                  </span>
                  <div>
                    <b>Docker Desktop</b>
                    <p>/Applications/Docker.app · pid 4821</p>
                  </div>
                </div>
                <div className="ask__dest">
                  <span>destination</span>
                  <b>telemetry.docker.io:443</b>
                </div>
                <div className="ask__act">
                  <span>matched rule</span>
                  <span className="tchip tchip--final">final · ask</span>
                </div>
                <div className="ask__rem">
                  <span className="sw sw--lg" />
                  Remember this decision for Docker Desktop
                </div>
                <div className="ask__btns">
                  <button tabIndex={-1}>Block</button>
                  <button className="b-final" tabIndex={-1}>
                    Allow once
                  </button>
                  <button className="b-allow" tabIndex={-1}>
                    Allow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="appshot" data-reveal>
          <div className="rtable">
            <div className="rhead">
              {head.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
            {rules.map((rule) => (
              <div className="rrow" key={rule.match}>
                <span className="grip">
                  <Icon name="grip" />
                  <span className="sw" />
                </span>
                <span className="tchip">{rule.match}</span>
                <span className="rval">
                  <Icon name={rule.icon} />
                  <span>{rule.value}</span>
                </span>
                <span className="rpol">{rule.policy}</span>
                <span className="rcom">{rule.note}</span>
              </div>
            ))}
            <div className="rrow rrow--final">
              <span className="grip">
                <Icon name="grip" />
              </span>
              <span className="tchip tchip--final">final</span>
              <span className="rval">
                <Icon name="arrowRight" />
                <span>everything else</span>
              </span>
              <span className="rpol">ask</span>
              <span className="rcom">nothing leaves silently</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
