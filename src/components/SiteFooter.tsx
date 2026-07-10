import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const studyLinks = siteConfig.nav.filter((n) => n.href !== "/");

  return (
    <footer className="border-t border-white/10 bg-neutral-950/60">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 font-black text-white">
              <span aria-hidden>🕹️</span> {siteConfig.name}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-neutral-400">
              A retro practice arcade for the AWS Certified Cloud Practitioner
              (CLF-C02) exam. Built to make short, daily study sessions stick.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Study
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              {studyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-cyan-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              {siteConfig.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-cyan-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Play
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/" className="transition hover:text-cyan-200">
                  Start a mission
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition hover:text-cyan-200">
                  Admin console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-neutral-500">
          <p>
            Independent study aid. Not affiliated with or endorsed by Amazon Web
            Services. AWS® and AWS Certified Cloud Practitioner™ are trademarks
            of Amazon.com, Inc.
          </p>
          <p className="mt-2">
            © {year} {siteConfig.name}. Original practice content.
          </p>
        </div>
      </div>
    </footer>
  );
}
