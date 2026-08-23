import type { ReactNode } from "react"

import { Icon, Mark } from "@/components/landing/icons"

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
}) {
  return (
    <div className="hd" data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="h2">{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  )
}

/** Traffic-light dots + title bar shared by every app screenshot mock. */
export function AppWindow({
  title,
  subtitle,
  small,
  children,
}: {
  title: string
  subtitle?: string
  small?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={small ? "app app--sm" : "app"}
      style={{
        background: "rgba(18, 18, 18, 0.4)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 40px 90px -40px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        className="app__bar"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          background: "transparent",
        }}
      >
        <div className="dots flex gap-2" aria-hidden="true">
          <i style={{ background: "#ff5f56", width: 12, height: 12 }} />
          <i style={{ background: "#ffbd2e", width: 12, height: 12 }} />
          <i style={{ background: "#27c93f", width: 12, height: 12 }} />
        </div>
        <div className="app__title" style={{ opacity: 0.8 }}>
          <b>{title}</b>
          {subtitle ? (
            <span style={{ opacity: 0.6 }}>: {subtitle}</span>
          ) : null}
        </div>
        <div className="app__end">
          <span className="bell">
            <Icon name="bell" />
            <u style={{ background: "var(--primary)", border: "none" }}>3</u>
          </span>
          <span className="tgl tgl--on !border-primary/30 !bg-primary/20 text-primary">
            System proxy
          </span>
          <span className="core !text-primary">
            <Icon name="cpu" />
            core online
          </span>
        </div>
      </div>
      <div className="app__body">{children}</div>
    </div>
  )
}

/** Left icon rail of the desktop app. */
export function AppRail({ active = 0 }: { active?: number }) {
  const items = ["activity", "route", "globe", "shield", "list"] as const

  return (
    <div
      className="rail"
      aria-hidden="true"
      style={{
        background: "rgba(0, 0, 0, 0.15)",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "16px 0",
        margin: "8px 0 8px 8px",
        borderRadius: "14px",
      }}
    >
      <div
        className="rail__logo"
        style={{
          background: "var(--primary)",
          boxShadow: "0 0 12px var(--primary)",
        }}
      >
        <Mark className="" />
      </div>
      {items.map((name, i) => (
        <b
          key={name}
          className={i === active ? "on" : undefined}
          style={
            i === active
              ? {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "var(--foreground)",
                  borderRadius: "10px",
                }
              : { opacity: 0.5 }
          }
        >
          <Icon name={name} />
        </b>
      ))}
      <span className="sp" />
      <span
        className="av"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-foreground))",
          color: "black",
        }}
      >
        A
      </span>
    </div>
  )
}
