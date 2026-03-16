"use client";

import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import {
    Excalidraw,
    loadFromBlob,
    serializeAsJSON,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import {
    getExcalidrawStorageKey,
    slugFromStorageKey,
} from "@/lib/excalidraw-notes";

const DEBOUNCE_MS = 400;

type NoteSlug = string[];

function getNoteSlugsFromStorage(): NoteSlug[] {
    if (typeof window === "undefined") return [];
    const slugs: NoteSlug[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key) continue;
        const slug = slugFromStorageKey(key);
        if (slug) slugs.push(slug);
    }
    return slugs.sort((a, b) => a.join("/").localeCompare(b.join("/")));
}

async function loadNoteData(
    slug: string[],
): Promise<{ elements: unknown[]; appState: unknown; files: unknown } | null> {
    if (typeof window === "undefined") return null;
    const key = getExcalidrawStorageKey(slug);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
        const blob = new Blob([raw], {
            type: "application/vnd.excalidraw+json",
        });
        const scene = await loadFromBlob(blob, null, null);
        return {
            elements: scene.elements,
            appState: scene.appState,
            files: scene.files,
        };
    } catch {
        return null;
    }
}

export function NotesPageClient() {
    const [noteSlugs, setNoteSlugs] = useState<NoteSlug[]>([]);
    const [selectedSlug, setSelectedSlug] = useState<NoteSlug | null>(null);
    const [initialData, setInitialData] = useState<Awaited<
        ReturnType<typeof loadNoteData>
    > | null>(undefined);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setNoteSlugs(getNoteSlugsFromStorage());
        const onStorage = (): void => setNoteSlugs(getNoteSlugsFromStorage());
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        if (!selectedSlug || selectedSlug.length === 0) {
            setInitialData(undefined);
            return;
        }
        setInitialData(undefined);
        let cancelled = false;
        loadNoteData(selectedSlug).then((data) => {
            if (!cancelled) setInitialData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [selectedSlug?.join("/") ?? ""]);

    const handleChange = useCallback(
        (elements: readonly unknown[], appState: unknown, files: unknown) => {
            if (!selectedSlug || selectedSlug.length === 0) return;
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    const json = serializeAsJSON(
                        elements as never,
                        appState as never,
                        files as never,
                        "local",
                    );
                    const key = getExcalidrawStorageKey(selectedSlug);
                    if (typeof window !== "undefined" && window.localStorage) {
                        window.localStorage.setItem(key, json);
                        setNoteSlugs(getNoteSlugsFromStorage());
                    }
                } catch (_) {}
                saveTimeoutRef.current = null;
            }, DEBOUNCE_MS);
        },
        [selectedSlug],
    );

    return (
        <div className="flex min-h-[calc(100vh-var(--navbar-height))] w-full">
            {/* Left: list of all notes */}
            <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">
                        All my notes
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Notes you created on article pages. Click to open.
                    </p>
                </div>
                <nav
                    className="flex-1 overflow-y-auto p-2 scrollbar-hide"
                    aria-label="Notes list"
                >
                    {noteSlugs.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-3">
                            No notes yet. Open an article and use the notes
                            panel to draw or write; it will appear here.
                        </p>
                    ) : (
                        <ul className="space-y-0.5">
                            {noteSlugs.map((slug) => {
                                const path = slug.join("/");
                                const isActive =
                                    selectedSlug &&
                                    selectedSlug.length === slug.length &&
                                    slug.every((seg, i) => selectedSlug[i] === seg);
                                return (
                                    <li key={path}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSlug(slug)}
                                            className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${
                                                isActive
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                        >
                                            {path}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </nav>
                <div className="p-2 border-t border-border">
                    <Link
                        href="/finnish-grammar"
                        className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        ← Grammar
                    </Link>
                </div>
            </aside>

            {/* Right: selected note or empty state */}
            <main className="flex-1 min-w-0 flex flex-col bg-background">
                {!selectedSlug || selectedSlug.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Select a note
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Choose a note from the list on the left to read
                                or edit it.
                            </p>
                        </div>
                    </div>
                ) : initialData === undefined ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <p className="text-muted-foreground text-sm">
                            Loading…
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full min-h-0 border-l border-border">
                        <div className="shrink-0 px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate">
                                {selectedSlug.join(" / ")}
                            </span>
                            <Link
                                href={`/${selectedSlug.join("/")}`}
                                className="text-xs text-primary hover:underline shrink-0 ml-2"
                            >
                                Open article →
                            </Link>
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            <Excalidraw
                                initialData={
                                    (initialData ?? null) as ComponentProps<
                                        typeof Excalidraw
                                    >["initialData"]
                                }
                                onChange={handleChange}
                                theme="light"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
