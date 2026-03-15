"use client";

import { useCallback, useRef, useState, type ComponentProps } from "react";
import { Excalidraw, loadFromBlob, serializeAsJSON } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const STORAGE_KEY_PREFIX = "excalidraw-notes-";
const DEBOUNCE_MS = 400;

function getStorageKey(slug: string[]): string {
    return `${STORAGE_KEY_PREFIX}${slug.join("/")}`;
}

type Props = {
    slug: string[];
};

export function ExcalidrawNotesPanel({ slug }: Props) {
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [initialDataPromise] = useState(() => loadInitialData(slug));

    const handleChange = useCallback(
        (elements: readonly unknown[], appState: unknown, files: unknown) => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    // Cast to any so we don't reference package-internal types (BinaryFiles etc.) that aren't exported from the main entry
                    const json = serializeAsJSON(
                        elements as never,
                        appState as never,
                        files as never,
                        "local",
                    );
                    const key = getStorageKey(slug);
                    if (typeof window !== "undefined" && window.localStorage) {
                        window.localStorage.setItem(key, json);
                    }
                } catch (_) {
                    // ignore save errors
                }
                saveTimeoutRef.current = null;
            }, DEBOUNCE_MS);
        },
        [slug],
    );

    return (
        <div className="flex flex-col h-full overflow-hidden border border-border shadow-sm">
            <div className="shrink-0 px-4 py-3 border-b bg-muted/50">
                <h2 className="text-sm font-semibold text-foreground">
                    Notes
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Draw or type here. Saved automatically per article.
                </p>
            </div>
            <div className="flex-1 min-h-0 h-0 relative">
                <Excalidraw
                    initialData={
                        initialDataPromise as unknown as ComponentProps<
                            typeof Excalidraw
                        >["initialData"]
                    }
                    onChange={handleChange}
                    theme="light"
                />
            </div>
        </div>
    );
}

async function loadInitialData(
    slug: string[],
): Promise<{ elements: unknown[]; appState: unknown; files: unknown } | null> {
    if (typeof window === "undefined") return null;
    const key = getStorageKey(slug);
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
