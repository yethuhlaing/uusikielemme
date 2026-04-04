"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
    { href: "/finnish-grammar", label: "Grammar" },
    { href: "/finnish-vocabulary", label: "Vocabulary" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/notes", label: "Notes" },
] as const;

const linkClass =
    "px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded";

const mobileLinkClass =
    "block w-full rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuId = useId();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [menuOpen]);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const closeIfDesktop = () => {
            if (mq.matches) setMenuOpen(false);
        };
        mq.addEventListener("change", closeIfDesktop);
        return () => mq.removeEventListener("change", closeIfDesktop);
    }, []);

    return (
        <>
            <header
                className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background px-6 py-5 sm:px-10"
                role="banner"
            >
                <Link
                    href="/"
                    className="flex min-w-0 items-center gap-2 text-xl font-semibold text-foreground transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground"
                        aria-hidden
                    >
                        U
                    </span>
                    <span className="truncate">Uusi kielemme</span>
                </Link>

                <nav
                    className="hidden items-center gap-1 text-sm font-normal text-foreground md:flex"
                    aria-label="Main"
                >
                    {NAV_LINKS.map((item, index) => (
                        <span key={`${item.label}-${index}`} className="contents">
                            {index > 0 ? (
                                <span className="text-muted-foreground" aria-hidden>
                                    /
                                </span>
                            ) : null}
                            <Link
                                href={item.href}
                                prefetch={true}
                                className={linkClass}
                            >
                                {item.label}
                            </Link>
                        </span>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background md:hidden"
                        aria-expanded={menuOpen}
                        aria-controls={menuId}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        {menuOpen ? (
                            <X className="h-5 w-5" aria-hidden />
                        ) : (
                            <Menu className="h-5 w-5" aria-hidden />
                        )}
                    </button>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-40 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
                aria-hidden={!menuOpen}
            >
                <button
                    type="button"
                    tabIndex={menuOpen ? 0 : -1}
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
                        menuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                />
                <div
                    id={menuId}
                    inert={!menuOpen || undefined}
                    className={`absolute top-[var(--navbar-height)] right-0 bottom-0 flex w-[min(100%,20rem)] flex-col border-l border-border bg-background shadow-lg transition-transform duration-200 ease-out ${
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <nav
                        className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-4"
                        aria-label="Main"
                    >
                        {NAV_LINKS.map((item, index) => (
                            <Link
                                key={`${item.label}-${index}`}
                                href={item.href}
                                prefetch={true}
                                className={mobileLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
