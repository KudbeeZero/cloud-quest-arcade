import type { ReactNode } from "react";
import SiteNav from "./SiteNav";

interface ContentShellProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
}

/**
 * Consistent page chrome: a centered, mobile-first column with a header and the
 * global SiteNav. Use for every secondary page so navigation stays uniform.
 */
export default function ContentShell({
  title,
  eyebrow,
  description,
  children,
}: ContentShellProps) {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-md">
        <header className="text-center">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">{title}</h1>
          {description && (
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-300">
              {description}
            </p>
          )}
        </header>

        <div className="mt-8">{children}</div>

        <SiteNav />

        <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
          Original practice content. Not affiliated with or endorsed by Amazon
          Web Services.
        </footer>
      </div>
    </main>
  );
}
