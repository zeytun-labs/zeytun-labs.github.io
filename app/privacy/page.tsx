import type { Metadata } from "next"
import Link from "next/link"

import { ResourcePage } from "@/components/landing/resource-page"
import { ISSUES_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy | Zeytun",
  description:
    "What Zeytun processes on your device, which features contact external services, and what to know before sharing diagnostic data.",
}

export default function PrivacyPage() {
  return (
    <ResourcePage
      title="Privacy"
      intro="Understand what Zeytun can see, what it stores on your device, and when it connects to services outside your device."
    >
      <section>
        <h2>Network information on your device</h2>
        <p>
          Zeytun processes the connections handled by its network core to apply
          your routing rules and show network activity. This can include app and
          process identifiers, destination domains and IP addresses, connection
          times, routes, and transferred byte counts. Visibility depends on your
          network mode; process details are not available for every connection.
        </p>
        <p className="mt-3">
          Profiles, routing settings, proxy configurations, subscription
          details, and traffic statistics are stored locally by the app. Proxy
          configurations and subscription addresses may contain credentials.
          Treat app data and exported profiles as sensitive files.
        </p>
      </section>

      <section>
        <h2>Connections to external services</h2>
        <p>
          Local processing does not mean the app operates offline. Depending on
          your configuration and the features you use, Zeytun makes these
          requests:
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Routing and DNS.
            </strong>{" "}
            Connections and lookups go to the destinations, proxy providers, and
            DNS servers selected by your configuration.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Subscriptions and rule sets.
            </strong>{" "}
            Refreshing a remote source contacts its provider, including when
            automatic updates are enabled.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Software and country data.
            </strong>{" "}
            App update checks contact GitHub. Country lookups use a local
            database; updating that database contacts its download provider.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Network tests.
            </strong>{" "}
            Connectivity, latency, and network-quality tests contact their test
            endpoints. A direct connectivity test can use your unproxied
            connection.
          </li>
        </ul>
        <p className="mt-4">
          These services receive the requests needed to perform the selected
          operation. What a provider can observe depends on the route, protocol,
          and encryption in use. Its own privacy practices apply to the data it
          receives.
        </p>
      </section>

      <section>
        <h2>Diagnostics and files you share</h2>
        <p>
          Crash reports are written to local files and can include app and OS
          versions, error details, and recent log messages. Sharing a report or
          posting an issue can disclose information about your setup. Review the
          contents before sending them and remove credentials, subscription
          URLs, and identifying network details.
        </p>
        <p className="mt-3">
          Exported profiles can contain working proxy credentials. An export
          without subscription links still includes proxy configurations; it is
          not an anonymized document. Public GitHub issues and their attachments
          are visible to other people.
        </p>
      </section>

      <section>
        <h2>This website</h2>
        <p>
          The website has no account registration or payment form and does not
          include advertising or visitor-analytics scripts. Community statistics
          describe the public GitHub repository, not visitors. Loading the site
          still sends normal web requests to its hosting infrastructure.
          Following a download or an external link sends a request to the
          destination service.
        </p>
      </section>

      <section>
        <h2>Questions and concerns</h2>
        <p>
          General questions about data handling can be raised in the{" "}
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            project&apos;s issue tracker
          </a>
          . If your concern involves private information or a vulnerability,
          follow the{" "}
          <Link href="/security">private reporting instructions</Link> before
          sharing details.
        </p>
      </section>
    </ResourcePage>
  )
}
