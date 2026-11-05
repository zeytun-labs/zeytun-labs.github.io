import type { Metadata } from "next"

import { ResourcePage } from "@/components/landing/resource-page"
import { ISSUES_URL, STATS_REPO } from "@/lib/site"

const privateReportUrl = `https://github.com/${STATS_REPO}/security/advisories/new`

export const metadata: Metadata = {
  title: "Security | Zeytun",
  description:
    "Report a Zeytun vulnerability privately through GitHub and prepare a useful report without exposing sensitive data.",
}

export default function SecurityPage() {
  return (
    <ResourcePage
      title="Security"
      intro="Report vulnerabilities affecting Zeytun without exposing credentials, private traffic, or exploit details in public."
    >
      <section>
        <h2>Report a vulnerability privately</h2>
        <p>
          Use the app repository&apos;s private vulnerability reporting form on
          GitHub. Reports are shared privately with the repository maintainers
          rather than posted to the public issue tracker. A GitHub account is
          required to submit a report.
        </p>
        <p className="mt-4">
          <a href={privateReportUrl} target="_blank" rel="noopener noreferrer">
            Report a vulnerability
          </a>
        </p>
        <p className="mt-4">
          Keep follow-up details in the private report. Coordinate public
          disclosure with the maintainer so the issue can be investigated and
          affected users can receive guidance.
        </p>
      </section>

      <section>
        <h2>What to include in the private report</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your Zeytun version, OS version, and affected feature.</li>
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
