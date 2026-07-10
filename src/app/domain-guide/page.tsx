import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

const DOMAINS = [
  {
    name: "Cloud Concepts",
    pct: "26%",
    focus: "Cloud value proposition, design principles, and migration/innovation benefits.",
  },
  {
    name: "Security and Compliance",
    pct: "25%",
    focus: "Shared Responsibility Model, IAM, security best practices, and compliance frameworks.",
  },
  {
    name: "Cloud Technology and Services",
    pct: "33%",
    focus: "Compute, storage, networking, databases, and core AWS service categories.",
  },
  {
    name: "Billing, Pricing and Support",
    pct: "16%",
    focus: "AWS pricing models, cost management, and support plans.",
  },
];

export default function DomainGuidePage() {
  return (
    <ContentShell
      title="Domain Guide"
      description="CLF-C02 exam domains and what to focus on."
      backLabel="Home"
      backHref="/"
    >
      <Prose>
        {DOMAINS.map((d) => (
          <div
            key={d.name}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <h3>{d.name}</h3>
              <span className="text-xs font-semibold text-cyan-300">
                {d.pct} of exam
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-300">{d.focus}</p>
          </div>
        ))}
        <h3>How to use this guide</h3>
        <p>
          Pick a domain in the arcade start screen, then drill the associated
          questions. The domain guide helps you decide where to spend your next
          session.
        </p>
      </Prose>
    </ContentShell>
  );
}
