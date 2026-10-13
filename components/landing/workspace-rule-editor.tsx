"use client"

import { useState } from "react"
import { AppModal, AppSelect, AppButton, APP_INPUT } from "./workspace-demo-ui"
import { outboundOptions, type RuleDraft } from "./workspace-activity-data"
import type { DemoProfile } from "./workspace-demo-data"

// Fields and order from rule-dialog.svelte and process/add-rule-dialog.svelte.
export function WorkspaceRuleEditor({
  draft,
  profile,
  context,
  onSave,
  onClose,
}: {
  draft: RuleDraft
  profile: DemoProfile
  context?: string
  onSave: (draft: RuleDraft) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(draft)
  const [error, setError] = useState("")
  const title = context
    ? "Add Bypass/Proxy Rule"
    : draft.id
      ? "Edit Rule"
      : draft.temporary
        ? "Add Temporary Rule"
        : "Add Rule"
  return (
    <AppModal
      title={title}
      description={
        context ? `Create a rule for connections from ${context}.` : undefined
      }
      onClose={onClose}
    >
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (form.kind !== "FINAL" && !form.value.trim()) {
            setError("Enter a rule value.")
            return
          }
          onSave({
            ...form,
            value: form.value.trim(),
            comment: form.comment.trim(),
          })
        }}
      >
        {context ? (
          <label className="space-y-2 text-sm">
            Process
            <input autoFocus disabled value={context} className={APP_INPUT} />
          </label>
        ) : (
          <label className="space-y-2 text-sm">
            Type
            <AppSelect
              label="Rule type"
              value={form.kind}
              onChange={(kind) => setForm({ ...form, kind })}
              options={(draft.kind === "FINAL"
                ? ["FINAL"]
                : [
                    "DOMAIN",
                    "DOMAIN-SUFFIX",
                    "DOMAIN-KEYWORD",
                    "IP-CIDR",
                    "PROCESS-NAME",
                    "PROCESS-PATH",
                    "PROCESS-PATH-REGEX",
                    "GEOIP",
                    "GEOSITE",
                  ]
              ).map((value) => ({ value, label: value }))}
            />
          </label>
        )}
        {!context && form.kind !== "FINAL" && (
          <label className="space-y-2 text-sm">
            Value
            <input
              autoFocus
              aria-label="Rule value"
              className={APP_INPUT}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="example.com"
            />
          </label>
        )}
        <label className="space-y-2 text-sm">
          {context ? "Outbound" : "Action"}
          <AppSelect
            label="Rule action"
            value={form.outbound}
            onChange={(outbound) => setForm({ ...form, outbound })}
            options={outboundOptions(profile)}
          />
        </label>
        {form.temporary && (
          <label className="space-y-2 text-sm">
            Expires
            <AppSelect
              label="Rule expiry"
              value={form.expiry ?? "1 Hour"}
              onChange={(expiry) => setForm({ ...form, expiry })}
              options={["15 Minutes", "1 Hour", "24 Hours", "Session"].map(
                (value) => ({ value, label: value })
              )}
            />
          </label>
        )}
        <label className="space-y-2 text-sm">
          Comment <span className="text-muted-foreground">(optional)</span>
          <input
            aria-label="Rule comment"
            className={APP_INPUT}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <div className="mt-1 flex justify-end gap-2">
          <AppButton onClick={onClose}>Cancel</AppButton>
          <AppButton primary type="submit">
            {context ? "Save Rule" : "Save"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  )
}
