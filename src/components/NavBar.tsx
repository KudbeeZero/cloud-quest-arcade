"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Play", icon: "🎮" },
  { href: "/flashcards", label: "Cards", icon: "🃏" },
  { href: "/progress", label: "Progress", icon: "📈" },
  { href: "/admin", label: "Admin", icon: "⚙️" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 mt-6 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl py-2 text-center text-xs font-semibold transition ${
              active
                ? "bg-white/10 text-cyan-200"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span aria-hidden className="mr-1">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
