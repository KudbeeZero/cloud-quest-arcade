import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import AgentHub from "@/components/AgentHub";

export const metadata = {
  title: "Agent Hub — Cloud Quest Arcade",
  description:
    "Lightning AI agent dashboard for GrowPod, Study Coach, HERMES, and the AWS Exam Coach.",
};

export default function AgentHubPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Lightning AI
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Agent Hub</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-300">
          Monitor the arcade&apos;s agent swarm, trigger audits, and queue new
          study content.
        </p>
      </header>

      <div className="mt-8">
        <AgentHub />
      </div>

      <SiteNav />
      <SiteFooter />
    </main>
  );
}
