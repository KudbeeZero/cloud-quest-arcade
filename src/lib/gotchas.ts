// CLF-C02 exam-trap gotchas + the localStorage progress store for "reviewed"
// checkboxes. Mirrors the SSR-safe, useSyncExternalStore-friendly pattern from
// progress.ts: getSnapshot returns the raw localStorage string (a stable
// primitive) so React doesn't loop on a fresh parsed object — see the
// `useSyncExternalStore` rule in .kilocode/rules/memory-bank/context.md.

import type { Domain } from "./types";

export type GotchaTopicId =
  | "shared"
  | "regions"
  | "wellarch"
  | "pricing"
  | "compute"
  | "storage"
  | "databases"
  | "network"
  | "security"
  | "monitor"
  | "ha"
  | "cost";

export interface Gotcha {
  id: string;
  domain: Domain;
  topicId: GotchaTopicId;
  trap: string;
  why: string;
}

export const GOTCHAS: Gotcha[] = [
  // --- Cloud Concepts (10) ----------------------------------------------------
  {
    id: "g1",
    domain: "Cloud Concepts",
    topicId: "ha",
    trap: "Assuming elasticity and scalability are the same thing.",
    why: "Scalability is the ability to handle growing load (add capacity). Elasticity is automatically adding AND removing capacity to match demand. The exam loves asking which one 'shrinks back down' — that's elasticity.",
  },
  {
    id: "g2",
    domain: "Cloud Concepts",
    topicId: "regions",
    trap: "Picking 'Edge location' when a question asks where your primary resources live.",
    why: "Edge locations are for CloudFront caching, not where you run compute or store primary data. Resources run in Regions and Availability Zones. Edge locations sit outside Regions purely to reduce latency.",
  },
  {
    id: "g11",
    domain: "Cloud Concepts",
    topicId: "wellarch",
    trap: "Remembering '5 pillars' of the Well-Architected Framework.",
    why: "The Well-Architected Framework has SIX pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. The Sustainability pillar was added in 2021 — older study guides still list five.",
  },
  {
    id: "g12",
    domain: "Cloud Concepts",
    topicId: "regions",
    trap: "Assuming a service is available in every AWS Region.",
    why: "Not every service is in every Region — newer services typically launch in a few Regions first (often us-east-1, us-west-2, eu-west-1) and roll out later. Always check the regional service availability page before assuming global coverage.",
  },
  {
    id: "g13",
    domain: "Cloud Concepts",
    topicId: "wellarch",
    trap: "Calling the cloud a 'utility' without mentioning the trade-offs.",
    why: "Yes, the trade-off model (CapEx → OpEx) is a hallmark of cloud, but the exam also tests downsides: vendor lock-in, unpredictable variable costs, and less direct control over the infrastructure. Pros AND cons appear in scenario questions.",
  },
  {
    id: "g14",
    domain: "Cloud Concepts",
    topicId: "ha",
    trap: "Designing for high availability using a single Availability Zone.",
    why: "HA in AWS means spreading across at least TWO AZs in a Region. A single AZ is a single point of failure. For multi-Region resilience, add Route 53 + cross-Region replication on top of multi-AZ.",
  },
  {
    id: "g15",
    domain: "Cloud Concepts",
    topicId: "ha",
    trap: "Confusing vertical scaling with horizontal scaling.",
    why: "Vertical = bigger instance type (scale up). Horizontal = more instances behind a load balancer (scale out). Cloud-friendly architectures prefer horizontal — Auto Scaling Groups and ELB are horizontal, not just 'a bigger box'.",
  },
  {
    id: "g16",
    domain: "Cloud Concepts",
    topicId: "regions",
    trap: "Treating AWS GovCloud as 'just another Region' for commercial workloads.",
    why: "GovCloud (us-gov-west-1, us-gov-east-1) is a separate, isolated AWS partition designed for U.S. government workloads. It requires U.S. persons/entities to sign up and is not connected to commercial AWS accounts or IAM.",
  },
  {
    id: "g17",
    domain: "Cloud Concepts",
    topicId: "cost",
    trap: "Forgetting that data transfer OUT of AWS is billable.",
    why: "Data transfer IN to AWS is free; data transfer OUT is charged per GB and is often the single largest surprise in a cloud bill. Transfer between AZs in the same Region is also billable. Plan around egress, not ingress.",
  },

  // --- Security and Compliance (6) --------------------------------------------
  {
    id: "g3",
    domain: "Security and Compliance",
    topicId: "shared",
    trap: "Thinking AWS patches the guest OS on EC2 for you.",
    why: "Under the shared responsibility model, AWS manages the physical hardware and hypervisor, but YOU patch the guest OS, applications, and firewall config on EC2. Confusing this is one of the most common wrong answers.",
  },
  {
    id: "g4",
    domain: "Security and Compliance",
    topicId: "security",
    trap: "Choosing IAM user access keys for an app running on EC2.",
    why: "Hard-coding long-lived access keys is an anti-pattern. Attach an IAM role to the instance instead — it provides temporary, automatically rotated credentials with no secrets in your code.",
  },
  {
    id: "g5",
    domain: "Security and Compliance",
    topicId: "monitor",
    trap: "Mixing up AWS Config, CloudTrail, and CloudWatch.",
    why: "CloudTrail = who did what (API activity/audit). CloudWatch = metrics, logs, and alarms (operational monitoring). Config = resource configuration history and compliance rules. Know which 'lens' each one provides.",
  },
  {
    id: "g18",
    domain: "Security and Compliance",
    topicId: "shared",
    trap: "Picking 'AWS is responsible for security IN the cloud'.",
    why: "AWS is responsible for security OF the cloud (hardware, Regions, AZs, hypervisor). YOU are responsible for security IN the cloud (data, OS, network config, IAM, encryption). 'IN' vs 'OF' is a classic two-letter trap.",
  },
  {
    id: "g19",
    domain: "Security and Compliance",
    topicId: "security",
    trap: "Putting IAM users in a group with AdministratorAccess for an app.",
    why: "IAM users with long-lived credentials are discouraged. Prefer IAM roles + federation (SAML/OIDC) for human and application access. For AWS-account-to-account access, use cross-account roles — never share access keys.",
  },
  {
    id: "g20",
    domain: "Security and Compliance",
    topicId: "security",
    trap: "Confusing AWS Shield Standard with AWS Shield Advanced.",
    why: "Shield Standard is free, automatically on for every AWS customer, and protects against common DDoS at the network/transport layer. Shield Advanced is a paid service with 24/7 DRT response, cost protection, and granular attack visibility.",
  },

  // --- Cloud Technology and Services (6) --------------------------------------
  {
    id: "g6",
    domain: "Cloud Technology and Services",
    topicId: "databases",
    trap: "Reaching for DynamoDB when a relational schema with joins is required.",
    why: "DynamoDB is a NoSQL key-value/document store — great for scale, not for ad-hoc relational queries. For PostgreSQL/MySQL with SQL and joins, the answer is Amazon RDS. Match the data model to the service.",
  },
  {
    id: "g7",
    domain: "Cloud Technology and Services",
    topicId: "security",
    trap: "Using a presigned URL to give permanent third-party access.",
    why: "Presigned URLs are time-limited (great for 12-hour access) but expire. For ongoing programmatic access you'd use IAM roles/cross-account roles. Don't pick a temporary mechanism when the requirement is 'permanent'.",
  },
  {
    id: "g8",
    domain: "Cloud Technology and Services",
    topicId: "compute",
    trap: "Believing Lambda can run for hours or hold state between invocations.",
    why: "Lambda has a max timeout (currently 15 minutes) and is stateless — each invocation is isolated. For long-running or stateful workloads, use EC2, Fargate, or a Step Functions orchestration, not a single function.",
  },
  {
    id: "g21",
    domain: "Cloud Technology and Services",
    topicId: "storage",
    trap: "Picking S3 Glacier Deep Archive for data you need to read every day.",
    why: "Glacier Deep Archive has retrieval times of 12+ hours and the lowest storage cost — perfect for years-long archives. For frequently accessed hot data use S3 Standard; for infrequent access use S3 Standard-IA or Glacier Instant Retrieval.",
  },
  {
    id: "g22",
    domain: "Cloud Technology and Services",
    topicId: "network",
    trap: "Confusing security groups with network ACLs.",
    why: "Security groups are STATEFUL and operate at the ENI/instance level (allow rules only). Network ACLs are STATELESS and operate at the subnet level (allow AND deny rules). For a single instance, the SG is usually what you need.",
  },
  {
    id: "g23",
    domain: "Cloud Technology and Services",
    topicId: "compute",
    trap: "Running a relational database directly on EC2 when RDS fits.",
    why: "RDS gives you managed patching, automated backups, Multi-AZ failover, and read replicas. EC2 + your own DB software is only the right answer when you need a non-managed engine or unusual OS-level control.",
  },

  // --- Billing, Pricing and Support (3) ---------------------------------------
  {
    id: "g9",
    domain: "Billing, Pricing and Support",
    topicId: "pricing",
    trap: "Selecting On-Demand for a steady, 24/7, predictable workload.",
    why: "On-Demand is the most expensive per-hour option. For steady-state usage, Savings Plans or Reserved Instances deliver the lowest cost. Spot is cheapest but can be interrupted — wrong for critical steady workloads.",
  },
  {
    id: "g10",
    domain: "Billing, Pricing and Support",
    topicId: "shared",
    trap: "Expecting a Technical Account Manager (TAM) on the Business plan.",
    why: "A designated TAM is an Enterprise (and Enterprise On-Ramp) benefit. Basic, Developer, and Business plans do not include a TAM. The support-plan tiers and their features are heavily tested.",
  },
  {
    id: "g24",
    domain: "Billing, Pricing and Support",
    topicId: "cost",
    trap: "Confusing AWS Budgets with AWS Cost Explorer.",
    why: "Cost Explorer is the visualization/analysis tool (past + forecasted spend by service, region, tag). Budgets are the ALERTING tool — you set a threshold and Budgets emails you when actual or forecasted spend crosses it.",
  },
  {
    id: "g25",
    domain: "Billing, Pricing and Support",
    topicId: "cost",
    trap: "Forgetting the AWS Free Tier is not the same as 'always free'.",
    why: "The Free Tier has three flavors: 'Always Free' (Lambda, DynamoDB low tier), '12 Months Free' (EC2 t2.micro, S3, etc. — for new accounts), and 'Trials' (short-term service-specific). Beyond 12 months or the trial limit, you're on the regular price.",
  },
];

const GOTCHA_KEY = "cq_gotchas";
const GOTCHA_EVENT = "cq_gotchas";

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function readRaw(): string | null {
  const ls = storage();
  if (!ls) return null;
  try {
    return ls.getItem(GOTCHA_KEY);
  } catch {
    return null;
  }
}

export function loadGotchaProgress(): Record<string, boolean> {
  const raw = readRaw();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function saveGotchaProgress(next: Record<string, boolean>): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.setItem(GOTCHA_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / disabled storage
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GOTCHA_EVENT));
  }
}

export function toggleGotchaReviewed(
  current: Record<string, boolean>,
  id: string,
): Record<string, boolean> {
  const next = { ...current, [id]: !current[id] };
  saveGotchaProgress(next);
  return next;
}

export function getGotchaCount(): number {
  return GOTCHAS.length;
}

export function countReviewed(progress: Record<string, boolean>): number {
  let n = 0;
  for (const g of GOTCHAS) if (progress[g.id]) n += 1;
  return n;
}

export function reviewedPct(progress: Record<string, boolean>): number {
  if (GOTCHAS.length === 0) return 0;
  return Math.round((countReviewed(progress) / GOTCHAS.length) * 100);
}

// --- useSyncExternalStore-friendly subscription -----------------------------
// getSnapshot returns the RAW localStorage string (stable primitive) so React
// doesn't loop on a fresh parsed object — see the `useSyncExternalStore` rule
// in .kilocode/rules/memory-bank/context.md.

export function subscribeGotchas(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(GOTCHA_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(GOTCHA_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getGotchasSnapshot(): string | null {
  return readRaw();
}

export function getGotchasServerSnapshot(): string | null {
  return null;
}
