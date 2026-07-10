"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Arcade" },
  { href: "/study-tips", label: "Study Tips" },
  { href: "/domain-guide", label: "Domains" },
  { href: "/gotchas", label: "Gotchas" },
  { href: "/progress", label: "Progress" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/resources", label: "Resources" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              ☁️
            </span>
            <span className="text-sm font-black tracking-wider text-white">
              CLOUD QUEST
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-white/10 text-cyan-300"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/admin"
            className="hidden md:block rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-300 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
