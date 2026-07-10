import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

export default function DisclaimerPage() {
  return (
    <ContentShell title="Disclaimer" backLabel="Home" backHref="/">
      <Prose>
        <p>
          Cloud Quest Arcade is an independent study aid and is <strong>not affiliated
          with, endorsed by, or sponsored by Amazon Web Services, Inc.</strong>
        </p>
        <h3>Original content</h3>
        <p>
          All practice questions, explanations, and study materials are original
          works created for learning purposes. They paraphrase general cloud
          concepts and do not reproduce official exam questions.
        </p>
        <h3>No guarantees</h3>
        <p>
          Using this tool does not guarantee you will pass any AWS certification
          exam. Exam content and format are subject to change. Always consult the
          official AWS certification website for the latest exam guide and policies.
        </p>
        <h3>Trademarks</h3>
        <p>
          AWS, Amazon Web Services, and the AWS certification marks are trademarks of
          Amazon.com, Inc. or its affiliates. Cloud Quest Arcade claims no ownership
          over these marks.
        </p>
      </Prose>
    </ContentShell>
  );
}
