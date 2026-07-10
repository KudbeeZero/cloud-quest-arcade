import type { ReactNode } from "react";
import Link from "next/link";
import { Prose } from "./Prose";

export function ContentShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <article>
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base text-neutral-300">{description}</p>
          )}
        </header>

        <Prose>{children}</Prose>

        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5 text-center">
          <p className="text-sm text-neutral-200">
            Put these ideas to the test in the arcade.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-black text-neutral-900 transition hover:brightness-110"
          >
            ▸ Play the arcade
          </Link>
        </div>
      </article>
    </main>
  );
}
