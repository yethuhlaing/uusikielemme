import Link from "next/link";
import type { IndexSection } from "@/lib/vocabulary-parse";
import { cn } from "@/lib/utils";

type TocEntry = { anchor: string; title: string };

type Props = {
    sections: IndexSection[];
    ariaLabel?: string;
    /** Structured Table of Contents from the page (e.g. grammar index) */
    tableOfContents?: TocEntry[];
};

export function VocabularyToc({
    sections,
    ariaLabel = "Vocabulary sections",
    tableOfContents,
}: Props) {
    const hasSections = sections.length > 0;
    const hasToc = tableOfContents && tableOfContents.length > 0;
    if (!hasSections && !hasToc) return null;

    return (
        <aside className="lg:w-64 shrink-0 hidden md:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide space-y-1">
                {hasToc && (
                    <>
                        <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-6">
                            Table of Contents
                        </h3>
                        <nav className="space-y-1 mb-8" aria-label="Table of contents">
                            {tableOfContents.map((entry) => (
                                <div key={entry.anchor}>
                                    <Link
                                        href={`#${entry.anchor}`}
                                        className={cn(
                                            "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                            "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        )}
                                    >
                                        {entry.title}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </>
                )}
                {hasSections && (
                    <>
                        <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-6">
                            On this page
                        </h3>
                        <nav className="space-y-1" aria-label={ariaLabel}>
                            {sections.map((section) => (
                                <div key={section.id}>
                                    <Link
                                        href={`#${section.id}`}
                                        className={cn(
                                            "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                            "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        )}
                                    >
                                        {section.title}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </>
                )}
            </div>
        </aside>
    );
}
