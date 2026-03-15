/**
 * Per-card scroll progress: each vocabulary card’s % is how far the user
 * scrolled on that card’s linked page. Stored in localStorage (no DB).
 */

const STORAGE_KEY = "finnish-vocabulary-card-progress";
const THROTTLE_MS = 200;

export type CardProgressMap = Record<string, number>;

function getProgressMap(): CardProgressMap {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (parsed == null || typeof parsed !== "object") return {};
        const out: CardProgressMap = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof key === "string" && typeof value === "number" && Number.isFinite(value)) {
                out[key] = Math.min(100, Math.max(0, value));
            }
        }
        return out;
    } catch {
        return {};
    }
}

function setProgressMap(map: CardProgressMap) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
        // ignore
    }
}

/** Normalize href to pathname for a stable storage key */
export function hrefToPath(href: string): string {
    if (typeof window === "undefined") return href;
    try {
        if (href.startsWith("http")) return new URL(href).pathname;
        return href.split("?")[0] || href;
    } catch {
        return href.split("?")[0] || href;
    }
}

export function getProgressForHref(href: string): number {
    const path = hrefToPath(href);
    const map = getProgressMap();
    const value = map[path];
    return value != null && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function setProgressForPath(path: string, percent: number) {
    const normalized = path.split("?")[0] || path;
    const value = Math.min(100, Math.max(0, percent));
    const map = getProgressMap();
    map[normalized] = value;
    setProgressMap(map);
}

export { STORAGE_KEY, THROTTLE_MS };
