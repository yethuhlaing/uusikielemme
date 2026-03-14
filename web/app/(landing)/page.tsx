import Link from "next/link";
import { FallingTags } from "./FallingTags";
import { HeroSection } from "./HeroSection";

export default function LandingPage() {
    return (
        <div className="landing-bg min-h-screen flex flex-col">
            <header className="landing-header relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-semibold text-black hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#fafaf8] rounded"
                >
                    <span
                        className="flex items-center justify-center w-8 h-8 rounded bg-black text-white text-sm font-bold"
                        aria-hidden
                    >
                        U
                    </span>
                    <span>Uusi kielemme</span>
                </Link>
                <nav
                    className="flex items-center gap-1 text-black text-sm font-normal"
                    aria-label="Main"
                >
                    <Link
                        href="/finnish-grammar"
                        className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                    >
                        Grammar
                    </Link>
                    <span className="text-gray-400" aria-hidden>
                        /
                    </span>
                    <Link
                        href="/finnish-vocabulary"
                        className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                    >
                        Vocabulary
                    </Link>
                    <span className="text-gray-400" aria-hidden>
                        /
                    </span>
                    <Link
                        href="/how-it-works"
                        className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                    >
                        How it works
                    </Link>
                    <span className="text-gray-400" aria-hidden>
                        /
                    </span>
                    <Link
                        href="/finnish-grammar"
                        className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                    >
                        About
                    </Link>
                </nav>
                <Link
                    href="/finnish-grammar"
                    className="text-black text-sm font-normal hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                >
                    Log In
                </Link>
            </header>

            <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-56 sm:pb-64">
                <HeroSection />
                <FallingTags />
            </main>
            <div
                className="h-px w-full bg-gray-200"
                role="presentation"
                aria-hidden
            />
        </div>
    );
}
