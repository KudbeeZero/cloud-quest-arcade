import ArcadeGame from "@/components/ArcadeGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-12 text-white">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          AWS Cloud Practitioner Trainer
        </h1>
        <p className="mt-3 text-neutral-300">
          A retro-flavored practice arcade for the AWS Certified Cloud
          Practitioner (CLF-C02) exam.
        </p>
      </header>

      <div className="mt-10">
        <ArcadeGame />
      </div>

      <footer className="mx-auto mt-12 max-w-2xl text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
