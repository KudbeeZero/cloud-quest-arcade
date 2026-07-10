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
  {
    id: "g11",
    domain: "Cloud Concepts",
    trap: "Treating high availability and fault tolerance as interchangeable.",
    why: "High availability minimizes downtime through redundancy and fast recovery. Fault tolerance goes further: the system continues operating without interruption even when a component fails. The exam often asks which design survives a failure with zero downtime — that is fault tolerance.",
  },
  {
    id: "g12",
    domain: "Cloud Concepts",
    trap: "Assuming the AWS Free Tier has no usage limits.",
    why: "The Free Tier is always free for 12 months for new accounts, or always-free for specific services, but each offer has concrete limits (e.g., 750 hours of t2/t3.micro per month, 5 GB of S3 standard storage). Exceeding those limits incurs normal charges.",
  },
  {
    id: "g13",
    domain: "Security and Compliance",
    trap: "Picking Security Group when the question really asks about subnet-level rules.",
    why: "Security Groups are stateful and operate at the instance (ENI) level. Network ACLs are stateless and operate at the subnet level. If the scenario needs to allow or deny traffic for an entire subnet, the answer is NACL, not Security Group.",
  },
  {
    id: "g14",
    domain: "Security and Compliance",
    trap: "Using the AWS account root user for daily administration.",
    why: "The root user has unrestricted access and should be used only for a small set of tasks (e.g., changing account settings, closing the account). Create IAM users or roles with least privilege for daily work, and enable MFA on the root account.",
  },
  {
    id: "g15",
    domain: "Security and Compliance",
    trap: "Thinking AWS KMS only encrypts data at rest.",
    why: "KMS is a key management service. It can generate and control keys used for both server-side and client-side encryption, envelope encryption, and integration with many AWS services. KMS itself does not store your data; it stores and protects the keys used to encrypt it.",
  },
  {
    id: "g16",
    domain: "Cloud Technology and Services",
    trap: "Choosing S3 Standard for data accessed once per quarter.",
    why: "S3 Standard is for frequently accessed data. For infrequently accessed data, S3 Standard-IA or S3 One Zone-IA cut cost in exchange for retrieval fees and minimum-duration charges. For archive data, S3 Glacier or Glacier Deep Archive are cheaper still. Match the access pattern to the storage class.",
  },
  {
    id: "g17",
    domain: "Cloud Technology and Services",
    trap: "Expecting Amazon RDS to automatically scale read traffic horizontally.",
    why: "A single RDS instance handles both reads and writes. To scale reads horizontally, create read replicas. RDS does not auto-provision read replicas; you must create and manage them explicitly. For automatic scaling, Aurora Serverless is the closer fit.",
  },
  {
    id: "g18",
    domain: "Cloud Technology and Services",
    trap: "Confusing SNS, SQS, and EventBridge for the same use case.",
    why: "SNS is a pub/sub notification service that pushes messages to subscribers. SQS is a managed message queue that consumers poll. EventBridge is a serverless event bus that routes events based on rules and schedules. Pick SNS for fan-out notifications, SQS for decoupling and buffering, EventBridge for event routing.",
  },
  {
    id: "g19",
    domain: "Billing, Pricing and Support",
    trap: "Believing AWS Budgets can automatically stop resources when a limit is exceeded.",
    why: "AWS Budgets tracks spend and sends alerts, but it does not shut down resources. To take automated action, you need AWS Cost Anomaly Detection alerts plus custom automation, or service-specific controls. Do not pick Budgets when the requirement is to stop a resource.",
  },
  {
    id: "g20",
    domain: "Billing, Pricing and Support",
    trap: "Assuming consolidated billing in AWS Organizations gives automatic volume discounts.",
    why: "Consolidated billing rolls up usage from all member accounts so the organization can reach volume pricing tiers faster, but the discount is not automatic for every service. Some benefits like Reserved Instance/Savings Plan discounts can be shared across accounts, but you still have to purchase them.",
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
