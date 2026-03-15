import Link from "next/link";

export function Navbar() {
    return (
        <header
            className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10 bg-[#f9f8f3] border-b border-[#e5e5e5]"
            role="banner"
        >
            <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold text-black hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#f9f8f3] rounded"
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
    );
}
