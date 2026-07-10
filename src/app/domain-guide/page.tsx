import type { Metadata } from "next";
import { ContentShell } from "@/components/ContentShell";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Domain Guide",
  description:
    "A friendly overview of the four AWS Certified Cloud Practitioner (CLF-C02) exam domains, their weightings, and what to focus on for each.",
  alternates: { canonical: "/domain-guide" },
  keywords: [
    "CLF-C02 domains",
    "AWS Cloud Practitioner exam domains",
    "Cloud Concepts",
    "Security and Compliance",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Four CLF-C02 Exam Domains, Explained",
  description:
    "A friendly overview of the four AWS Certified Cloud Practitioner (CLF-C02) exam domains and their weightings.",
  author: { "@type": "Organization", name: siteConfig.name },
  publisher: { "@type": "Organization", name: siteConfig.name },
  mainEntityOfPage: `${siteConfig.url}/domain-guide`,
  dateModified: "2026-07-10",
};

const DOMAINS = [
  {
    badge: "☁️",
    name: "Cloud Concepts",
    weight: "24%",
    summary:
      "The big-picture &ldquo;why cloud&rdquo; domain: what cloud computing is, the AWS shared responsibility model, and the value of cloud (elasticity, scalability, pay-as-you-go).",
    tips: [
      "Know the six advantages of cloud computing cold.",
      "Understand the difference between IaaS, PaaS, and SaaS.",
      "Grasp the shared responsibility model at a high level.",
    ],
  },
  {
    badge: "🛡️",
    name: "Security and Compliance",
    weight: "30%",
    summary:
      "How AWS keeps things safe and how you share that duty: IAM (users, roles, policies, MFA), the shared responsibility model in depth, and compliance/security resources like AWS Artifact.",
    tips: [
      "Memorize what IAM is and the least-privilege principle.",
      "Know the difference between root and IAM users.",
      "Understand what AWS secures vs. what you secure.",
    ],
  },
  {
    badge: "⚙️",
    name: "Cloud Technology and Services",
    weight: "34%",
    summary:
      "The largest domain: core services across compute (EC2), storage (S3, EBS), databases (RDS, DynamoDB), networking (VPC), and the serverless/management tools that tie them together.",
    tips: [
      "Map each service to its primary job (compute, storage, DB, network).",
      "Know when to pick S3 vs. EBS vs. EFS.",
      "Recognize what CloudWatch, CloudTrail, and Auto Scaling do.",
    ],
  },
  {
    badge: "💡",
    name: "Billing, Pricing and Support",
    weight: "12%",
    summary:
      "The business side: the AWS pricing model, the difference between On-Demand, Reserved, and Spot instances, the AWS Free Tier, and support plans and the Well-Architected Framework.",
    tips: [
      "Know the three pricing models and their trade-offs.",
      "Understand the Free Tier and the Total Cost of Ownership (TCO) tool.",
      "Recognize the purpose of AWS Support plans and Trusted Advisor.",
    ],
  },
];

export default function DomainGuidePage() {
  return (
    <ContentShell
      eyebrow="Study"
      title="The Four CLF-C02 Domains"
      description="A friendly tour of what the AWS Certified Cloud Practitioner exam covers — and where to focus your energy."
    >
      <JsonLd data={jsonLd} />

      <p>
        The AWS Certified Cloud Practitioner exam is organized into four
        domains. Their <strong>weighting</strong> tells you how many questions
        to expect from each — use it to prioritize, not to ignore the smaller
        ones.
      </p>

      {DOMAINS.map((d) => (
        <section
          key={d.name}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="border-l-0 pl-0">
              <span aria-hidden className="mr-2">
                {d.badge}
              </span>
              {d.name}
            </h2>
            <span className="shrink-0 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-200">
              {d.weight}
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: d.summary }} />
          <h3>Focus on</h3>
          <ul>
            {d.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>How to use this guide</h2>
      <p>
        Start with the heaviest domains (Cloud Technology and Services, then
        Security and Compliance), then keep Billing and Cloud Concepts warm with
        quick runs. Filter the arcade by difficulty to drill the areas you find
        trickiest.
      </p>
    </ContentShell>
  );
}
