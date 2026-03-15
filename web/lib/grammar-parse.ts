/**
 * Parse grammar index page HTML into sections (headings + links)
 * for a structured layout with TOC and grouped link cards.
 * Same structure as vocabulary-parse but filters links under /finnish-grammar.
 */
export type GrammarLink = { href: string; text: string };

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

/** Extract text from HTML (strip tags) */
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
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
