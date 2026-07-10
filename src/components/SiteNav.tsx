"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/flashcards", label: "Flashcards", icon: "🃏" },
  { href: "/missions", label: "Missions", icon: "🎯" },
  { href: "/gotchas", label: "Gotchas", icon: "⚠️" },
  { href: "/progress", label: "Progress", icon: "📈" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-10 mt-8 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur"
    >
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-3 text-center transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:min-h-0 sm:py-2 ${
                  active
                    ? "bg-gradient-to-br from-cyan-500/25 to-violet-500/20 text-cyan-100 ring-1 ring-inset ring-cyan-400/30"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid h-8 w-8 place-items-center rounded-full text-lg leading-none sm:h-7 sm:w-7 sm:text-base ${
                    active
                      ? "bg-cyan-400/15"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="mt-1.5 text-[11px] font-semibold leading-none sm:text-xs">
                  {item.label}
                </span>
                {active && (
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-cyan-300 sm:mt-1" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
