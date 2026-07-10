import Link from "next/link";
import ArcadeGame from "@/components/ArcadeGame";
import SiteNav from "@/components/SiteNav";

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
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
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

      <div className="mt-8">
        <ArcadeGame />
      </div>

      <section className="mx-auto mt-10 max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Explore the arcade
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DISCOVERY.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50 hover:bg-white/10"
            >
              <span aria-hidden className="text-2xl leading-none">
                {d.icon}
              </span>
              <span>
                <span className="block text-sm font-bold text-white">
                  {d.title}
                </span>
                <span className="mt-0.5 block text-xs text-neutral-400">
                  {d.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteNav />

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
