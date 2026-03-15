import Link from "next/link";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { getByPath, rewriteContentUrls } from "@/lib/wp-json";
import { parseGrammarPageHtml } from "@/lib/grammar-parse";
import type { IndexSection } from "@/lib/vocabulary-parse";
import { GrammarHero } from "./GrammarHero";
import { VocabularyToc } from "../finnish-vocabulary/VocabularyToc";
import { VocabularySectionBlock } from "../finnish-vocabulary/VocabularySectionBlock";

export const metadata: Metadata = {
    title: "Finnish Grammar",
    description:
        "Structured grammar topics for learning Finnish. Cases, verbs, and sentence structure at your own pace.",
};

const SECTION_ICONS = [
    "List",
    "Calendar",
    "BookOpen",
    "GraduationCap",
    "Library",
    "BookMarked",
] as const;

const CACHE_TAG = "finnish-grammar-page";
const REVALIDATE_SECONDS = 3600; // 1 hour

async function loadGrammarPageData() {
    const item = getByPath(["finnish-grammar"]);
    const rawHtml = item?.content?.rendered ?? "";
    const html = rewriteContentUrls(rawHtml);
    const sections = parseGrammarPageHtml(html);
    return { item, sections };
}

const getCachedGrammarPageData = unstable_cache(
    loadGrammarPageData,
    [CACHE_TAG],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);

export default async function FinnishGrammarPage() {
    const { item, sections } = await getCachedGrammarPageData();
    const hasSections = sections.length > 0;
    const sectionsAsIndex: IndexSection[] = sections;

    return (
        <div className="min-h-screen w-full text-foreground selection:bg-primary/20 selection:text-primary">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col lg:flex-row gap-12 relative z-10">
                <VocabularyToc
                    sections={sectionsAsIndex}
                    ariaLabel="Grammar sections"
                />

                <main className="flex-1 min-w-0">
                    <GrammarHero
                        title={item?.title?.rendered ?? "Finnish Grammar"}
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
                                Grammar content is loaded from the site index. If
                                you don&apos;t see any sections here, the
                                grammar index may not be available yet.
                            </p>
                            <Link
                                href="/finnish-vocabulary"
                                className="text-primary font-medium hover:underline"
                            >
                                Browse Finnish Vocabulary →
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
