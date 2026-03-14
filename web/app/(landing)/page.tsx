import Link from "next/link";
import { FallingTags } from "./FallingTags";
import { HeroSection } from "./HeroSection";

export default function LandingPage() {
  return (
    <div className="landing-bg min-h-screen flex flex-col">
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-900 hover:text-[#2563eb] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 rounded"
        >
          LexieLingua
        </Link>
        <nav className="flex flex-wrap items-center gap-3 sm:gap-6" aria-label="Main">
          <Link
            href="/how-it-works"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 rounded"
          >
            How it Works
          </Link>
          <Link
            href="/finnish-grammar"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 rounded"
          >
            Finnish Grammar
          </Link>
          <Link
            href="/finnish-vocabulary"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 rounded"
          >
            Finnish Vocabulary
          </Link>
          <Link
            href="/how-it-works"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
          >
            Log In
          </Link>
          <Link
            href="/how-it-works"
            className="bg-[#2563eb] text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
          >
            Start Practicing
          </Link>
        </nav>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-48 sm:pb-56">
        <FallingTags />
        <HeroSection />
      </main>
    </div>
  );
}
