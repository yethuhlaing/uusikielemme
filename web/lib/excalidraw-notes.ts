/**
 * Excalidraw notes in localStorage (one key per article path).
 */
export const EXCALIDRAW_STORAGE_KEY_PREFIX = "excalidraw-notes-";

export function getExcalidrawStorageKey(slug: string[]): string {
    return `${EXCALIDRAW_STORAGE_KEY_PREFIX}${slug.join("/")}`;
}

/** Parse localStorage key to slug segments (client-only). */
export function slugFromStorageKey(key: string): string[] | null {
    if (!key.startsWith(EXCALIDRAW_STORAGE_KEY_PREFIX)) return null;
    const rest = key.slice(EXCALIDRAW_STORAGE_KEY_PREFIX.length).trim();
    if (!rest) return null;
    return rest.split("/").filter(Boolean);
}
