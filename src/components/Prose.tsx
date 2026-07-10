import type { ReactNode } from "react";

/**
 * Styled prose wrapper for long-form text content (explanations, gotchas, etc.).
 * Keeps spacing and color consistent across the arcade's secondary pages.
 */
export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-neutral-300">
      {children}
    </div>
  );
}
