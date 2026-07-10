import ArcadeGame from "@/components/ArcadeGame";
import ContentShell from "@/components/ContentShell";

export default function Home() {
  return (
    <ContentShell
      title="AWS Cloud Practitioner Trainer"
      description="A mobile-first arcade command center for the AWS Certified Cloud Practitioner (CLF-C02) exam."
    >
      <ArcadeGame />
    </ContentShell>
  );
}
