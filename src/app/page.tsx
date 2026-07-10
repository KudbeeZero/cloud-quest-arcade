import ArcadeGame from "@/components/ArcadeGame";

export default function Home() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12"
    >
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

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
