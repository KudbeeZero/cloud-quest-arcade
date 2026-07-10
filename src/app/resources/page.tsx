import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Curated free, official AWS resources and friendly communities to supplement your Cloud Quest Arcade practice for the CLF-C02 exam.",
  alternates: { canonical: "/resources" },
  keywords: [
    "AWS Cloud Practitioner resources",
    "free AWS training",
    "AWS Skill Builder",
    "CLF-C02 exam guide",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free AWS Cloud Practitioner Resources",
  description:
    "Curated free, official AWS resources and communities for CLF-C02 prep.",
  author: { "@type": "Organization", name: siteConfig.name },
  publisher: { "@type": "Organization", name: siteConfig.name },
  mainEntityOfPage: `${siteConfig.url}/resources`,
  dateModified: "2026-07-10",
};

const RESOURCES = [
  {
    group: "Official AWS",
    items: [
      {
        name: "AWS Certified Cloud Practitioner",
        desc: "The official exam page with overview, beta info, and scheduling.",
        href: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
      },
      {
        name: "CLF-C02 Exam Guide (PDF)",
        desc: "The authoritative breakdown of domains, weightings, and the exam format.",
        href: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf",
      },
      {
        name: "AWS Documentation",
        desc: "The canonical reference for every service mentioned in the arcade.",
        href: "https://docs.aws.amazon.com/",
      },
      {
        name: "AWS Whitepapers & Guides",
        desc: "Foundational reading like 'Overview of Amazon Web Services' and the Well-Architected papers.",
        href: "https://aws.amazon.com/whitepapers/",
      },
      {
        name: "AWS Well-Architected",
        desc: "The six pillars that inform many exam questions on reliability, security, and cost.",
        href: "https://aws.amazon.com/architecture/well-architected/",
      },
    ],
  },
  {
    group: "Free Training",
    items: [
      {
        name: "AWS Skill Builder",
        desc: "Free and paid digital courses, including Cloud Practitioner learning paths.",
        href: "https://skillbuilder.aws/",
      },
      {
        name: "AWS Training & Certification",
        desc: "The home for official courses, including the free Cloud Practitioner essentials.",
        href: "https://aws.amazon.com/training/",
      },
      {
        name: "AWS Educate",
        desc: "Free cloud-learning resources for students and newcomers.",
        href: "https://www.awseducate.com/",
      },
    ],
  },
  {
    group: "Community",
    items: [
      {
        name: "r/AWSCertifications",
        desc: "An active community sharing study plans, tips, and experiences.",
        href: "https://www.reddit.com/r/AWSCertifications/",
      },
      {
        name: "AWS on YouTube",
        desc: "Official videos, reinvent talks, and service explainers.",
        href: "https://www.youtube.com/@aws",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <ContentShell
      eyebrow="Study"
      title="Free Resources to Supplement the Arcade"
      description="Hand-picked, free, and official places to go deeper between practice runs."
    >
      <JsonLd data={jsonLd} />

      <p>
        Cloud Quest Arcade is great for retrieval practice, but pair it with
        authoritative sources. Everything below is <strong>free</strong> and,
        where marked official, published by AWS.
      </p>

      <p className="text-xs text-neutral-500">
        These are external links. This site is not affiliated with AWS, and we
        are not responsible for third-party content.
      </p>

      {RESOURCES.map((section) => (
        <section key={section.group}>
          <h2>{section.group}</h2>
          <ul className="list-none space-y-3 pl-0">
            {section.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/50"
                >
                  <span className="font-semibold text-white">
                    {item.name}{" "}
                    <span aria-hidden className="text-cyan-300">
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-neutral-300">
                    {item.desc}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2>How to use these alongside the arcade</h2>
      <ol>
        <li>Hit a weak domain in the arcade.</li>
        <li>Open the matching official doc or video to understand it.</li>
        <li>Return to the arcade and re-test until it clicks.</li>
      </ol>
    </ContentShell>
  );
}
