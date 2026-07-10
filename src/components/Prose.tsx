import type { ReactNode } from "react";

// Consistent editorial styling for long-form content pages.
// Uses Tailwind 4 arbitrary descendant variants so headings, lists, and
// links inside children inherit the retro-arcade palette without a prose plugin.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="space-y-5 text-sm leading-relaxed text-neutral-300 sm:text-base
        [&_h2]:mt-9 [&_h2]:border-l-2 [&_h2]:border-cyan-400 [&_h2]:pl-3 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-white
        [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-cyan-200
        [&_p]:text-neutral-300
        [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
        [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5
        [&_li::marker]:text-neutral-500
        [&_a]:text-cyan-300 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition [&_a:hover]:text-cyan-100
        [&_strong]:font-semibold [&_strong]:text-white
        [&_blockquote]:border-l-2 [&_blockquote]:border-violet-400 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-400
        [&_code]:rounded [&_code]:bg-neutral-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-violet-200"
    >
      {children}
    </div>
  );
}
