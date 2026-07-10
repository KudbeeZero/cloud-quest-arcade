import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using Cloud Quest Arcade, an independent, client-side study aid for the AWS Certified Cloud Practitioner (CLF-C02) exam.",
  alternates: { canonical: "/terms" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Use",
  url: `${siteConfig.url}/terms`,
  publisher: { "@type": "Organization", name: siteConfig.name },
};

export default function TermsPage() {
  return (
    <ContentShell
      eyebrow="Legal"
      title="Terms of Use"
      description="Last updated: July 2026. By playing, you agree to these straightforward terms for an independent study aid."
    >
      <JsonLd data={jsonLd} />

      <h2>Acceptance of terms</h2>
      <p>
        By using Cloud Quest Arcade (the &ldquo;app&rdquo;), you agree to these
        Terms of Use. The app is provided as-is for personal study. If you do
        not agree, please do not use the app.
      </p>

      <h2>Use of the app</h2>
      <p>You may use the app to practice for the AWS Certified Cloud Practitioner exam. You agree to:</p>
      <ul>
        <li>Use the app for lawful, personal learning purposes.</li>
        <li>Not attempt to disrupt, reverse engineer, or abuse the app.</li>
        <li>
          Not reproduce large portions of the content for commercial resale.
        </li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The app&apos;s name, design, and original practice questions are
        provided by this independent project. The app is{" "}
        <strong>not affiliated with, endorsed by, or sponsored by Amazon Web
        Services</strong>. &ldquo;AWS&rdquo;, &ldquo;Amazon Web Services&rdquo;,
        and &ldquo;AWS Certified Cloud Practitioner&rdquo; are trademarks of
        Amazon.com, Inc.
      </p>

      <h2>No warranty</h2>
      <p>
        The app is provided <strong>without warranties of any kind</strong>,
        express or implied. While we aim for accurate, helpful content, we do
        not guarantee that every question or explanation is error-free or that
        using the app will result in passing any exam.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the project is not liable for
        any indirect, incidental, or consequential damages arising from your use
        of the app. Your use is at your own risk.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms occasionally. Continued use of the app after
        changes constitutes acceptance of the revised terms. The current version
        is always available on this page.
      </p>

      <h2>Governing context</h2>
      <p>
        This is a lightweight, non-commercial study tool. Where formal terms are
        required by your jurisdiction, these Terms of Use are offered on an
        as-available basis without establishing a commercial relationship.
      </p>
    </ContentShell>
  );
}
