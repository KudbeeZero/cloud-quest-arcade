import ContentShell from "@/components/ContentShell";
import Missions from "@/components/Missions";

export default function MissionsPage() {
  return (
    <ContentShell
      eyebrow="Daily Goals"
      title="Missions"
      description="Track today's study goals. Missions reset every day and are powered by your local run history."
    >
      <Missions />
    </ContentShell>
  );
}
