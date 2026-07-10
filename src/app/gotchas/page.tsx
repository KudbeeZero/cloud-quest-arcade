import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

interface Gotcha {
  id: string;
  domain: string;
  trap: string;
  why: string;
}

const GOTCHAS: Gotcha[] = [
  {
    id: "g1",
    domain: "Cloud Concepts",
    trap: "Assuming elasticity and scalability are the same thing.",
    why: "Scalability is the ability to handle growing load (add capacity). Elasticity is automatically adding AND removing capacity to match demand. The exam loves asking which one 'shrinks back down' — that's elasticity.",
  },
  {
    id: "g2",
    domain: "Cloud Concepts",
    trap: "Picking 'Edge location' when a question asks where your primary resources live.",
    why: "Edge locations are for CloudFront caching, not where you run compute or store primary data. Resources run in Regions and Availability Zones. Edge locations sit outside Regions purely to reduce latency.",
  },
  {
    id: "g3",
    domain: "Security and Compliance",
    trap: "Thinking AWS patches the guest OS on EC2 for you.",
    why: "Under the shared responsibility model, AWS manages the physical hardware and hypervisor, but YOU patch the guest OS, applications, and firewall config on EC2. Confusing this is one of the most common wrong answers.",
  },
  {
    id: "g4",
    domain: "Security and Compliance",
    trap: "Choosing IAM user access keys for an app running on EC2.",
    why: "Hard-coding long-lived access keys is an anti-pattern. Attach an IAM role to the instance instead — it provides temporary, automatically rotated credentials with no secrets in your code.",
  },
  {
    id: "g5",
    domain: "Security and Compliance",
    trap: "Mixing up AWS Config, CloudTrail, and CloudWatch.",
    why: "CloudTrail = who did what (API activity/audit). CloudWatch = metrics, logs, and alarms (operational monitoring). Config = resource configuration history and compliance rules. Know which 'lens' each one provides.",
  },
  {
    id: "g6",
    domain: "Cloud Technology and Services",
    trap: "Reaching for DynamoDB when a relational schema with joins is required.",
    why: "DynamoDB is a NoSQL key-value/document store — great for scale, not for ad-hoc relational queries. For PostgreSQL/MySQL with SQL and joins, the answer is Amazon RDS. Match the data model to the service.",
  },
  {
    id: "g7",
    domain: "Cloud Technology and Services",
    trap: "Using a presigned URL to give permanent third-party access.",
    why: "Presigned URLs are time-limited (great for 12-hour access) but expire. For ongoing programmatic access you'd use IAM roles/cross-account roles. Don't pick a temporary mechanism when the requirement is 'permanent'.",
  },
  {
    id: "g8",
    domain: "Cloud Technology and Services",
    trap: "Believing Lambda can run for hours or hold state between invocations.",
    why: "Lambda has a max timeout (currently 15 minutes) and is stateless — each invocation is isolated. For long-running or stateful workloads, use EC2, Fargate, or a Step Functions orchestration, not a single function.",
  },
  {
    id: "g9",
    domain: "Billing, Pricing and Support",
    trap: "Selecting On-Demand for a steady, 24/7, predictable workload.",
    why: "On-Demand is the most expensive per-hour option. For steady-state usage, Savings Plans or Reserved Instances deliver the lowest cost. Spot is cheapest but can be interrupted — wrong for critical steady workloads.",
  },
  {
    id: "g10",
    domain: "Billing, Pricing and Support",
    trap: "Expecting a Technical Account Manager (TAM) on the Business plan.",
    why: "A designated TAM is an Enterprise (and Enterprise On-Ramp) benefit. Basic, Developer, and Business plans do not include a TAM. The support-plan tiers and their features are heavily tested.",
  },
];

export default function GotchasPage() {
  return (
    <ContentShell
      eyebrow="Exam Traps"
      title="Gotchas"
      description="Common CLF-C02 traps that trip up test-takers. Read the trap, then reveal why the tempting answer is wrong."
    >
      <div className="flex flex-col gap-3">
        {GOTCHAS.map((g, i) => (
          <details
            key={g.id}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {g.domain}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">
                    <span className="mr-2 text-neutral-500">{i + 1}.</span>
                    {g.trap}
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-cyan-300 transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <Prose>
              <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">
                {g.why}
              </p>
            </Prose>
          </details>
        ))}
      </div>
    </ContentShell>
  );
}
