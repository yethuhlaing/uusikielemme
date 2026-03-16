import { decodeHtmlEntities } from "@/lib/utils";

/**
 * Parse grammar index page HTML into sections (headings + links)
 * for a structured layout with TOC and grouped link cards.
 * Same structure as vocabulary-parse but filters links under /finnish-grammar.
 */
export type GrammarLink = { href: string; text: string };

/** One entry from the "Table of Contents" box (anchor link + label) */
export type TocEntry = { anchor: string; title: string };

export type GrammarSection = {
    id: string;
    title: string;
    level: 2 | 3; // h2 or h3
    links: GrammarLink[];
};

const GRAMMAR_BASE = "/finnish-grammar";

/** Slug-safe id from heading text */
function toId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        || "section";
}

/** Extract text from HTML (strip tags, decode entities like &#8211;) */
function stripHtml(html: string): string {
    const text = html.replace(/<[^>]*>/g, "").trim();
    return decodeHtmlEntities(text);
}

/**
 * Parse the "Table of Contents" box from the grammar page into a structured list.
 * Looks for the su-box with title "Table of Contents" and extracts ol > li > a(href="#...").
 */
export function parseTableOfContents(html: string): TocEntry[] {
    const entries: TocEntry[] = [];
    const tocTitleMatch = html.match(/su-box-title[^>]*>[\s\S]*?Table of Contents\s*<\/div>/i);
    if (!tocTitleMatch) return entries;
    const afterTitle = html.indexOf(tocTitleMatch[0]) + tocTitleMatch[0].length;
    const contentStart = html.indexOf("su-box-content", afterTitle);
    if (contentStart === -1) return entries;
    const olStart = html.indexOf("<ol>", contentStart);
    const olEnd = html.indexOf("</ol>", olStart);
    if (olStart === -1 || olEnd === -1) return entries;
    const olBlock = html.slice(olStart, olEnd + 5);
    const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const anchorRe = /<a\s+href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i;
    let liMatch: RegExpExecArray | null;
    while ((liMatch = liRe.exec(olBlock)) !== null) {
        const inner = liMatch[1];
        const anchorMatch = inner.match(anchorRe);
        if (anchorMatch) {
            entries.push({
                anchor: anchorMatch[1].trim(),
                title: stripHtml(anchorMatch[2]),
            });
        }
    }
    return entries;
}

/** Parse one block (after a heading) for links that point to grammar subpages */
function extractLinks(block: string): GrammarLink[] {
    const links: GrammarLink[] = [];
    const linkRe = /<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(block)) !== null) {
        const href = m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/";
        if (href.startsWith(GRAMMAR_BASE) && href !== GRAMMAR_BASE) {
            links.push({ href, text: stripHtml(m[2]) });
        }
    }
    return links;
}

/**
 * Split HTML by h2/h3 and return sections with ids and links.
 * Links are collected from content between this heading and the next.
 */
export function parseGrammarPageHtml(html: string): GrammarSection[] {
    const sections: GrammarSection[] = [];
    const headingRe = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const parts: { level: 2 | 3; title: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = headingRe.exec(html)) !== null) {
        const level = Number(m[1]) as 2 | 3;
        const title = stripHtml(m[2]);
        if (!title) continue;
        parts.push({
            level,
            title,
            start: m.index,
            end: m.index + m[0].length,
        });
    }

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const blockStart = part.end;
        const blockEnd = i + 1 < parts.length ? parts[i + 1].start : html.length;
        const block = html.slice(blockStart, blockEnd);
        const links = extractLinks(block);
        const id = toId(part.title);
        sections.push({
            id: sections.some((s) => s.id === id) ? `${id}-${i}` : id,
            title: part.title,
            level: part.level,
            links,
        });
    }

    return sections;
}
