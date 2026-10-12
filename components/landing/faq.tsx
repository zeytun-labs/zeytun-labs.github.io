import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { SOURCE_URL, RELEASES_URL } from "@/lib/site"
import { ChevronDown } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "Is Zeytun free?",
    a: (
      <>
        Yes. Zeytun is free and open source under GPL-3.0. You can inspect the source and contribute on{" "}
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          GitHub
        </a>
        .
      </>
    ),
  },
  {
    q: "Which Macs are supported?",
    a: "The current beta targets macOS on Apple Silicon. Intel, Windows and Linux builds are not currently offered.",
  },
  {
    q: "Does it include a VPN subscription?",
    a: "Zeytun manages network connections and routing. Supply your own proxy or subscription when you want to route traffic through a proxy.",
  },
  {
    q: "Does it see every connection?",
    a: "Visibility depends on the network mode and how applications send traffic. App details may not be available for every connection.",
  },
  {
    q: "Why might macOS ask for permission?",
    a: (
      <>
        TUN capture requires administrator permission. Check the{" "}
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          release installation notes
        </a>{" "}
        for first-launch instructions and any signing requirements.
      </>
    ),
  },
]

export function Faq() {
  return (
    <Section id="faq" className="max-w-3xl">
      <SectionHead
        eyebrow="FAQ"
        title="A few things before you start."
        lede="Common questions about Zeytun, permissions, and platform support."
      />

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-border/40 bg-card/40 p-4 transition-colors hover:border-border/60 open:bg-card/70"
          >
            <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-foreground select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg">
              <span>{item.q}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/30 pt-3">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </Section>
  )
}
