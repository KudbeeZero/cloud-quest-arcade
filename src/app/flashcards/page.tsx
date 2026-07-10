import ContentShell from "@/components/ContentShell";
import Flashcards from "@/components/Flashcards";

export default function FlashcardsPage() {
  return (
    <ContentShell
      eyebrow="Study Mode"
      title="Flashcards"
      description="Tap a card to flip it and review the answer. Filter by domain or difficulty to focus your study."
    >
      <Flashcards />
    </ContentShell>
  );
}
