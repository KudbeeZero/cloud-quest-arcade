import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Cloud Quest Arcade handles your data: a fully client-side study aid that stores progress locally in your browser and sends nothing to a server.",
  alternates: { canonical: "/privacy" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  url: `${siteConfig.url}/privacy`,
  description:
    "How Cloud Quest Arcade handles your data with a local, client-side approach.",
  publisher: { "@type": "Organization", name: siteConfig.name },
};

export default function PrivacyPage() {
  return (
    <ContentShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="Last updated: July 2026. Cloud Quest Arcade is a local-first study aid — your progress stays on your device."
    >
      <JsonLd data={jsonLd} />

      <h2>Overview</h2>
      <p>
        Cloud Quest Arcade is built to be <strong>private by design</strong>.
        There is no account, no login, and no server that stores your activity.
        Everything you do in the app runs entirely in your web browser.
      </p>

      <h2>What we store (and where)</h2>
      <p>
        The only data the app keeps is your <strong>best score</strong> and
        accumulated <strong>cloud XP</strong>. This is saved locally in your
        browser using the Web Storage API (localStorage) under the key{" "}
        <code>arcade_bestScore</code>. It never leaves your device and is not
        transmitted to us or any third party.
      </p>
      <ul>
        <li>
          <strong>Best score / XP</strong> — used only to show your progress on
          the home screen.
        </li>
        <li>
          <strong>Preferences</strong> — such as your selected difficulty
          filter, kept locally for convenience.
        </li>
      </ul>

      <h2>What we do not collect</h2>
      <ul>
        <li>No names, emails, or account information.</li>
        <li>No answers you submit during a quiz run (those live only in memory).</li>
        <li>No analytics, advertising, or cross-site tracking cookies.</li>
        <li>No precise location, contacts, or device identifiers.</li>
      </ul>

      <h2>Cookies and similar technologies</h2>
      <p>
        The app uses no tracking cookies. Your browser may store a small amount
        of local site data to remember your progress, which is functionally
        equivalent to a first-party, strictly-necessary cookie. You can clear it
        at any time from your browser settings.
      </p>

      <h2>Third-party links</h2>
      <p>
        Some pages link to external resources (for example, official AWS
        documentation). Opening those links takes you to sites we do not
        control; their privacy practices are governed by their own policies.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The app is suitable for learners of any age, but it is not directed
        specifically at children, and it collects no personal information from
        anyone.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If our approach changes, we will update this page with a new
        &ldquo;last updated&rdquo; date. Because the app is local-first, the
        substance of this policy is unlikely to change.
      </p>

      <h2>Contact</h2>
      <p>
        This is an independent project with no commercial operator. If you have
        questions about privacy, review the open-source repository or the
        in-app disclaimer for context.
      </p>
    </ContentShell>
  );
}
