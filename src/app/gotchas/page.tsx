import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

const TRAPS = [
  {
    title: "Region vs. Availability Zone",
    trap: "Assuming Regions and AZs are interchangeable or that resources move automatically.",
    truth:
      "A Region is a geographic area containing multiple AZs. AZs are isolated locations within a Region with independent power and networking. Most AWS resources are Region-scoped, not global. If a question mentions &ldquo;fault tolerance&rdquo; or &ldquo;high availability&rdquo; across locations, think AZs first, then Regions for disaster recovery.",
  },
  {
    title: "Shared Responsibility Model",
    trap: "Thinking AWS is fully responsible for security &ldquo;in the cloud&rdquo;.",
    truth:
      "AWS manages security <em>of</em> the cloud (hardware, software, facilities). You manage security <em>in</em> the cloud (your data, IAM permissions, OS patches, network config). If a question asks who patches the EC2 guest OS, the answer is you. If it asks who patches the Xen hypervisor, the answer is AWS.",
  },
  {
    title: "IAM Best Practices",
    trap: "Using the root account for daily tasks or embedding keys in code.",
    truth:
      "Root has unrestricted access and should be locked away. Use IAM users, groups, and roles for least privilege. Never leave long-lived access keys sitting in apps. Prefer IAM roles over keys whenever possible so credentials rotate automatically.",
  },
  {
    title: "Pricing Models",
    trap: "Picking Reserved Instances for unpredictable or short-term workloads.",
    truth:
      "On-Demand is the most flexible but most expensive. Reserved Instances save money for steady, predictable usage. Savings Plans give billing discounts across compute services regardless of instance family. Spot Instances are cheapest but can be reclaimed&mdash;great for fault-tolerant, batch workloads, not critical production.",
  },
  {
    title: "Database Choices",
    trap: "Defaulting to RDS because it is the only managed database option.",
    truth:
      "Use Amazon RDS for relational workloads with standard OLTP patterns. Use Amazon DynamoDB when you need single-digit nanosecond latency, flexible schemas, or massive scale. Use Amazon Redshift for analytics and data warehousing. Use Amazon ElastiCache (Redis/Memcached) when you need caching, not a primary database.",
  },
  {
    title: "Consistency Models",
    trap: "Confusing eventual consistency with strong consistency in exam answers.",
    truth:
      "Strong consistency reads the latest write immediately. Eventual consistency returns data that is eventually consistent but might lag behind. If the question asks for &ldquo;immediate read-after-write consistency,&rdquo; look for DynamoDB with strongly consistent reads (or read from a leader in a replicated system). Eventual consistency is cheaper and faster but not always correct.",
  },
];

export default function GotchasPage() {
  return (
    <ContentShell
      title="Gotchas"
      description="Common exam traps and the reasoning behind them."
      backLabel="Home"
      backHref="/"
    >
      <Prose>
        <p>
          Exam questions are designed to test whether you truly understand a concept
          or only recognize the keyword. These traps show up repeatedly on CLF-C02
          practice tests:
        </p>
        {TRAPS.map((t) => (
          <div
            key={t.title}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h3>{t.title}</h3>
            <p>
              <strong className="text-rose-300">Trap:</strong> {t.trap}
            </p>
            <p>
              <strong className="text-emerald-300">Truth:</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: t.truth }} />
            </p>
          </div>
        ))}
        <h3>How to practice</h3>
        <p>
          When you see a question with a strong adjective like <strong>MOST</strong>,
          <strong> LEAST</strong>, <strong>ALWAYS</strong>, or <strong>NEVER</strong>,
          slow down. Those words often distinguish between a true concept and a
          popular misconception. Try explaining the concept out loud before choosing
          an answer.
        </p>
      </Prose>
    </ContentShell>
  );
}
