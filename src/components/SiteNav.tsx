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
      className="sticky bottom-0 z-10 mt-8 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur sm:grid-cols-6"
    >
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-2 py-2 text-center text-xs font-semibold transition ${
              active
                ? "bg-white/10 text-cyan-200"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span aria-hidden className="block text-base leading-none">
              {item.icon}
            </span>
            <span className="mt-1 block leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
