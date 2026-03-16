import { parseGrammarPageHtml } from "@/lib/grammar-parse";
import {
    getAllPaths,
    getByPath,
    pathToSlugSegments,
    rewriteContentUrls,
} from "@/lib/wp-json";
import { parseVocabularyPageHtml } from "@/lib/vocabulary-parse";

/**
 * All route paths that should be statically generated (canonical + linked from
 * grammar/vocabulary index). Used by [...slug].
 */
export function getAllRoutePaths(): string[] {
    const pathSet = new Set<string>();

    for (const { path: routePath } of getAllPaths()) {
        pathSet.add(routePath);
    }

    const grammarItem = getByPath(["finnish-grammar"]);
    if (grammarItem?.content?.rendered) {
        const html = rewriteContentUrls(grammarItem.content.rendered);
        const sections = parseGrammarPageHtml(html);
        for (const section of sections) {
            for (const link of section.links) {
                const p = link.href.startsWith("/") ? link.href : `/${link.href}`;
                pathSet.add(p.replace(/\/$/, "") || "/");
            }
        }
    }

    const vocabItem = getByPath(["finnish-vocabulary"]);
    if (vocabItem?.content?.rendered) {
        const html = rewriteContentUrls(vocabItem.content.rendered);
        const sections = parseVocabularyPageHtml(html);
        for (const section of sections) {
            for (const link of section.links) {
                const p = link.href.startsWith("/") ? link.href : `/${link.href}`;
                pathSet.add(p.replace(/\/$/, "") || "/");
            }
        }
    }

    return [...pathSet].filter((p) => p !== "/");
}

export { pathToSlugSegments } from "@/lib/wp-json";
