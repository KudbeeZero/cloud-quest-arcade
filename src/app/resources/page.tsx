import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

const RESOURCES = [
  {
    title: "AWS Cloud Practitioner Exam Guide",
    desc: "The official breakdown of exam content, question formats, and scoring.",
  },
  {
    title: "AWS Skill Builder — Cloud Practitioner Learning Plan",
    desc: "Free and paid digital courses mapped directly to the CLF-C02 exam domains.",
  },
  {
    title: "AWS Well-Architected Framework",
    desc: "A foundational read on operational excellence, security, reliability, performance efficiency, and cost optimization.",
  },
  {
    title: "AWS Pricing Calculator",
    desc: "Estimate costs for services before you launch real workloads.",
  },
  {
    title: "AWS Free Tier",
    desc: "Hands-on practice with limited free usage for many core services.",
  },
  {
    title: "AWS Documentation",
    desc: "The canonical source for service details, FAQs, and whitepapers.",
  },
];

export default function ResourcesPage() {
  return (
    <ContentShell
      title="Resources"
      description="Curated references to deepen your AWS knowledge."
      backLabel="Home"
      backHref="/"
    >
      <Prose>
        <ul>
          {RESOURCES.map((r) => (
            <li key={r.title}>
              <strong>{r.title}</strong> &mdash; {r.desc}
            </li>
          ))}
        </ul>
        <h3>Using this list</h3>
        <p>
          Start with the Exam Guide to understand the blueprint, then use Skill
          Builder for structured learning. The rest are reference material you can
          dip into as questions come up during study.
        </p>
      </Prose>
    </ContentShell>
  );
}
