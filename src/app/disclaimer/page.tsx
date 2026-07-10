import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Cloud Quest Arcade is an independent study aid for the AWS Certified Cloud Practitioner exam. It is not affiliated with AWS and does not guarantee exam success.",
  alternates: { canonical: "/disclaimer" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Disclaimer",
  url: `${siteConfig.url}/disclaimer`,
  publisher: { "@type": "Organization", name: siteConfig.name },
};

export default function DisclaimerPage() {
  return (
    <ContentShell
      eyebrow="Legal"
      title="Disclaimer"
      description="Read this before you rely on Cloud Quest Arcade for exam prep."
    >
      <JsonLd data={jsonLd} />

      <h2>Not affiliated with AWS</h2>
      <p>
        Cloud Quest Arcade is an <strong>independent, unofficial study aid</strong>.
        It is not affiliated with, endorsed by, sponsored by, or connected to
        Amazon Web Services or Amazon.com, Inc. &ldquo;AWS&rdquo;, &ldquo;Amazon
        Web Services&rdquo;, and &ldquo;AWS Certified Cloud Practitioner&rdquo;
        are trademarks of Amazon.com, Inc.
      </p>

      <h2>Original practice content</h2>
      <p>
        All questions, explanations, and study material are{" "}
        <strong>original, hand-authored content</strong> that paraphrases
        general cloud knowledge. No official, copyrighted exam questions or
        dumps are reproduced. The app is meant to reinforce concepts, not to
        mirror the real exam.
      </p>

      <h2>No guarantee of exam success</h2>
      <p>
        Practicing here <strong>does not guarantee</strong> that you will pass
        the AWS Certified Cloud Practitioner exam. Exam outcomes depend on many
        factors, including your broader study, hands-on experience, and the
        official exam&apos;s own content, which may change over time.
      </p>

      <h2>For educational use only</h2>
      <p>
        The app is provided for <strong>educational and entertainment
        purposes</strong>. Scores, ranks, and streaks are motivational game
        mechanics, not assessments of readiness for any certification.
      </p>

      <h2>Accuracy</h2>
      <p>
        We strive for correct, up-to-date material, but cloud services evolve.
        Always confirm details against the <a href="/resources">official AWS
        resources</a> and the current exam guide before relying on them.
      </p>

      <h2>Your responsibility</h2>
      <p>
        You are responsible for your own study plan and for verifying
        information from authoritative sources. Use the app as one part of a
        balanced preparation strategy.
      </p>
    </ContentShell>
  );
}
