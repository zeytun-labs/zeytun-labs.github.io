
"use client"
import { useState } from "react"
import { Button } from "../ui/button"

export function WaitlistNew() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <section className="mx-auto my-32 max-w-4xl px-6 text-center md:px-8" id="waitlist">
      <div className="flex flex-col items-center rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 shadow-2xl md:p-24 relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">Alpha v0.1 · macOS</span>
            <h2 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">Get the next build</h2>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
              Zeytun is free while it's in alpha. From the stable v1 it becomes a paid app. Leave your email and you'll hear the moment a new build is ready.
            </p>

            {joined ? (
              <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">You're on the list. We'll be in touch.</span>
              </div>
            ) : (
              <form
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  setJoined(true)
                }}
              >
                <input
                  aria-label="Email address"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                  className="flex-1 rounded-full border border-white/10 bg-black/40 px-6 py-3 text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-12"
                />
                <Button className="h-12 rounded-full px-8 font-medium bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
                  Join the waitlist
                </Button>
              </form>
            )}

            <div className="mt-8 flex flex-col items-center gap-2 text-center">
               <p className="text-xs text-white/40 uppercase tracking-wider font-mono">No spam · One email per release · Unsubscribe anytime</p>
               <p className="text-xs text-destructive/80 italic">Preview build. This form isn't connected to a backend yet.</p>
            </div>
        </div>
      </div>
    </section>
  )
}
