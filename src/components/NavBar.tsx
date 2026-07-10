"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/", label: "Arcade" },
  { href: "/missions", label: "Missions" },
] as const;

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300"
        >
          Cloud Quest Arcade
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-neutral-800 text-neutral-200 transition hover:border-white/30 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav
          aria-label="Primary"
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full border-b border-white/10 bg-neutral-900/98 px-4 py-2 md:static md:flex md:border-none md:bg-transparent md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-neutral-300 transition hover:bg-white/10 hover:text-white md:px-2 md:py-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
