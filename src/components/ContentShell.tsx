import Link from "next/link";

type ContentShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export default function ContentShell({
  children,
  title,
  description,
  backHref,
  backLabel = "Back",
}: ContentShellProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {(backHref || description) && (
        <div className="mb-6">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
            >
              &larr; {backLabel}
            </Link>
          )}
          {description && (
            <p className="mt-2 text-sm text-neutral-400">{description}</p>
          )}
        </div>
      )}
      <h1 className="text-2xl font-black text-white sm:text-3xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}
