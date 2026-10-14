import type { Metadata } from "next"

import { ResourcePage } from "@/components/landing/resource-page"
import { ISSUES_URL, STATS_REPO } from "@/lib/site"

const privateContactUrl = `${ISSUES_URL}/new?${new URLSearchParams({
  title: "Request for a private security contact",
  body: "I would like to contact a maintainer privately about a security concern. Please provide a private reporting channel. No vulnerability details are included in this issue.",
}).toString()}`

export const metadata: Metadata = {
  title: "Security | Zeytun",
  description:
    "How to contact Zeytun maintainers about a vulnerability and prepare a useful report without exposing sensitive data.",
}

export default function SecurityPage() {
  return (
    <ResourcePage
      title="Security"
      intro="Report vulnerabilities affecting Zeytun without exposing credentials, private traffic, or exploit details in public."
    >
      <section>
        <h2>Arrange a private report</h2>
        <p>
          GitHub private vulnerability reporting is currently disabled for the
          app repository. To reach a maintainer, open a contact request using
          the link below. This creates a public issue draft: include only the
          request for a private channel, with no vulnerability details or
          attachments.
        </p>
        <p className="mt-4">
          <a href={privateContactUrl} target="_blank" rel="noopener noreferrer">
            Request a private reporting channel
          </a>
        </p>
        <p className="mt-4">
          Once a maintainer provides a private channel, send the report there.
          Coordinate public disclosure with the maintainer so the issue can be
          investigated and affected users can receive guidance.
        </p>
      </section>

      <section>
        <h2>What to include in the private report</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your Zeytun version, macOS version, and affected feature.</li>
          <li>
            The conditions required to trigger the issue and clear steps to
            reproduce it.
          </li>
          <li>
            The observed behavior, expected behavior, and potential security
            impact.
          </li>
          <li>
            A minimal example using test accounts, dummy credentials, and
            non-sensitive destinations.
          </li>
          <li>Any workaround you have identified.</li>
        </ul>
        <p className="mt-4">
          Review logs, screenshots, and profile exports before sharing them.
          Remove real subscription URLs, proxy credentials, signing keys, and
          identifying traffic details. Reproduce the issue only on systems and
          accounts you are authorized to test.
        </p>
      </section>

      <section>
        <h2>Ordinary bugs and feature requests</h2>
        <p>
          Use the{" "}
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
            public issue tracker
          </a>{" "}
          for problems without a security impact. The repository&apos;s{" "}
          <a
            href={`https://github.com/${STATS_REPO}/blob/main/CONTRIBUTING.md#security`}
            target="_blank"
            rel="noopener noreferrer"
          >
            reporting guidance
          </a>{" "}
          is the reference for coordinating security reports.
        </p>
      </section>
    </ResourcePage>
  )
}
