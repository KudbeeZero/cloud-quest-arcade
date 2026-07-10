import Link from "next/link";

const TIPS = [
  "Short daily bursts beat cramming — one quiz run a day keeps the streak alive.",
  "Flip a flashcard twice: once to recall, once to confirm. Spacing beats re-reading.",
  "After every wrong answer, read the explanation — that's the real learning moment.",
  "Tag your 'gotchas' (the explanations that surprise you) and revisit them often.",
  "Aim for 80%+ accuracy before booking the real exam.",
];

export default function StudyTips() {
  const tip = TIPS[0];
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
        💡 Study Tip
      </p>
      <p className="mt-1 text-sm text-neutral-200">{tip}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Link
          href="/flashcards"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-cyan-200 transition hover:border-cyan-300/50"
        >
          Review flashcards →
        </Link>
        <Link
          href="/progress"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-violet-200 transition hover:border-violet-300/50"
        >
          See your progress →
        </Link>
      </div>
    </div>
  );
}
