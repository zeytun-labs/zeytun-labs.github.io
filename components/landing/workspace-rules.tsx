"use client"

import { useState } from "react"
import {
  Add01Icon,
  MinusSignIcon,
  CheckIcon,
  Edit03Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import {
  AppButton,
  AppIcon,
  AppTabs,
  AppSelect,
  AppModal,
  CellEnabled,
  APP_INPUT,
  APP_CONTROL,
} from "./workspace-demo-ui"
import {
  outboundLabel,
  outboundOptions,
  type RuleDraft,
} from "./workspace-activity-data"
import type { DemoProfile, DemoRuleset, RouteRule } from "./workspace-demo-data"
import { cn } from "@/lib/utils"

export function WorkspaceRules({
  profile,
  onUpdate,
  onEdit,
  onEditSet,
}: {
  profile: DemoProfile
  onUpdate: (changes: Partial<DemoProfile>) => void
  onEdit: (draft: RuleDraft) => void
  onEditSet: (draft: Partial<DemoRuleset>) => void
}) {
  const [tab, setTab] = useState("rules")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [addMenu, setAddMenu] = useState(false)
  const [dragged, setDragged] = useState<string | null>(null)
  const [downloadVia, setDownloadVia] = useState("direct")
  const temporary = tab === "temp"
  const regular = profile.routeRules.filter(
    (rule) => !!rule.temporary === temporary
  )
  const visible = regular.filter((rule) =>
    `${rule.kind} ${rule.value} ${rule.comment} ${outboundLabel(profile, rule.outbound)}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  const current = (tab === "sets" ? profile.rulesets : regular).find(
    (rule) => rule.id === selected
  )
  const canDelete =
    !!current && !("kind" in current && current.kind === "FINAL")
  const columns = temporary
    ? "grid-cols-[32px_44px_192px_200px_160px_120px_1fr]"
    : "grid-cols-[32px_44px_192px_200px_160px_1fr]"
  const reorder = (from: string, to: string) => {
    if (search.trim() || from === to) return
    const list = regular.filter((rule) => rule.kind !== "FINAL")
    const a = list.findIndex((rule) => rule.id === from),
      b = list.findIndex((rule) => rule.id === to)
    if (a < 0 || b < 0) return
    const [moved] = list.splice(a, 1)
    list.splice(b, 0, moved)
    onUpdate({
      routeRules: [
        ...profile.routeRules.filter(
          (rule) => !!rule.temporary !== temporary && rule.kind !== "FINAL"
        ),
        ...list,
        ...profile.routeRules.filter((rule) => rule.kind === "FINAL"),
      ],
    })
  }
  const add = (kind: string) => {
    setAddMenu(false)
    if (kind === "sets")
      onEditSet({ downloadVia, outbound: "block", enabled: true })
    else {
      setTab(kind)
      onEdit({
        kind: "DOMAIN-SUFFIX",
        value: "",
        outbound: "direct",
        comment: "",
        temporary: kind === "temp",
        expiry: kind === "temp" ? "1 Hour" : undefined,
      })
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <AppTabs
          label="Routing rule views"
          value={tab}
          onChange={(value) => {
            setTab(value)
            setSelected(null)
            setSearch("")
            setAddMenu(false)
          }}
          items={[
            { value: "rules", label: "Standard Rules" },
            { value: "temp", label: "Temporary Rules" },
            { value: "sets", label: "Ruleset" },
          ]}
        />
        <div className="flex items-center gap-2">
          {tab !== "sets" ? (
            <div className="relative w-40">
              <AppIcon
                icon={Search01Icon}
                className="pointer-events-none absolute top-2.5 left-2 size-4 text-muted-foreground"
              />
              <input
                aria-label="Search routing rules"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={cn(
                  "h-9 w-full rounded-full bg-transparent pr-2 pl-8 text-sm",
                  APP_CONTROL
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Download with:
              </span>
              <AppSelect
                label="Ruleset download outbound"
                className="w-36"
                value={downloadVia}
                onChange={(value) => {
                  setDownloadVia(value)
                  onUpdate({
                    rulesets: profile.rulesets.map((set) => ({
                      ...set,
                      downloadVia: value,
                    })),
                  })
                }}
                options={outboundOptions(profile).filter(
                  (item) => item.value !== "block"
                )}
              />
            </div>
          )}
          {temporary && (
            <AppButton
              icon={CheckIcon}
              disabled={!current}
              onClick={() => {
                onUpdate({
                  routeRules: profile.routeRules.map((rule) =>
                    rule.id === selected
                      ? { ...rule, temporary: false, expiry: undefined }
                      : rule
                  ),
                })
                setSelected(null)
              }}
            >
              Make permanent
            </AppButton>
          )}
          {current && (
            <AppButton
              icon={Edit03Icon}
              aria-label="Edit selected rule"
              onClick={() =>
                tab === "sets"
                  ? onEditSet(current as DemoRuleset)
                  : onEdit(current as RouteRule)
              }
            />
          )}
          <div className="relative">
            <AppButton
              icon={Add01Icon}
              aria-label="Add routing item"
              aria-expanded={addMenu}
              onClick={() => setAddMenu(!addMenu)}
            />
            {addMenu && (
              <div
                role="menu"
                aria-label="Add routing item"
                className="absolute top-10 right-0 z-30 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setAddMenu(false)
                }}
              >
                {[
                  ["rules", "Standard Rule"],
                  ["temp", "Temporary Rule"],
                  ["sets", "Ruleset"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    role="menuitem"
                    className={cn(
                      "w-full rounded-lg p-2 text-left text-sm hover:bg-accent",
                      APP_CONTROL
                    )}
                    onClick={() => add(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <AppButton
            icon={MinusSignIcon}
            aria-label="Delete selected routing item"
            disabled={!canDelete}
            onClick={() => {
              onUpdate(
                tab === "sets"
                  ? {
                      rulesets: profile.rulesets.filter(
                        (rule) => rule.id !== selected
                      ),
                    }
                  : {
                      routeRules: profile.routeRules.filter(
                        (rule) => rule.id !== selected
                      ),
                    }
              )
              setSelected(null)
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {tab === "sets" ? (
          <div
            role="table"
            aria-label="Routing rulesets"
            className="min-w-[880px] text-sm"
          >
            <div
              role="row"
              className="grid h-8 grid-cols-[44px_80px_140px_80px_1fr_120px_120px] items-center border-b border-border/70 px-2 text-xs text-muted-foreground uppercase"
            >
              {[
                "",
                "Type",
                "Name",
                "Status",
                "Source",
                "Download via",
                "Action",
              ].map((label, i) => (
                <span role="columnheader" key={i} className="px-2">
                  {label}
                </span>
              ))}
            </div>
            {profile.rulesets.map((set) => (
              <div
                role="row"
                key={set.id}
                aria-selected={selected === set.id}
                tabIndex={0}
                onClick={() => setSelected(set.id)}
                onDoubleClick={() => onEditSet(set)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditSet(set)
                  if (e.key === " ") {
                    e.preventDefault()
                    setSelected(set.id)
                  }
                }}
                className={cn(
                  "grid h-11 grid-cols-[44px_80px_140px_80px_1fr_120px_120px] items-center rounded-xl px-2 hover:bg-muted/30",
                  APP_CONTROL,
                  selected === set.id && "bg-muted/40",
                  !set.enabled && "opacity-50"
                )}
              >
                <span role="cell" onClick={(e) => e.stopPropagation()}>
                  <CellEnabled
                    label={`Enable ${set.name} ruleset`}
                    checked={set.enabled}
                    onChange={() =>
                      onUpdate({
                        rulesets: profile.rulesets.map((item) =>
                          item.id === set.id
                            ? { ...item, enabled: !item.enabled }
                            : item
                        ),
                      })
                    }
                  />
                </span>
                {[
                  "remote",
                  set.name,
                  "Ready",
                  set.source,
                  outboundLabel(profile, set.downloadVia),
                  outboundLabel(profile, set.outbound),
                ].map((value, i) => (
                  <span
                    role="cell"
                    key={i}
                    className={cn(
                      "truncate px-2",
                      i === 3 && "font-mono text-xs text-muted-foreground"
                    )}
                    title={value}
                  >
                    {value}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div
            role="table"
            aria-label={
              temporary ? "Temporary routing rules" : "Standard routing rules"
            }
            className={cn(
              "text-sm",
              temporary ? "min-w-[980px]" : "min-w-[880px]"
            )}
          >
            <div
              role="row"
              className={cn(
                "grid h-8 items-center border-b border-border/70 px-2 text-xs text-muted-foreground uppercase",
                columns
              )}
            >
              {[
                "",
                "",
                "Type",
                "Value",
                "Policy",
                ...(temporary ? ["Expires"] : []),
                "Comment",
              ].map((label, i) => (
                <span role="columnheader" key={i} className="px-2">
                  {label}
                </span>
              ))}
            </div>
            {visible.map((rule, index) => (
              <div
                role="row"
                tabIndex={0}
                key={rule.id}
                aria-selected={rule.id === selected}
                onClick={() => setSelected(rule.id)}
                onDoubleClick={() => onEdit(rule)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEdit(rule)
                  if (e.key === " ") {
                    e.preventDefault()
                    setSelected(rule.id)
                  }
                }}
                onDragOver={(e) => {
                  if (rule.kind !== "FINAL") e.preventDefault()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragged) reorder(dragged, rule.id)
                  setDragged(null)
                }}
                className={cn(
                  "grid h-11 cursor-pointer items-center rounded-xl px-2 transition-colors hover:bg-muted/30",
                  columns,
                  APP_CONTROL,
                  rule.id === selected && "bg-muted/40",
                  !rule.enabled && "opacity-50"
                )}
              >
                <span role="cell">
                  {rule.kind !== "FINAL" && (
                    <button
                      disabled={!!search.trim()}
                      draggable={!search.trim()}
                      onDragStart={() => setDragged(rule.id)}
                      onDragEnd={() => setDragged(null)}
                      aria-label={`Reorder ${rule.value}`}
                      title="Drag to reorder, or use Arrow Up / Down"
                      className={cn(
                        "flex size-6 items-center justify-center text-muted-foreground",
                        APP_CONTROL
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault()
                          e.stopPropagation()
                          const next =
                            visible[index + (e.key === "ArrowUp" ? -1 : 1)]
                          if (next) reorder(rule.id, next.id)
                        }
                      }}
                    >
                      <AppIcon icon={Menu01Icon} className="size-4" />
                    </button>
                  )}
                </span>
                <span role="cell" onClick={(e) => e.stopPropagation()}>
                  <CellEnabled
                    label={
                      rule.kind === "FINAL"
                        ? "FINAL routing rule is always enabled"
                        : `Enable ${rule.value} routing rule`
                    }
                    disabled={rule.kind === "FINAL"}
                    checked={rule.enabled}
                    onChange={() =>
                      onUpdate({
                        routeRules: profile.routeRules.map((item) =>
                          item.id === rule.id
                            ? { ...item, enabled: !item.enabled }
                            : item
                        ),
                      })
                    }
                  />
                </span>
                <span role="cell" className="px-2">
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                    {rule.kind}
                  </span>
                </span>
                <span
                  role="cell"
                  className="truncate px-2 font-mono text-xs"
                  title={rule.value}
                >
                  {rule.kind === "FINAL" ? "—" : rule.value}
                </span>
                <span role="cell" className="px-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      rule.outbound === "block"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {outboundLabel(profile, rule.outbound)}
                  </span>
                </span>
                {temporary && (
                  <span
                    role="cell"
                    className="px-2 text-xs text-muted-foreground"
                  >
                    {rule.expiry}
                  </span>
                )}
                <span
                  role="cell"
                  className="truncate px-2 text-xs text-muted-foreground/60 italic"
                  title={rule.comment}
                >
                  {rule.comment || "—"}
                </span>
              </div>
            ))}
            {!visible.length && (
              <div className="m-6 rounded-3xl border border-dashed border-border/50 bg-card/20 py-12 text-center">
                <h3 className="font-medium">
                  {search ? "No matching rules" : "No rules yet"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {search
                    ? "Try another search."
                    : "Add a routing rule to decide how traffic is handled."}
                </p>
                <AppButton
                  className="mt-4"
                  onClick={() => add(temporary ? "temp" : "rules")}
                >
                  Add Rule
                </AppButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function WorkspaceRulesetEditor({
  draft,
  profile,
  onSave,
  onClose,
}: {
  draft: Partial<DemoRuleset>
  profile: DemoProfile
  onSave: (draft: Partial<DemoRuleset>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(draft.name ?? "")
  const [source, setSource] = useState(draft.source ?? "")
  const [outbound, setOutbound] = useState(draft.outbound ?? "block")
  const [downloadVia, setDownloadVia] = useState(draft.downloadVia ?? "direct")
  const [error, setError] = useState("")
  return (
    <AppModal
      title={draft.id ? "Edit Ruleset" : "Add Ruleset"}
      onClose={onClose}
    >
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          let valid = false
          try {
            valid = new URL(source).protocol === "https:"
          } catch {}
          if (!name.trim() || !valid) {
            setError("Enter a name and a valid HTTPS source URL.")
            return
          }
          onSave({
            ...draft,
            name: name.trim(),
            source: source.trim(),
            outbound,
            downloadVia,
          })
        }}
      >
        <label className="block space-y-2 text-sm">
          Name
          <input
            autoFocus
            aria-label="Ruleset name"
            className={APP_INPUT}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm">
          Type
          <AppSelect
            label="Ruleset type"
            options={[{ value: "remote", label: "Remote" }]}
          />
        </label>
        <label className="block space-y-2 text-sm">
          Source
          <input
            aria-label="Ruleset source"
            placeholder="https://rules.example.com/example.srs"
            className={APP_INPUT}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm">
          Download via
          <AppSelect
            label="Ruleset download via"
            value={downloadVia}
            onChange={setDownloadVia}
            options={outboundOptions(profile).filter(
              (item) => item.value !== "block"
            )}
          />
        </label>
        <label className="block space-y-2 text-sm">
          Action
          <AppSelect
            label="Ruleset action"
            value={outbound}
            onChange={setOutbound}
            options={outboundOptions(profile)}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <AppButton onClick={onClose}>Cancel</AppButton>
          <AppButton primary type="submit">
            Save
          </AppButton>
        </div>
      </form>
    </AppModal>
  )
}
