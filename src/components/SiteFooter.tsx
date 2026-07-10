import Link from "next/link";

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-lg">
              ☁️
            </span>
            <span className="text-sm font-black tracking-wider text-neutral-400">
              CLOUD QUEST
            </span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6 text-xs">
            <Link href="/privacy" className="text-neutral-500 hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="text-neutral-500 hover:text-white transition">
              Terms
            </Link>
            <Link href="/disclaimer" className="text-neutral-500 hover:text-white transition">
              Disclaimer
            </Link>
            <Link href="/resources" className="text-neutral-500 hover:text-white transition">
              Resources
            </Link>
          </nav>
          <p className="text-xs text-neutral-600">
            &copy; {YEAR} Cloud Quest Arcade. Original practice content.
          </p>
        </div>
      </div>
    </footer>
  );
}
