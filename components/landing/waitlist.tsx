"use client"

import { useState } from "react"

// import { Eyebrow } from "@/components/landing/chrome"
import { Icon } from "@/components/landing/icons"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <section className="band" id="waitlist">
      <div className="wrap">
        <div className="cta" data-reveal>
          {/* <Eyebrow>Private beta</Eyebrow> */}
          <h2>Take your network back</h2>
          <p>
            Zeytun is in private beta on macOS, with Windows and Linux builds
            close behind. Leave an address and we will send one email when your
            platform is ready.
          </p>

          {joined ? (
            <div className="form__ok is-on">
              <Icon name="check" />
              You are on the list: watch for a note from us.
            </div>
          ) : (
            <form
              className="form"
              onSubmit={(event) => {
                event.preventDefault()
                setJoined(true)
              }}
            >
              <input
                aria-label="Email address"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              <button className="btn btn--primary" type="submit">
                Request access
                <Icon name="arrowRight" />
              </button>
            </form>
          )}

          <p className="cta__fine">No spam · one email · unsubscribe anytime</p>
          <p className="mock-note">
            This form is not wired to a provider yet: submissions are only
            acknowledged in the browser.
          </p>
        </div>
      </div>
    </section>
  )
}
