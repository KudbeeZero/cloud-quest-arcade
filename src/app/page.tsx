import Link from "next/link";
import ArcadeGame from "@/components/ArcadeGame";

type Mode = {
  href: string;
  title: string;
  blurb: string;
  glyph: string;
  accent: string;
  primary?: boolean;
};

const MODES: Mode[] = [
  {
    href: "#play",
    title: "Arcade Quiz",
    blurb: "Jump into a timed run across all AWS domains.",
    glyph: "▶",
    accent: "from-cyan-500 to-sky-600",
    primary: true,
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    blurb: "Drill core concepts one card at a time.",
    glyph: "▤",
    accent: "from-fuchsia-500 to-pink-600",
  },
  {
    href: "/missions",
    title: "Missions",
    blurb: "Tackle focused objective-based challenges.",
    glyph: "★",
    accent: "from-amber-400 to-orange-500",
  },
  {
    href: "/gotchas",
    title: "Gotchas",
    blurb: "Learn the tricky edge cases that trip people up.",
    glyph: "!",
    accent: "from-rose-500 to-red-600",
  },
  {
    href: "/progress",
    title: "Progress",
    blurb: "Track your scores, XP, and streaks over time.",
    glyph: "◴",
    accent: "from-emerald-400 to-green-600",
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    blurb: "See how you rank on the arcade scoreboard.",
    glyph: "♛",
    accent: "from-violet-500 to-purple-600",
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
        <p className="mt-2 text-sm text-neutral-300">
          A mobile-first arcade command center for the AWS Certified Cloud
          Practitioner (CLF-C02) exam.
        </p>
      </header>

      <section className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map((mode) => {
          const classes = mode.primary
            ? "sm:col-span-2 lg:col-span-3"
            : "";
          return (
            <Link
              key={mode.title}
              href={mode.href}
              className={`group relative block overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800/60 p-5 transition hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-lg hover:shadow-black/30 ${classes}`}
            >
              <div
                className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mode.accent} text-xl font-black text-neutral-900`}
              >
                {mode.glyph}
              </div>
              <h2 className="text-base font-bold text-white">{mode.title}</h2>
              <p className="mt-1 text-sm text-neutral-400">{mode.blurb}</p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-cyan-300 opacity-0 transition group-hover:opacity-100">
                {mode.primary ? "Start playing →" : "Open →"}
              </span>
            </Link>
          );
        })}
      </section>

      <section id="play" className="mt-10 scroll-mt-6">
        <ArcadeGame />
      </section>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
