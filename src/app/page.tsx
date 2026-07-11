import Link from "next/link";
import ArcadeGame from "@/components/ArcadeGame";
import StreakCounter from "@/components/StreakCounter";

const DISCOVERY = [
  {
    href: "/flashcards",
    icon: "🃏",
    title: "Flashcards",
    desc: "Flip through the question bank to memorize concepts.",
  },
  {
    href: "/missions",
    icon: "🎯",
    title: "Missions",
    desc: "Daily study goals powered by your run history.",
  },
  {
    href: "/gotchas",
    icon: "⚠️",
    title: "Gotchas",
    desc: "Common exam traps and how to avoid them.",
  },
  {
    href: "/progress",
    icon: "📈",
    title: "Progress",
    desc: "Run history, stats, and domain accuracy.",
  },
  {
    href: "/leaderboard",
    icon: "🏆",
    title: "Leaderboard",
    desc: "Your local top scores and a share button.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          AWS Cloud Practitioner Trainer
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          A mobile-first arcade command center for the AWS Certified Cloud
          Practitioner (CLF-C02) exam.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <StreakCounter />
        {DISCOVERY.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/50"
          >
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-xl"
            >
              {card.icon}
            </span>
            <span>
              <span className="block text-sm font-bold text-white">
                {card.title}
              </span>
              <span className="block text-xs text-neutral-400">{card.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ArcadeGame />
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
