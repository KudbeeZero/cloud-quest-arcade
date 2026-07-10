import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";

export default function TermsPage() {
  return (
    <ContentShell title="Terms of Use" backLabel="Home" backHref="/">
      <Prose>
        <p>
          By using Cloud Quest Arcade, you agree to the following terms.
        </p>
        <h3>Acceptable use</h3>
        <p>
          You may use this site for personal, non-commercial study and exam
          preparation. Do not attempt to scrape, redistribute, or monetize the
          content without permission.
        </p>
        <h3>Accuracy</h3>
        <p>
          Practice questions and explanations are original works based on general
          cloud knowledge. They are not reproduced from official AWS exam content and
          may contain errors. Always refer to the official AWS exam guide for
          authoritative information.
        </p>
        <h3>Availability</h3>
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties of any kind. We
          may modify or discontinue features at any time without notice.
        </p>
      </Prose>
    </ContentShell>
  );
}
