import Link from "next/link";
import Flashcards from "@/components/Flashcards";
import NavBar from "@/components/NavBar";

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Flashcards</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Flip, recall, and mark each concept as mastered. Reviews feed your
          streak and Exam Readiness Score.
        </p>
      </header>

      <div className="mt-8">
        <Flashcards />
      </div>

      <div className="mx-auto mt-6 max-w-md text-center">
        <Link
          href="/progress"
          className="text-xs font-semibold text-cyan-300 hover:underline"
        >
          View your progress &amp; readiness →
        </Link>
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>

      <NavBar />
    </main>
  );
}
