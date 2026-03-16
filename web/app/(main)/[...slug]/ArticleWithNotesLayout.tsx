"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { AdjacentLink } from "@/lib/adjacent-pages";

const ExcalidrawNotesPanel = dynamic(
    () =>
        import("./ExcalidrawNotesPanel").then((m) => ({
            default: m.ExcalidrawNotesPanel,
        })),
    { ssr: false },
);

type Props = {
    slug: string[];
    prev: AdjacentLink | null;
    next: AdjacentLink | null;
    children: React.ReactNode;
};

export function ArticleWithNotesLayout({ slug, prev, next, children }: Props) {
    const hasNav = prev != null || next != null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-10 w-full">
            <div className="min-w-0 flex flex-col gap-6">
                {children}
                {hasNav && (
                    <nav
                        className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border"
                        aria-label="Previous and next page"
                    >
                        <span className="flex-1 min-w-0">
                            {prev ? (
                                <Link
                                    href={prev.href}
                                    className="text-primary font-medium hover:underline text-sm sm:text-base"
                                >
                                    ← Previous: {prev.title}
                                </Link>
                            ) : (
                                <span />
                            )}
                        </span>
                        <span className="flex-1 min-w-0 text-right">
                            {next ? (
                                <Link
                                    href={next.href}
                                    className="text-primary font-medium hover:underline text-sm sm:text-base"
                                >
                                    Next: {next.title} →
                                </Link>
                            ) : (
                                <span />
                            )}
                        </span>
                    </nav>
                )}
            </div>
            <aside className="min-w-0 pt-8 lg:pt-0 lg:fixed lg:right-12 lg:top-(--navbar-height) lg:w-[calc(0.45*(100vw-6rem))] lg:h-[calc(100vh-var(--navbar-height))] lg:pl-2 lg:border-l lg:border-border">
                <ExcalidrawNotesPanel slug={slug} />
            </aside>
        </div>
    );
}
