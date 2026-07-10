import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import StudyDashboard from "@/components/StudyDashboard";

export const metadata = {
  title: "Study Dashboard — Cloud Quest Arcade",
  description:
    "A lightweight command center for readiness, streaks, and quick study navigation.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Study Dashboard</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-300">
          Your daily command center: readiness, streaks, and one-tap study tools.
        </p>
      </header>

      <div className="mt-8">
        <StudyDashboard />
      </div>

      <SiteNav />
      <SiteFooter />
    </main>
  );
}
