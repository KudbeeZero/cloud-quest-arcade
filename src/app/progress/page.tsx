import Link from "next/link";
import NavBar from "@/components/NavBar";
import ReadinessScore from "@/components/ReadinessScore";
import Missions from "@/components/Missions";
import ExamReadinessChecklist from "@/components/ExamReadinessChecklist";

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          Study Progress
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          Your rhythm of runs, reviews, and streaks — and how ready you are for
          the AWS Cloud Practitioner exam.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-5">
        <ReadinessScore />

        <Missions />

        <ExamReadinessChecklist />

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-4 text-center text-base font-black text-neutral-900 transition hover:brightness-110"
          >
            ▸ Start a run
          </Link>
          <Link
            href="/flashcards"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-base font-black text-neutral-200 transition hover:border-cyan-300/50"
          >
            🃏 Flashcards
          </Link>
        </div>
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>

      <NavBar />
    </main>
  );
}
