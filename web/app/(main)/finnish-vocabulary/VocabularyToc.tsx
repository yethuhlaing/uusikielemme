import Link from "next/link";
import type { VocabularySection } from "@/lib/vocabulary-parse";
import { cn } from "@/lib/utils";

type Props = { sections: VocabularySection[] };

export function VocabularyToc({ sections }: Props) {
    if (sections.length === 0) return null;

    return (
        <aside className="lg:w-64 shrink-0 hidden md:block">
            <div className="sticky top-24 space-y-1">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-6">
                    On this page
                </h3>
                <nav className="space-y-1" aria-label="Vocabulary sections">
                    {sections.map((section) => (
                        <div key={section.id}>
                            <Link
                                href={`#${section.id}`}
                                className={cn(
                                    "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                    "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
