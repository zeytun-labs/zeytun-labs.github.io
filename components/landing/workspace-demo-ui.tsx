"use client"

import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Link04Icon,
  Touch06Icon,
  CursorMagicSelection01Icon,
  Cancel01Icon,
  InternetIcon,
  CheckIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { Policy, ProxyNode } from "./workspace-demo-data"

export function AppIcon({
  icon,
  className = "size-5",
}: {
  icon: ComponentProps<typeof HugeiconsIcon>["icon"]
  className?: string
}) {
  return <HugeiconsIcon icon={icon} className={cn("shrink-0", className)} />
}
export const APP_CONTROL =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
export const APP_INPUT =
  "h-9 w-full rounded-4xl border border-input bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"

// Native switch.svelte geometry, kept inside the preview theme.
export function AppSwitch({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex h-5 w-11 shrink-0 items-center rounded-full border-2 transition-colors",
        APP_CONTROL,
        checked ? "border-primary bg-primary" : "border-transparent bg-input/90"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-6 rounded-full shadow-sm transition-transform",
          checked
            ? "translate-x-4 bg-primary-foreground"
            : "translate-x-0 bg-foreground"
        )}
      />
    </button>
  )
}

export function AppMenuItem({
  children,
  icon,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ComponentProps<typeof HugeiconsIcon>["icon"]
}) {
  return (
    <button
      type="button"
      role="menuitem"
      {...props}
      className={cn(
        "flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-accent disabled:cursor-default disabled:opacity-40",
        APP_CONTROL,
        className
      )}
    >
      <AppIcon icon={icon} className="size-4" />
      {children}
    </button>
  )
}

export function AppContextMenu({
  anchor,
  onClose,
  children,
}: {
  anchor: { owner: HTMLElement; x: number; y: number }
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose()
    }
    const scroll = () => onClose()
    document.addEventListener("pointerdown", outside)
    document.addEventListener("scroll", scroll, true)
    ref.current
      ?.querySelector<HTMLElement>('[role="menuitem"]')
      ?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("scroll", scroll, true)
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [onClose])
  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label="Connection actions"
      style={{
        left: Math.max(8, Math.min(anchor.x, anchor.owner.offsetWidth - 264)),
        top: Math.max(8, Math.min(anchor.y, anchor.owner.offsetHeight - 84)),
      }}
      className="absolute z-[80] w-64 rounded-xl border border-border bg-popover p-1 shadow-xl"
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Tab") {
          event.preventDefault()
          event.stopPropagation()
          onClose()
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
          const items = [
            ...ref.current!.querySelectorAll<HTMLButtonElement>(
              '[role="menuitem"]'
            ),
          ]
          const current = items.indexOf(
            document.activeElement as HTMLButtonElement
          )
          items[
            (current + (event.key === "ArrowDown" ? 1 : items.length - 1)) %
              items.length
          ]?.focus({ preventScroll: true })
        }
      }}
    >
      {children}
    </div>,
    anchor.owner
  )
}

export function AppSelect({
  label,
  options,
  value,
  onChange,
  initial,
  className,
}: {
  label: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  initial?: string
  className?: string
}) {
  const [internal, setInternal] = useState(initial ?? options[0]?.value ?? "")
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<{
    owner: HTMLElement
    left: number
    top: number
    width: number
    maxHeight: number
  } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const selected = value ?? internal
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (
        !ref.current?.contains(event.target as Node) &&
        !list.current?.contains(event.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    const scroll = (event: Event) => {
      if (!list.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("scroll", scroll, true)
    list.current
      ?.querySelector<HTMLButtonElement>(
        '[role="option"][aria-selected="true"]'
      )
      ?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("scroll", scroll, true)
    }
  }, [open])
  const toggle = () => {
    const owner = trigger.current?.closest<HTMLElement>("[data-app-canvas]")
    if (!owner || !trigger.current) return
    const bounds = owner.getBoundingClientRect()
    const button = trigger.current.getBoundingClientRect()
    const scale = bounds.width / owner.offsetWidth
    const below = (bounds.bottom - button.bottom) / scale - 12
    const above = (button.top - bounds.top) / scale - 12
    const desired = Math.min(options.length * 32 + 10, 288)
    const upwards = below < desired && above > below
    const maxHeight = Math.min(desired, Math.max(64, upwards ? above : below))
    const width = button.width / scale
    setPlacement({
      owner,
      left: Math.max(
        8,
        Math.min(
          (button.left - bounds.left) / scale,
          owner.offsetWidth - width - 8
        )
      ),
      top: upwards
        ? (button.top - bounds.top) / scale - maxHeight - 4
        : (button.bottom - bounds.top) / scale + 4,
      width,
      maxHeight,
    })
    setOpen(!open)
  }
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation()
          setOpen(false)
          trigger.current?.focus()
        }
        if (event.key === "Tab" && open) {
          setOpen(false)
          trigger.current?.focus({ preventScroll: true })
        }
        if (open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault()
          const buttons = Array.from(
            list.current!.querySelectorAll<HTMLButtonElement>('[role="option"]')
          )
          const index = buttons.indexOf(
            document.activeElement as HTMLButtonElement
          )
          buttons[
            (index + (event.key === "ArrowDown" ? 1 : buttons.length - 1)) %
              buttons.length
          ]?.focus({ preventScroll: true })
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
            event.preventDefault()
            toggle()
          }
        }}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm",
          APP_CONTROL
        )}
      >
        <span className="truncate">
          {options.find((item) => item.value === selected)?.label ?? "Select"}
        </span>
        <AppIcon
          icon={UnfoldMoreIcon}
          className="size-4 text-muted-foreground"
        />
      </button>
      {open &&
        placement &&
        createPortal(
          <div
            ref={list}
            id={id}
            role="listbox"
            aria-label={label}
            style={{
              left: placement.left,
              top: placement.top,
              width: placement.width,
              maxHeight: placement.maxHeight,
            }}
            className="absolute z-[80] overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-1 shadow-xl"
          >
            {options.map((item) => (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={selected === item.value}
                onClick={() => {
                  setInternal(item.value)
                  onChange?.(item.value)
                  setOpen(false)
                  trigger.current?.focus({ preventScroll: true })
                }}
                className={cn(
                  "flex min-h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 text-left text-sm hover:bg-accent",
                  APP_CONTROL
                )}
              >
                {item.label}
                {selected === item.value && (
                  <AppIcon icon={CheckIcon} className="size-4" />
                )}
              </button>
            ))}
          </div>,
          placement.owner
        )}
    </div>
  )
}

// Visual classes ported from app's button.svelte, tabs-list.svelte and tabs-trigger.svelte.
export function AppButton({
  children,
  icon,
  primary,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
  icon?: ComponentProps<typeof HugeiconsIcon>["icon"]
  primary?: boolean
}) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-4xl border px-3 text-sm font-medium transition-colors",
        APP_CONTROL,
        primary
          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
          : "border-border bg-card/70 text-foreground hover:bg-input/30",
        !children && "size-9 p-0",
        className
      )}
    >
      {icon && <AppIcon icon={icon} className="size-4" />}
      {children}
    </button>
  )
}
export function AppTabs<T extends string>({
  items,
  value,
  onChange,
  label,
  equal,
  stretch,
  compact,
}: {
  items: {
    value: T
    label: string
    icon?: ComponentProps<typeof HugeiconsIcon>["icon"]
  }[]
  value: T
  onChange: (value: T) => void
  label: string
  equal?: boolean
  stretch?: boolean
  compact?: boolean
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 gap-1 rounded-full border border-border/40 bg-card/70",
        compact ? "h-7 p-0.5" : "h-9 p-1",
        stretch ? "w-full min-w-0" : "w-fit"
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.value}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          tabIndex={value === item.value ? 0 : -1}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            let target = index
            if (event.key === "ArrowRight") target = (index + 1) % items.length
            else if (event.key === "ArrowLeft")
              target = (index + items.length - 1) % items.length
            else if (event.key === "Home") target = 0
            else if (event.key === "End") target = items.length - 1
            else return
            event.preventDefault()
            onChange(items[target].value)
            refs.current[target]?.focus()
          }}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors",
            compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
            APP_CONTROL,
            equal && !stretch && "w-40",
            stretch && "min-w-0 flex-1 px-1",
            value === item.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {item.icon && <AppIcon icon={item.icon} className="size-4" />}
          {item.label}
        </button>
      ))}
    </div>
  )
}
export function ProxyCard({
  proxy,
  selected,
  testing,
  onClick,
  onContextMenu,
}: {
  proxy: ProxyNode
  selected: boolean
  testing: boolean
  onClick: () => void
  onContextMenu: ButtonHTMLAttributes<HTMLButtonElement>["onContextMenu"]
}) {
  return (
    <button
      type="button"
      aria-label={`Select ${proxy.name}`}
      aria-pressed={selected}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        "group flex min-h-28 w-full cursor-pointer flex-col justify-between rounded-4xl border p-4 text-left transition-colors",
        APP_CONTROL,
        selected
          ? "border-primary/30 bg-primary/10"
          : "border-border/40 bg-card/70 hover:border-border hover:bg-card"
      )}
    >
      <div className="flex w-full items-center gap-2">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground",
            selected ? "bg-lime-300/10" : "bg-muted"
          )}
        >
          {proxy.sequence ? (
            <AppIcon icon={Link04Icon} />
          ) : proxy.flag ? (
            <span className="text-[22px] leading-none">{proxy.flag}</span>
          ) : (
            <AppIcon icon={InternetIcon} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span>{proxy.protocol.toUpperCase()}</span>
            <span>—</span>
            <span className="max-w-30 truncate text-[11px]">
              {proxy.source}
            </span>
          </div>
          <div className="w-full truncate text-sm">{proxy.name}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {proxy.sequence
            ? proxy.sequence.join(" ➔ ")
            : `${proxy.address}:${proxy.port}`}
        </span>
        <span
          className={cn(
            "shrink-0 font-mono text-sm",
            testing ? "text-muted-foreground" : "text-lime-500"
          )}
        >
          {testing ? "testing..." : `${proxy.latency}ms`}
        </span>
      </div>
    </button>
  )
}
export function PolicyCard({
  policy,
  member,
  selected,
  count,
  onClick,
}: {
  policy: Policy
  member: string
  selected: boolean
  count: number
  onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select ${policy.name} policy`}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-28 w-full cursor-pointer flex-col justify-between rounded-4xl border p-4 text-left transition-colors",
        APP_CONTROL,
        selected
          ? "border-primary/30 bg-primary/10"
          : "border-border/40 bg-card/70 hover:border-border hover:bg-card"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground",
            selected ? "bg-lime-300/10" : "bg-muted"
          )}
        >
          <AppIcon
            icon={
              policy.kind === "auto" ? CursorMagicSelection01Icon : Touch06Icon
            }
          />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-xs text-muted-foreground uppercase">
            {policy.kind}
          </div>
          <div className="truncate text-sm">{policy.name}</div>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {policy.kind === "manual" ? member : `${count} members`}
      </span>
    </button>
  )
}
export function CellEnabled({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean
  onChange: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onChange()
      }}
      className={cn(
        "relative h-3.5 w-6 cursor-pointer rounded-full p-0.5 transition-colors",
        APP_CONTROL,
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "block size-2.5 rounded-full bg-background transition-transform",
          checked && "translate-x-2.5"
        )}
      />
    </button>
  )
}

export function AppModal({
  title,
  description,
  children,
  onClose,
  sheet,
}: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  sheet?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    if (!ref.current?.contains(previous)) {
      ref.current
        ?.querySelector<HTMLElement>(
          "button:not(:disabled), input:not(:disabled)"
        )
        ?.focus()
    }
    return () => {
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex bg-black/30 backdrop-blur-sm",
        sheet ? "justify-end" : "items-center justify-center p-4"
      )}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation()
            onClose()
          }
          if (event.key === "Tab") {
            const elements = ref.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input, select, [tabindex="0"]'
            )
            if (!elements?.length) return
            const first = elements[0]
            const last = elements[elements.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first.focus()
            }
          }
        }}
        className={cn(
          "relative flex w-[448px] flex-col bg-popover p-6 shadow-xl",
          sheet
            ? "h-full border-l border-border"
            : "max-h-full rounded-4xl ring-1 ring-foreground/10"
        )}
      >
        <button
          type="button"
          aria-label={`Close ${title}`}
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-4xl bg-secondary text-muted-foreground hover:bg-muted",
            APP_CONTROL
          )}
        >
          <AppIcon icon={Cancel01Icon} className="size-4" />
        </button>
        <h3 className="pr-8 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  )
}
