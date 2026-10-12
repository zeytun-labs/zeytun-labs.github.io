import { Section } from "../common/section"
import { SectionHead } from "./chrome"
import { RELEASES_URL } from "@/lib/site"
import { ChevronDown } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "Is Zeytun free?",
    a: "Yes. Zeytun is free to download and use.",
  },
  {
    q: "Which Macs are supported?",
    a: "The beta is built for Macs with Apple Silicon. Intel Macs, Windows, and Linux are not supported by this release.",
  },
  {
    q: "Does it include a VPN subscription?",
    a: "No. Zeytun manages your connections and routing; it does not provide a VPN service. Add your own proxy settings or subscription to route traffic through a proxy.",
  },
  {
    q: "Does it see every connection?",
    a: "Zeytun shows traffic captured by your selected network mode. What appears depends on how apps send traffic, and app details may not be available for every connection.",
  },
  {
    q: "What happens if I ignore a connection prompt?",
    a: "When the prompt times out, Zeytun uses your configured final route. The connection may be allowed or blocked, depending on that route.",
  },
  {
    q: "Why might macOS ask for permission?",
    a: (
      <>
        TUN mode creates a virtual network interface and requires administrator
        permission. Check the{" "}
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          release notes
        </a>{" "}
        for installation and first-launch instructions.
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
        lede="Compatibility, connection prompts, and setup."
      />

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-border/40 bg-card/40 p-4 transition-colors open:bg-card/70 hover:border-border/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg text-base font-medium text-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <span>{item.q}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 border-t border-border/30 pt-3 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </Section>
  )
}
