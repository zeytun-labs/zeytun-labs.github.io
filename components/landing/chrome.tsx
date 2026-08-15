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
    <div className={small ? "app app--sm" : "app"}>
      <div className="app__bar">
        <div className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="app__title">
          <b>{title}</b>
          {subtitle ? ` — ${subtitle}` : null}
        </div>
        <div className="app__end">
          <span className="bell">
            <Icon name="bell" />
            <u>3</u>
          </span>
          <span className="tgl tgl--on">System proxy</span>
          <span className="core">
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
    <div className="rail" aria-hidden="true">
      <div className="rail__logo">
        <Mark className="" />
      </div>
      {items.map((name, i) => (
        <b key={name} className={i === active ? "on" : undefined}>
          <Icon name={name} />
        </b>
      ))}
      <span className="sp" />
      <span className="av">A</span>
    </div>
  )
}
