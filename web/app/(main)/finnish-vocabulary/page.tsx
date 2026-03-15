import Link from "next/link";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
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

const CACHE_TAG = "finnish-vocabulary-page";
const REVALIDATE_SECONDS = 3600; // 1 hour; use false for build-time only

async function loadVocabularyPageData() {
    const item = getByPath(["finnish-vocabulary"]);
    const rawHtml = item?.content?.rendered ?? "";
    const html = rewriteContentUrls(rawHtml);
    const sections = parseVocabularyPageHtml(html);
    return { item, sections };
}

const getCachedVocabularyPageData = unstable_cache(
    loadVocabularyPageData,
    [CACHE_TAG],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);

export default async function FinnishVocabularyPage() {
    const { item, sections } = await getCachedVocabularyPageData();
    const hasSections = sections.length > 0;

    return (
        <div className="min-h-screen w-full text-slate-900 selection:bg-blue-200 selection:text-blue-900">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 relative z-10">
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
                        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center space-y-4">
                            <p className="text-slate-500">
                                Vocabulary content is loaded from the site
                                index. If you don’t see any sections here, the
                                vocabulary index may not be available yet.
                            </p>
                            <Link
                                href="/finnish-grammar"
                                className="text-blue-600 font-medium hover:underline"
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
