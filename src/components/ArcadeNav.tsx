const NAV = [
  { href: "/", label: "Home" },
  { href: "/domain-guide", label: "Domains" },
  { href: "/study-tips", label: "Tips" },
  { href: "/privacy", label: "Legal" },
] as const;

export default function ArcadeNav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 mt-6 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur"
    >
      {NAV.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="rounded-xl py-2 text-center text-xs font-semibold text-neutral-300 transition hover:bg-white/5 hover:text-cyan-200"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
