import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Study Tips",
  description:
    "Actionable, science-backed study strategies for the AWS Certified Cloud Practitioner (CLF-C02) exam — active recall, spaced repetition, and daily arcade practice.",
  alternates: { canonical: "/study-tips" },
  keywords: [
    "CLF-C02 study tips",
    "AWS Cloud Practitioner study plan",
    "active recall",
    "spaced repetition",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Study Tips for the AWS Cloud Practitioner Exam",
  description:
    "Actionable study strategies for the AWS Certified Cloud Practitioner (CLF-C02) exam.",
  author: { "@type": "Organization", name: siteConfig.name },
  publisher: { "@type": "Organization", name: siteConfig.name },
  mainEntityOfPage: `${siteConfig.url}/study-tips`,
  dateModified: "2026-07-10",
};

export default function StudyTipsPage() {
  return (
    <ContentShell
      eyebrow="Study"
      title="Study Tips That Actually Stick"
      description="A practical playbook for the AWS Certified Cloud Practitioner (CLF-C02) exam — built around short, repeatable sessions."
    >
      <JsonLd data={jsonLd} />

      <p>
        The Cloud Practitioner exam rewards broad familiarity more than deep
        trivia. The best prep is <strong>consistent, low-stress repetition</strong> —
        exactly what Cloud Quest Arcade is designed for. Here are strategies
        that work.
      </p>

      <h2>1. Use active recall, not re-reading</h2>
      <p>
        Testing yourself beats re-reading notes. Every question you answer in
        the arcade forces your brain to retrieve the answer, which strengthens
        memory far more than passive review.
      </p>
      <ul>
        <li>Play a quick mission whenever you have 3–5 minutes.</li>
        <li>Say the answer out loud before checking the explanation.</li>
        <li>Pay attention to the <strong>explanation</strong> — that&apos;s where learning happens.</li>
      </ul>

      <h2>2. Space it out</h2>
      <p>
        Spread study across days instead of cramming. Short daily sessions beat
        one long weekend. A simple rhythm:
      </p>
      <ol>
        <li>One arcade run today.</li>
        <li>A second run tomorrow on a different difficulty.</li>
        <li>Review the domains you missed most, then run again in two days.</li>
      </ol>

      <h2>3. Weight your effort to the domains</h2>
      <p>
        The exam is not evenly split. Spend more time on the heaviest domains
        (see the <a href="/domain-guide">Domain Guide</a> for the exact
        percentages) while keeping the smaller ones fresh.
      </p>

      <h2>4. Mix difficulties</h2>
      <p>
        Use the <strong>difficulty filter</strong> to warm up on Easy, then push
        into Medium and Hard. Hard questions expose gaps; Easy questions build
        confidence and speed.
      </p>

      <h2>5. Turn streaks into habit</h2>
      <p>
        The arcade&apos;s <strong>streak</strong> and <strong>XP</strong> are
        there to make daily practice feel rewarding. Don&apos;t chase a perfect
        score — chase showing up. Progress is saved locally, so your best score
        is always waiting.
      </p>

      <h2>6. Pair practice with hands-on</h2>
      <p>
        Concepts stick best when you&apos;ve touched the console. Even a free
        tier account and a few minutes launching an S3 bucket or an EC2 instance
        makes abstract terms concrete.
      </p>

      <h2>7. Simulate the real thing</h2>
      <p>
        Near exam day, do a full run without peeking at explanations, then review
        every wrong answer calmly. Treat mistakes as a checklist of what to
        revisit — not as failures.
      </p>

      <blockquote>
        Consistency &gt; intensity. Ten minutes a day will take you further than
        one exhausted all-nighter.
      </blockquote>
    </ContentShell>
  );
}
