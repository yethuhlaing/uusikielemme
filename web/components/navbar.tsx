"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
    { href: "/finnish-grammar", label: "Grammar", color: "#ffd726", fg: "#1a1f2e" },
    { href: "/finnish-vocabulary", label: "Vocabulary", color: "#0015ff", fg: "#ffffff" },
    { href: "/how-it-works", label: "How it works", color: "#e794da", fg: "#1a1f2e" },
    { href: "/notes", label: "Notes", color: "#ff5941", fg: "#ffffff" },
] as const;

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
                className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-background px-4 py-4 sm:px-8"
                role="banner"
            >
                <Link
                    href="/"
                    aria-label="Uusi kielemme — home"
                    className="group flex min-w-0 items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                >
                    <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-[#ffd726] text-base font-extrabold text-[#1a1f2e] -rotate-3 shadow-[3px_3px_0_0_#1a1f2e] dark:shadow-[3px_3px_0_0_#fff] transition-transform group-hover:rotate-0"
                        aria-hidden
                    >
                        U
                    </span>
                    <span className="hidden sm:inline text-lg font-bold tracking-tight text-foreground">
                        uusikielemme
                    </span>
                </Link>

                <nav
                    className="hidden items-center gap-2 md:flex"
                    aria-label="Main"
                >
                    {NAV_LINKS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={item.href === "/notes" ? false : true}
                                aria-current={active ? "page" : undefined}
                                className={
                                    "rounded-full border-2 border-foreground px-3.5 py-1.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                                    (active
                                        ? "shadow-[3px_3px_0_0_#1a1f2e] dark:shadow-[3px_3px_0_0_#fff]"
                                        : "border-transparent hover:border-foreground hover:shadow-[3px_3px_0_0_#1a1f2e] dark:hover:shadow-[3px_3px_0_0_#fff] hover:-translate-y-[1px]")
                                }
                                style={active ? { background: item.color, color: item.fg } : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        href="/finnish-grammar"
                        className="hidden md:inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-foreground text-background px-4 py-1.5 text-sm font-semibold shadow-[3px_3px_0_0_#ff5941] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#ff5941] transition-all"
                    >
                        Start
                        <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                    <ThemeToggle />
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-foreground bg-background text-foreground shadow-[3px_3px_0_0_#1a1f2e] dark:shadow-[3px_3px_0_0_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1a1f2e] dark:hover:shadow-[1px_1px_0_0_#fff] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
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
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
                        menuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                />
                <div
                    id={menuId}
                    inert={!menuOpen || undefined}
                    className={`absolute top-4 right-4 bottom-4 flex w-[min(calc(100%-2rem),20rem)] flex-col rounded-2xl border-2 border-foreground bg-background shadow-[6px_6px_0_0_#1a1f2e] dark:shadow-[6px_6px_0_0_#fff] transition-transform duration-200 ease-out ${
                        menuOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
                    }`}
                >
                    <nav
                        className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
                        aria-label="Main"
                    >
                        {NAV_LINKS.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={item.href === "/notes" ? false : true}
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between rounded-xl border-2 border-foreground px-4 py-3 text-base font-bold tracking-tight shadow-[3px_3px_0_0_#1a1f2e] dark:shadow-[3px_3px_0_0_#fff] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    style={{ background: item.color, color: item.fg }}
                                >
                                    <span>{item.label}</span>
                                    <ArrowUpRight className="size-5" aria-hidden />
                                </Link>
                            );
                        })}
                        <Link
                            href="/finnish-grammar"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground bg-foreground text-background px-5 py-3 text-base font-semibold shadow-[4px_4px_0_0_#ff5941]"
                        >
                            Start learning
                            <ArrowUpRight className="size-5" aria-hidden />
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
