import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <header
            className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10 bg-background border-b border-border"
            role="banner"
        >
            <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold text-foreground hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
            >
                <span
                    className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground text-sm font-bold"
                    aria-hidden
                >
                    U
                </span>
                <span>Uusi kielemme</span>
            </Link>
            <nav
                className="flex items-center gap-1 text-foreground text-sm font-normal"
                aria-label="Main"
            >
                <Link
                    href="/finnish-grammar"
                    className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    Grammar
                </Link>
                <span className="text-muted-foreground" aria-hidden>
                    /
                </span>
                <Link
                    href="/finnish-vocabulary"
                    className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    Vocabulary
                </Link>
                <span className="text-muted-foreground" aria-hidden>
                    /
                </span>
                <Link
                    href="/how-it-works"
                    className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    How it works
                </Link>
                <span className="text-muted-foreground" aria-hidden>
                    /
                </span>
                <Link
                    href="/finnish-grammar"
                    className="px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    About
                </Link>
            </nav>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                    href="/finnish-grammar"
                    className="text-foreground text-sm font-normal hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    Log In
                </Link>
            </div>
        </header>
    );
}
