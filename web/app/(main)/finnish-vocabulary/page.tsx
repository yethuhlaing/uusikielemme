import Link from "next/link";
import type { Metadata } from "next";
import { getByPath, rewriteContentUrls } from "@/lib/wp-json";
import {
    parseVocabularyPageHtml,
    type VocabularySection,
} from "@/lib/vocabulary-parse";
import { VocabularyHero } from "./VocabularyHero";
import { VocabularyToc } from "./VocabularyToc";
import { VocabularySectionBlock } from "./VocabularySectionBlock";

export const metadata: Metadata = {
    title: "Finnish Vocabulary",
    description:
        "Vocabulary lists and topics for learning Finnish. Browse by theme and level.",
};

const SECTION_ICONS = [
    "List",
    "Calendar",
    "BookOpen",
    "GraduationCap",
    "Library",
    "BookMarked",
] as const;

export default async function FinnishVocabularyPage() {
    const item = getByPath(["finnish-vocabulary"]);
    const rawHtml = item?.content?.rendered ?? "";
    const html = rewriteContentUrls(rawHtml);
    const sections = parseVocabularyPageHtml(html);
    const hasSections = sections.length > 0;

    return (
        <div className="min-h-screen w-full text-foreground selection:bg-primary/20 selection:text-primary">
            <div className="fixed inset-0 pointer-events-none z-0 dot-grid" />

            <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col lg:flex-row gap-12 relative z-10">
                <VocabularyToc sections={sections} />

                <main className="flex-1 min-w-0">
                    <VocabularyHero
                        title={item?.title?.rendered ?? "Finnish Vocabulary"}
                        excerptHtml={
                            item?.excerpt?.rendered
                                ? rewriteContentUrls(item.excerpt.rendered)
                                : null
                        }
                    />

                    {hasSections ? (
                        <div className="space-y-16">
                            {sections.map((section, idx) => (
                                <VocabularySectionBlock
                                    key={section.id}
                                    section={section}
                                    iconName={
                                        SECTION_ICONS[
                                            idx % SECTION_ICONS.length
                                        ]
                                    }
                                    linkStartIndex={sections
                                        .slice(0, idx)
                                        .reduce(
                                            (acc, s) => acc + s.links.length,
                                            0,
                                        )}
                                    sectionIndex={idx}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border bg-card p-8 text-center space-y-4">
                            <p className="text-muted-foreground">
                                Vocabulary content is loaded from the site
                                index. If you don&apos;t see any sections here,
                                the vocabulary index may not be available yet.
                            </p>
                            <Link
                                href="/finnish-grammar"
                                className="text-primary font-medium hover:underline"
                            >
                                Browse Finnish Grammar →
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
