import Link from "next/link";
import type { IndexSection } from "@/lib/vocabulary-parse";
import { cn } from "@/lib/utils";

type Props = { sections: IndexSection[]; ariaLabel?: string };

export function VocabularyToc({ sections, ariaLabel = "Vocabulary sections" }: Props) {
    if (sections.length === 0) return null;

    return (
        <aside className="lg:w-64 shrink-0 hidden md:block">
            <div className="sticky top-24 space-y-1">
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
            </div>
        </aside>
    );
}
