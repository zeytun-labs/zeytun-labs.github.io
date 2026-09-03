"use client"

import { useState } from "react"

import { Section } from "../common/section"
import { Button } from "../ui/button"
import { Title } from "../common/section"

/**
 * Static export means there is no server here — the form posts straight from
 * the browser to whatever endpoint is configured.
 *
 * ponytail: two env vars instead of a client SDK. Supabase works as-is —
 * point ENDPOINT at `https://<project>.supabase.co/rest/v1/waitlist` and put
 * the anon key in KEY (row-level security must allow anonymous INSERT). Any
 * other form endpoint (a Worker, Buttondown, Formspree) works with ENDPOINT
 * alone. Swap in @supabase/supabase-js only if this page ever needs to read
 * data back, not to write one row.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT
const KEY = process.env.NEXT_PUBLIC_WAITLIST_KEY

type State = "idle" | "sending" | "done" | "error"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<State>("idle")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ENDPOINT) {
      setState("error")
      return
    }

    setState("sending")
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(KEY ? { apikey: KEY, authorization: `Bearer ${KEY}` } : {}),
          prefer: "return=minimal",
        },
        body: JSON.stringify({ email }),
      })
      // keep the typed address on screen when it fails — never swallow it
      setState(res.ok ? "done" : "error")
    } catch {
      setState("error")
    }
  }

  return (
    <Section className="max-w-4xl text-center" id="waitlist">
      <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-10 md:p-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="size-64 rounded-full bg-primary/20 blur-[100px]" />
        </div>

        <div className="relative flex flex-col items-center">
          <Title>Alpha v0.1 · macOS</Title>
          <h2 className="mb-4 font-heading text-4xl tracking-tight md:text-5xl">
            Get the next build.
          </h2>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            Zeytun is free while it&apos;s in alpha. From the stable v1 it
            becomes a paid app. Leave your email and you&apos;ll hear the moment
            a new build is ready.
          </p>

          {state === "done" ? (
            <p className="rounded-full border border-primary/30 bg-primary/10 px-6 py-3 font-medium text-primary">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          ) : (
            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={submit}
            >
              <label className="sr-only" htmlFor="waitlist-email">
                Email address
              </label>
              <input
                id="waitlist-email"
                autoComplete="email"
                className="h-12 flex-1 rounded-full border border-border bg-background/60 px-6 placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              <Button
                className="h-12 rounded-full px-8 text-primary-foreground!"
                disabled={state === "sending"}
                type="submit"
              >
                {state === "sending" ? "Sending…" : "Join the waitlist"}
              </Button>
            </form>
          )}

          <div className="mt-8 space-y-2">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              No spam · One email per release · Unsubscribe anytime
            </p>
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Requirements: macOS · Apple Silicon
            </p>
            {state === "error" && (
              <p className="text-xs text-destructive">
                {ENDPOINT
                  ? "That didn't go through. Try again in a moment."
                  : "Preview build — this form isn't connected to a backend yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
