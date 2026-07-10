import Link from "next/link";
import ArcadeGame from "@/components/ArcadeGame";

const DISCOVER = [
  {
    href: "/flashcards",
    emoji: "🃏",
    title: "Flashcards",
    desc: "Flip through key concepts one card at a time.",
    accent: "from-cyan-400/20 to-cyan-400/5 hover:border-cyan-400/50",
  },
  {
    href: "/missions",
    emoji: "🎯",
    title: "Missions",
    desc: "Structured study paths across every domain.",
    accent: "from-violet-400/20 to-violet-400/5 hover:border-violet-400/50",
  },
  {
    href: "/gotchas",
    emoji: "⚡",
    title: "Gotchas",
    desc: "Tricky distractors and how to dodge them.",
    accent: "from-fuchsia-400/20 to-fuchsia-400/5 hover:border-fuchsia-400/50",
  },
  {
    href: "/progress",
    emoji: "📈",
    title: "Progress",
    desc: "Track XP, streaks, and mastered domains.",
    accent: "from-emerald-400/20 to-emerald-400/5 hover:border-emerald-400/50",
  },
  {
    href: "/leaderboard",
    emoji: "🏆",
    title: "Leaderboard",
    desc: "See how you rank against other cadets.",
    accent: "from-amber-400/20 to-amber-400/5 hover:border-amber-400/50",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          AWS Cloud Practitioner Trainer
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-300">
          A mobile-first arcade command center for the AWS Certified Cloud
          Practitioner (CLF-C02) exam.
        </p>
      </header>

      <section className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {DISCOVER.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-4 transition`}
          >
            <span aria-hidden className="text-2xl">
              {card.emoji}
            </span>
            <span className="mt-2 text-sm font-bold text-white">
              {card.title}
            </span>
            <span className="mt-1 text-xs leading-snug text-neutral-400">
              {card.desc}
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Daily Challenge
          </h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <ArcadeGame />
      </section>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
