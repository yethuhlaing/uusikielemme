import { unstable_cache } from "next/cache";
import {
    getAllPaths,
    getByPath,
    pathToSlugSegments,
    rewriteContentUrls,
} from "./wp-json";
import { parseVocabularyPageHtml } from "./vocabulary-parse";
import { parseGrammarPageHtml } from "./grammar-parse";

export type AdjacentLink = { href: string; title: string };

export type AdjacentLinks = {
    prev: AdjacentLink | null;
    next: AdjacentLink | null;
};

const CACHE_TAG_VOCAB = "adjacent-pages-vocab";
const CACHE_TAG_GRAMMAR = "adjacent-pages-grammar";
const CACHE_TAG_GLOBAL = "adjacent-pages-global";
const REVALIDATE = 3600;

function getOrderedVocabularyLinksUncached(): AdjacentLink[] {
    const item = getByPath(["finnish-vocabulary"]);
    const rawHtml = item?.content?.rendered ?? "";
    const html = rewriteContentUrls(rawHtml);
    const sections = parseVocabularyPageHtml(html);
    return sections.flatMap((s) =>
        s.links.map((l) => ({ href: l.href, title: l.text })),
    );
}

function getOrderedGrammarLinksUncached(): AdjacentLink[] {
    const item = getByPath(["finnish-grammar"]);
    const rawHtml = item?.content?.rendered ?? "";
    const html = rewriteContentUrls(rawHtml);
    const sections = parseGrammarPageHtml(html);
    return sections.flatMap((s) =>
        s.links.map((l) => ({ href: l.href, title: l.text })),
    );
}

const getOrderedVocabularyLinks = unstable_cache(
    getOrderedVocabularyLinksUncached,
    [CACHE_TAG_VOCAB],
    { revalidate: REVALIDATE, tags: [CACHE_TAG_VOCAB] },
);

const getOrderedGrammarLinks = unstable_cache(
    getOrderedGrammarLinksUncached,
    [CACHE_TAG_GRAMMAR],
    { revalidate: REVALIDATE, tags: [CACHE_TAG_GRAMMAR] },
);

function getGlobalOrderedLinksUncached(): AdjacentLink[] {
    const paths = getAllPaths()
        .map((p) => p.path)
        .filter((p) => p !== "/")
        .sort();
    return paths.map((routePath) => {
        const segments = pathToSlugSegments(routePath);
        const item = getByPath(segments);
        const title =
            item?.title?.rendered ?? routePath.split("/").pop() ?? routePath;
        return { href: routePath, title };
    });
}

const getGlobalOrderedLinks = unstable_cache(
    getGlobalOrderedLinksUncached,
    [CACHE_TAG_GLOBAL],
    { revalidate: REVALIDATE, tags: [CACHE_TAG_GLOBAL] },
);

/** Find index of current page in ordered links; match by path or by same WP item id. */
function findCurrentIndex(
    links: AdjacentLink[],
    currentPath: string,
    currentItemId: number | undefined,
): number {
    const currentSegments = pathToSlugSegments(currentPath);
    for (let i = 0; i < links.length; i++) {
        if (links[i].href === currentPath) return i;
        const linkSegments = pathToSlugSegments(links[i].href);
        const linkItem = getByPath(linkSegments);
        if (linkItem?.id != null && linkItem.id === currentItemId) return i;
    }
    return -1;
}

/**
 * Returns previous and next page links for the given slug.
 * Vocabulary and grammar pages use index order; all others use global path order.
 */
export async function getAdjacentLinks(slug: string[]): Promise<AdjacentLinks> {
    const currentPath = "/" + slug.join("/");
    const currentItem = getByPath(slug);
    const currentId = currentItem?.id;

    let links: AdjacentLink[];

    if (currentPath.startsWith("/finnish-vocabulary/")) {
        links = await getOrderedVocabularyLinks();
    } else if (currentPath.startsWith("/finnish-grammar/")) {
        links = await getOrderedGrammarLinks();
    } else {
        links = await getGlobalOrderedLinks();
    }

    const idx = findCurrentIndex(links, currentPath, currentId);
    if (idx < 0) {
        return { prev: null, next: null };
    }

    return {
        prev: idx > 0 ? links[idx - 1] : null,
        next: idx < links.length - 1 ? links[idx + 1] : null,
    };
}
