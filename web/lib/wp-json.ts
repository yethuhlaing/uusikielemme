import fs from "fs";
import path from "path";
import { WP_ORIGIN, UPLOADS_BASE } from "./config";

const WP_API_PER_PAGE = 100;

export interface WPPostOrPage {
    id: number;
    type: "post" | "page";
    link: string;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    modified: string;
    categories?: number[];
    tags?: number[];
    yoast_head_json?: {
        title?: string;
        description?: string;
        canonical?: string;
        og_image?: Array<{ url?: string }>;
    };
}

/** Path from link URL to route path (no leading slash for slug segments) */
function linkToPath(link: string): string {
    try {
        const u = new URL(link);
        const p = u.pathname.replace(/\/$/, "") || "/";
        return p.startsWith("/") ? p : `/${p}`;
    } catch {
        return "/";
    }
}

/** Path to slug array for generateStaticParams (no leading empty segment) */
export function pathToSlugSegments(routePath: string): string[] {
    const normalized = routePath.replace(/^\/+|\/+$/g, "");
    if (!normalized) return []; // home is handled by app/page.tsx
    return normalized.split("/").filter(Boolean);
}

function loadJsonDir<T>(dirPath: string): T[] {
    const out: T[] = [];
    if (!fs.existsSync(dirPath)) return out;
    const files = fs.readdirSync(dirPath);
    for (const f of files) {
        if (!f.endsWith(".json")) continue;
        const full = path.join(dirPath, f);
        if (!fs.statSync(full).isFile()) continue;
        try {
            const raw = fs.readFileSync(full, "utf-8");
            const data = JSON.parse(raw) as T;
            out.push(data);
        } catch {
            // skip invalid JSON
        }
    }
    return out;
}

let pathMap: Map<string, WPPostOrPage> | null = null;
/** slug -> items with that slug (for fallback when path is shorter than canonical) */
let slugMap: Map<string, WPPostOrPage[]> | null = null;
let homePage: WPPostOrPage | null = null;

function buildPathMap(): void {
    if (pathMap !== null) return;
    pathMap = new Map();
    slugMap = new Map();
    const cwd = process.cwd();
    const candidates = [
        path.join(cwd, "..", "uusikielemme.fi"),
        path.join(cwd, "uusikielemme.fi"),
    ];
    if (process.env.WP_MIRROR_DIR)
        candidates.unshift(path.resolve(process.env.WP_MIRROR_DIR));

    let posts: WPPostOrPage[] = [];
    let pages: WPPostOrPage[] = [];
    for (const mirrorDir of candidates) {
        const postsDir = path.join(mirrorDir, "wp-json", "wp", "v2", "posts");
        const pagesDir = path.join(mirrorDir, "wp-json", "wp", "v2", "pages");
        if (!fs.existsSync(postsDir) && !fs.existsSync(pagesDir)) continue;
        posts = loadJsonDir<WPPostOrPage>(postsDir);
        pages = loadJsonDir<WPPostOrPage>(pagesDir);
        if (posts.length > 0 || pages.length > 0) break;
    }

    for (const item of [...posts, ...pages]) {
        const link = item.link;
        if (!link) continue;
        const routePath = linkToPath(link);
        pathMap.set(routePath, item);
        // Home: exact path "/"
        if (routePath === "/") homePage = item;
        // Index by slug for fallback lookup (e.g. /finnish-vocabulary/the-days-of-the-week-viikonpaivat)
        const slug = item.slug;
        if (slug) {
            const list = slugMap!.get(slug) ?? [];
            list.push(item);
            slugMap!.set(slug, list);
        }
    }
}

/** All route paths that should be generated (excluding home "/" which is app/page.tsx) */
export function getAllPaths(): { path: string }[] {
    buildPathMap();
    const paths: { path: string }[] = [];
    pathMap!.forEach((_, routePath) => {
        if (routePath !== "/") paths.push({ path: routePath });
    });
    return paths;
}

/** Get post or page by route path or slug array. If exact path misses, tries slug fallback (last segment). */
export function getByPath(
    slugSegments: string[] | undefined,
): WPPostOrPage | null {
    buildPathMap();
    if (!slugSegments || slugSegments.length === 0) return homePage;
    const routePath = "/" + slugSegments.join("/");
    const exact = pathMap!.get(routePath);
    if (exact) return exact;
    // Fallback: some links use short paths (e.g. /finnish-vocabulary/the-days-of-the-week-viikonpaivat)
    // while WordPress canonical is longer (e.g. /finnish-vocabulary/vocabulary-lists/the-days-of-the-week-viikonpaivat)
    const slug = slugSegments[slugSegments.length - 1];
    const bySlug = slugMap!.get(slug);
    if (!bySlug || bySlug.length === 0) return null;
    if (bySlug.length === 1) return bySlug[0];
    // Multiple posts share this slug; prefer one whose path starts with the requested path
    const prefix = slugSegments.slice(0, -1).join("/");
    const match = bySlug.find((p) =>
        linkToPath(p.link).replace(/^\//, "").startsWith(prefix),
    );
    return match ?? bySlug[0];
}

/** Home page content (page with link === origin/) */
export function getHomePage(): WPPostOrPage | null {
    buildPathMap();
    return homePage;
}

const WP_ORIGIN_ESCAPED = WP_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Rewrite WordPress URLs in HTML so they point to this site:
 * - Uploads: .../wp-content/uploads/ -> /wp-content/uploads/
 * - Internal links: https://uusikielemme.fi/... -> /... (all links stay on your site)
 */
export function rewriteContentUrls(html: string): string {
    return html
        .replace(
            new RegExp(WP_ORIGIN_ESCAPED + "/wp-content/uploads/", "g"),
            UPLOADS_BASE + "/",
        )
        .replace(new RegExp(WP_ORIGIN_ESCAPED, "g"), "");
}
