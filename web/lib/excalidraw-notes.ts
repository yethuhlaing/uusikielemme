/**
 * Excalidraw notes: registry (note metadata) + one content blob per note by id.
 * Notes are route-independent; optional linkedPath for "note for this page".
 */

export const EXCALIDRAW_STORAGE_KEY_PREFIX = "excalidraw-notes-";
const REGISTRY_KEY = "excalidraw-notes-registry";

export type NoteMeta = {
    id: string;
    title: string;
    linkedPath?: string;
    createdAt: number;
};

function getStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    return window.localStorage;
}

export function getRegistry(): NoteMeta[] {
    const storage = getStorage();
    if (!storage) return [];
    try {
        const raw = storage.getItem(REGISTRY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? (parsed as NoteMeta[]) : [];
    } catch {
        return [];
    }
}

export function saveRegistry(meta: NoteMeta[]): void {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(REGISTRY_KEY, JSON.stringify(meta));
    } catch {
        // ignore
    }
}

export function getExcalidrawStorageKeyById(id: string): string {
    return `${EXCALIDRAW_STORAGE_KEY_PREFIX}${id}`;
}

/** @deprecated Use id-based keys; kept for migration only. */
export function getExcalidrawStorageKey(slug: string[]): string {
    return `${EXCALIDRAW_STORAGE_KEY_PREFIX}${slug.join("/")}`;
}

/** Parse localStorage key to slug segments (legacy keys only). Client-only. */
export function slugFromStorageKey(key: string): string[] | null {
    if (!key.startsWith(EXCALIDRAW_STORAGE_KEY_PREFIX)) return null;
    const rest = key.slice(EXCALIDRAW_STORAGE_KEY_PREFIX.length).trim();
    if (!rest) return null;
    // UUIDs contain no "/"; path keys do
    if (rest.includes("/")) return rest.split("/").filter(Boolean);
    return null;
}

/** Check if a storage key is legacy (path-based) rather than id-based (UUID). */
function isLegacyStorageKey(key: string): boolean {
    if (!key.startsWith(EXCALIDRAW_STORAGE_KEY_PREFIX)) return false;
    const rest = key.slice(EXCALIDRAW_STORAGE_KEY_PREFIX.length).trim();
    if (!rest) return false;
    // UUID format: 8-4-4-4-12 hex; path has slashes
    return rest.includes("/");
}

export function createNote(meta: Omit<NoteMeta, "createdAt">): NoteMeta {
    const note: NoteMeta = { ...meta, createdAt: Date.now() };
    const registry = getRegistry();
    registry.push(note);
    saveRegistry(registry);
    return note;
}

export function updateNoteMeta(
    id: string,
    partial: Partial<Pick<NoteMeta, "title" | "linkedPath">>,
): void {
    const registry = getRegistry();
    const idx = registry.findIndex((n) => n.id === id);
    if (idx === -1) return;
    registry[idx] = { ...registry[idx], ...partial };
    saveRegistry(registry);
}

export function deleteNote(id: string): void {
    const storage = getStorage();
    const registry = getRegistry().filter((n) => n.id !== id);
    saveRegistry(registry);
    if (storage) {
        try {
            storage.removeItem(getExcalidrawStorageKeyById(id));
        } catch {
            // ignore
        }
    }
}

export function getNoteById(id: string): NoteMeta | undefined {
    return getRegistry().find((n) => n.id === id);
}

/**
 * One-time migration: copy legacy slug-keyed note blobs into registry + id-based keys.
 * Call from client once when registry is empty (e.g. Notes page or ArticleNotesSidebar mount).
 */
export function runMigrationIfNeeded(): void {
    const storage = getStorage();
    if (!storage) return;
    const registry = getRegistry();
    if (registry.length > 0) return; // already migrated or new user

    const keysToMigrate: string[] = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && isLegacyStorageKey(key)) keysToMigrate.push(key);
    }

    const migrated: NoteMeta[] = [];
    for (const key of keysToMigrate) {
        const slug = slugFromStorageKey(key);
        if (!slug || slug.length === 0) continue;
        const raw = storage.getItem(key);
        if (!raw) continue;
        const id = crypto.randomUUID();
        const linkedPath = "/" + slug.join("/");
        const title = slug.join(" / ") || "Article note";
        const note: NoteMeta = { id, title, linkedPath, createdAt: Date.now() };
        migrated.push(note);
        storage.setItem(getExcalidrawStorageKeyById(id), raw);
        storage.removeItem(key);
    }
    if (migrated.length > 0) {
        migrated.sort((a, b) => a.createdAt - b.createdAt);
        saveRegistry(migrated);
    }
}
