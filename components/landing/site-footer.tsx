import { Mark } from "@/components/landing/icons"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Live visibility", href: "#visibility" },
      { label: "Per-process routing", href: "#routing" },
      { label: "DNS control", href: "#dns" },
      { label: "Outbound firewall", href: "#firewall" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "zeytun-app", href: "https://github.com/sadeqi-ah/zeytun-app" },
      {
        label: "zeytun-core",
        href: "https://github.com/sadeqi-ah/zeytun-core",
      },
      {
        label: "zeytun-config",
        href: "https://github.com/sadeqi-ah/zeytun-config",
      },
      { label: "Architecture", href: "#architecture" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/sadeqi-ah" },
      {
        label: "Third-party notices",
        href: "https://github.com/sadeqi-ah/zeytun-core/blob/main/NOTICE.md",
      },
      {
        label: "License",
        href: "https://github.com/sadeqi-ah/zeytun-core/blob/main/LICENSE",
      },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="brand">
              <Mark />
              <span className="brand__word">Zeytun</span>
            </div>
            <p>
              A desktop network manager for people who would rather read the
              rule than trust the default.
            </p>
          </div>

          {columns.map((column) => (
            <div className="fcol" key={column.title}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__bot">
          <span>© {new Date().getFullYear()} Zeytun</span>
          <span>Core derived from sing-box · GPLv3</span>
          <span>Built for people who read their logs</span>
        </div>
      </div>
    </footer>
  )
}
