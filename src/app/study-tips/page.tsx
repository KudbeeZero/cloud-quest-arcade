import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

export default function StudyTipsPage() {
  return (
    <ContentShell
      title="Study Tips"
      description="Practical strategies for CLF-C02 prep that fit a busy schedule."
      backLabel="Home"
      backHref="/"
    >
      <Prose>
        <h3>Treat it like a mini sprint, not a marathon</h3>
        <p>
          The Cloud Practitioner exam covers breadth more than depth. Short, daily
          sessions (15&ndash;30 minutes) beat occasional cramming because they
          reinforce recall without fatigue.
        </p>

        <h3>Start with the four domains</h3>
        <p>
          The exam is weighted across Cloud Concepts, Security and Compliance, Cloud
          Technology and Services, and Billing, Pricing and Support. Map your weak
          spots early so you can spend more time where the gaps are.
        </p>

        <h3>Read the question stem twice</h3>
        <p>
          Many trap answers play on wording. The first read gets the gist; the second
          read catches qualifiers like &ldquo;MOST cost-effective,&rdquo;
          &ldquo;LEAST operational overhead,&rdquo; or &ldquo;to meet compliance
          requirements.&rdquo; Those words flip the correct answer.
        </p>

        <h3>Eliminate, then guess</h3>
        <p>
          Even if you are unsure, remove obviously wrong answers first. The remaining
          choices are easier to evaluate and guessing becomes educated rather than
          random.
        </p>

        <h3>Review wrong answers intentionally</h3>
        <p>
          The arcade tracks your accuracy per question. After each run, skim the
          explanations for the ones you missed. Re-reading the explanation is one of
          the highest-leverage study moves you can make.
        </p>
      </Prose>
    </ContentShell>
  );
}
