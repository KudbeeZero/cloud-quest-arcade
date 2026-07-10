"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900/90 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-black tracking-tight text-white"
        >
          <span aria-hidden>🕹️</span>
          <span className="text-sm sm:text-base">{siteConfig.name}</span>
        </Link>

        <ul className="ml-auto flex items-center gap-1 overflow-x-auto">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-white/10 text-cyan-200"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
