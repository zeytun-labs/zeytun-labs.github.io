"use client"

import { useState } from "react"
import { ListXIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import {
  AppTabs,
  AppButton,
  AppModal,
  AppIcon,
  APP_INPUT,
  APP_CONTROL,
} from "./workspace-demo-ui"
import { ProcessAppIcon } from "./workspace-process"
import {
  DEMO_PROCESSES,
  formatBytes,
  outboundLabel,
  connectionHostRule,
  type DemoConnection,
  type RuleDraft,
} from "./workspace-activity-data"
import type { DemoProfile } from "./workspace-demo-data"
import { cn } from "@/lib/utils"

const COLUMNS = [
  "Status",
  "Network",
  "Start",
  "Client",
  "Policy",
  "Up",
  "Down",
  "Duration",
  "URL",
]
export function WorkspaceTraffic({
  connections,
  profile,
  onClear,
  onInspect,
  onAddRule,
}: {
  connections: DemoConnection[]
  profile: DemoProfile
  onClear: () => void
  onInspect: (connection: DemoConnection) => void
  onAddRule: (draft: RuleDraft) => void
}) {
  const [tab, setTab] = useState("recent")
  const [groupBy, setGroupBy] = useState("client")
  const [group, setGroup] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [columns, setColumns] = useState(COLUMNS)
  const [columnMenu, setColumnMenu] = useState(false)
  const [context, setContext] = useState<DemoConnection | null>(null)
  const rows = connections.filter(
    (item) => tab === "recent" || item.status === "active"
  )
  const keyOf = (item: DemoConnection) =>
    groupBy === "client" ? item.process : item.host
  const groups = [...new Set(rows.map(keyOf))]
    .map((name) => ({
      name,
      count: rows.filter((item) => keyOf(item) === name).length,
    }))
    .sort((a, b) => b.count - a.count)
  const filtered = rows.filter(
    (item) =>
      (!group || keyOf(item) === group) &&
      `${item.process} ${item.host} ${item.address}`
        .toLowerCase()
        .includes(search.toLowerCase())
  )
  const display = (item: DemoConnection, column: string) => {
    switch (column) {
      case "Status":
        return (
          <span
            className={cn(
              "block size-2 rounded-full",
              item.status === "active" ? "bg-primary" : "bg-muted-foreground/50"
            )}
            title={item.status}
          >
            <span className="sr-only">{item.status}</span>
          </span>
        )
      case "Network":
        return (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {item.network}
          </span>
        )
      case "Start":
        return item.start
      case "Client":
        return (
          <span className="flex items-center gap-2">
            <ProcessAppIcon name={item.process} size={20} />
            {item.process}
          </span>
        )
      case "Policy":
        return outboundLabel(profile, item.policy)
      case "Up":
        return formatBytes(item.up)
      case "Down":
        return formatBytes(item.down)
      case "Duration":
        return item.duration
      default:
        return (
          <span className="block max-w-40 truncate" title={item.host}>
            {item.host}
          </span>
        )
    }
  }
  return (
    <div className="flex gap-4">
      <aside
        aria-label="Connection groups"
        className="flex h-[596px] w-64 shrink-0 flex-col overflow-hidden rounded-4xl border border-border/40 bg-card/70"
      >
        <div className="border-b border-border/40 p-3">
          <AppTabs
            stretch
            label="Group connections"
            value={groupBy}
            onChange={(value) => {
              setGroupBy(value)
              setGroup(null)
            }}
            items={[
              { value: "client", label: "By Client" },
              { value: "host", label: "By Host" },
            ]}
          />
          {group && (
            <button
              aria-label="Clear connection group filter"
              className={cn(
                "mt-2 flex w-full items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary",
                APP_CONTROL
              )}
              onClick={() => setGroup(null)}
            >
              <span className="min-w-0 flex-1 truncate text-left">{group}</span>
              <AppIcon icon={Cancel01Icon} className="size-3.5" />
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-2">
          {groups.map((item) => (
            <button
              key={item.name}
              aria-label={`Filter ${groupBy === "client" ? "client" : "host"} ${item.name}`}
              aria-pressed={group === item.name}
              onClick={() => setGroup(group === item.name ? null : item.name)}
              className={cn(
                "flex w-full items-center gap-2 rounded-full px-2 py-1.5 text-xs hover:bg-accent/50",
                APP_CONTROL,
                group === item.name && "bg-accent"
              )}
            >
              {groupBy === "client" && (
                <ProcessAppIcon name={item.name} size={24} />
              )}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left",
                  groupBy === "host" && "font-mono"
                )}
              >
                {item.name}
              </span>
              <span className="text-muted-foreground">{item.count}</span>
            </button>
          ))}
        </div>
      </aside>
      <section
        aria-label="Traffic connections"
        className="relative flex h-[596px] min-w-0 flex-1 flex-col overflow-hidden rounded-4xl border border-border/40 bg-card/70"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-border/40 px-4 py-3">
          <AppTabs
            label="Connection status"
            value={tab}
            onChange={(value) => {
              setTab(value)
              setGroup(null)
              setContext(null)
            }}
            items={[
              { value: "recent", label: "Recent" },
              { value: "active", label: "Active" },
            ]}
          />
          <input
            aria-label="Filter connections"
            placeholder="Filter by host, process, or port ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(APP_INPUT, "ml-auto min-w-0 flex-1")}
          />
          <div className="relative">
            <AppButton
              icon={Menu01Icon}
              aria-label="Visible connection columns"
              aria-expanded={columnMenu}
              onClick={() => setColumnMenu(!columnMenu)}
            />
            {columnMenu && (
              <div
                className="absolute top-10 right-0 z-20 w-44 rounded-xl border border-border bg-popover p-2 shadow-xl"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setColumnMenu(false)
                }}
              >
                {COLUMNS.map((column) => (
                  <label
                    key={column}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Show ${column} column`}
                      checked={columns.includes(column)}
                      disabled={
                        columns.length === 1 && columns.includes(column)
                      }
                      onChange={() =>
                        setColumns((prev) =>
                          prev.includes(column)
                            ? prev.filter((item) => item !== column)
                            : COLUMNS.filter(
                                (item) => item === column || prev.includes(item)
                              )
                        )
                      }
                    />
                    {column}
                  </label>
                ))}
              </div>
            )}
          </div>
          <AppButton
            icon={ListXIcon}
            aria-label="Clear recent"
            onClick={() => {
              onClear()
              setContext(null)
            }}
          />
        </header>
        <div className="min-h-0 flex-1 overflow-auto">
          <table
            className="w-full text-sm whitespace-nowrap"
            aria-label="Traffic monitor connections"
          >
            <thead className="sticky top-0 z-10 bg-muted text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2 text-left font-medium">
                    {column === "Status" ? (
                      <span className="sr-only">Status</span>
                    ) : (
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  tabIndex={0}
                  aria-label={`Inspect ${item.process} connection to ${item.host}`}
                  onClick={() => onInspect(item)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContext(item)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onInspect(item)
                    }
                  }}
                  className={cn(
                    "h-9.25 cursor-pointer border-b border-border/40 hover:bg-muted/30",
                    APP_CONTROL
                  )}
                >
                  {columns.map((column) => (
                    <td key={column} className="px-3 py-1.5">
                      {display(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center">
                    <p className="font-medium">No connections</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {search || group
                        ? "No connections match these filters."
                        : "No connections in this sample view."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {context && (
          <div
            role="menu"
            aria-label="Connection actions"
            className="absolute top-20 right-4 z-20 w-64 rounded-xl border border-border bg-popover p-1 shadow-xl"
          >
            <button
              role="menuitem"
              className={cn(
                "w-full truncate rounded-lg p-2 text-left text-sm hover:bg-accent",
                APP_CONTROL
              )}
              onClick={() => {
                onAddRule(connectionHostRule(context))
                setContext(null)
              }}
            >
              Add rule for {context.host}
            </button>
            <button
              role="menuitem"
              className={cn(
                "w-full rounded-lg p-2 text-left text-sm hover:bg-accent",
                APP_CONTROL
              )}
              onClick={() => {
                const process = DEMO_PROCESSES.find(
                  (p) => p.name === context.process
                )
                onAddRule({
                  kind: "PROCESS-PATH",
                  value: process?.path ?? context.process,
                  outbound: "direct",
                  comment: `Rule for ${context.process}`,
                })
                setContext(null)
              }}
            >
              Add rule for {context.process}
            </button>
            <button
              role="menuitem"
              className={cn(
                "w-full rounded-lg p-2 text-left text-xs text-muted-foreground hover:bg-accent",
                APP_CONTROL
              )}
              onClick={() => setContext(null)}
            >
              Close menu
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export function WorkspaceConnectionSheet({
  connection,
  profile,
  onClose,
  onAddRule,
}: {
  connection: DemoConnection
  profile: DemoProfile
  onClose: () => void
  onAddRule: (draft: RuleDraft) => void
}) {
  const process = DEMO_PROCESSES.find((p) => p.name === connection.process)
  return (
    <AppModal sheet title={connection.process} onClose={onClose}>
      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pb-6 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              connection.status === "active"
                ? "bg-primary"
                : "bg-muted-foreground"
            )}
          />
          <span className="capitalize">{connection.status}</span>
        </div>
        <div className="divide-y divide-border rounded-xl border border-border bg-muted">
          {[
            ["Host", connection.host],
            ["Address", connection.address],
            ["Network", connection.network],
            ["Policy", outboundLabel(profile, connection.policy)],
            ["Start", connection.start],
            ["End", connection.status === "closed" ? "10:25:18" : "—"],
            ["Duration", connection.duration],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 px-4 py-2">
              <span className="shrink-0 text-muted-foreground">{label}</span>
              <span className="truncate text-right" title={value}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-muted px-4 py-2">
          <p className="mb-1 text-xs text-muted-foreground">Process Path</p>
          <code className="text-xs break-all select-all">{process?.path}</code>
        </div>
        <div className="flex divide-x divide-border rounded-xl border border-border bg-muted">
          {[
            ["Upload", formatBytes(connection.up)],
            ["Download", formatBytes(connection.down)],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-1 justify-between px-4 py-2">
              <span className="text-muted-foreground">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <AppButton
          className="w-full"
          onClick={() => onAddRule(connectionHostRule(connection))}
        >
          Add rule for {connection.host}
        </AppButton>
        <AppButton
          className="w-full"
          onClick={() =>
            onAddRule({
              kind: "PROCESS-PATH",
              value: process?.path ?? connection.process,
              outbound: "direct",
              comment: `Rule for ${connection.process}`,
            })
          }
        >
          Add rule for {connection.process}
        </AppButton>
      </div>
    </AppModal>
  )
}
