import Link from "next/link";
import questions from "@/data/questions";

const DOMAIN_ORDER = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
] as const;

const DOMAIN_BADGE: Record<string, string> = {
  "Cloud Concepts": "☁️",
  "Security and Compliance": "🛡️",
  "Cloud Technology and Services": "⚙️",
  "Billing, Pricing and Support": "💡",
};

const DOMAIN_COUNTS: Record<string, number> = questions.reduce(
  (acc, q) => {
    acc[q.domain] = (acc[q.domain] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

export default function MissionsPage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Missions
        </p>
        <h1 className="mt-2 text-2xl font-black text-white">
          Choose your mission
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          Select a domain to launch an arcade challenge.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3">
          {DOMAIN_ORDER.map((domain) => (
            <Link
              key={domain}
              href="/"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-base" aria-hidden>
                  {DOMAIN_BADGE[domain]}
                </span>
                <span className="text-sm font-semibold text-white">
                  {domain}
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                {DOMAIN_COUNTS[domain]} missions
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
