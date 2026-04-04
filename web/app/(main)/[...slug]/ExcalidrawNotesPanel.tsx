"use client";

import { useCallback, useRef, useState, type ComponentProps } from "react";
import {
    Excalidraw,
    loadFromBlob,
    serializeAsJSON,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { getExcalidrawStorageKeyById } from "@/lib/excalidraw-notes";

const DEBOUNCE_MS = 400;

type Props = {
    noteId: string;
    title?: string;
};

export function ExcalidrawNotesPanel({ noteId }: Props) {
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [initialDataPromise] = useState(() => loadInitialData(noteId));

    const handleChange = useCallback(
        (elements: readonly unknown[], appState: unknown, files: unknown) => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    const json = serializeAsJSON(
                        elements as never,
                        appState as never,
                        files as never,
                        "local",
                    );
                    const key = getExcalidrawStorageKeyById(noteId);
                    if (typeof window !== "undefined" && window.localStorage) {
                        window.localStorage.setItem(key, json);
                    }
                } catch (_) {
                    // ignore save errors
                }
                saveTimeoutRef.current = null;
            }, DEBOUNCE_MS);
        },
        [noteId],
    );

    return (
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="relative h-0 min-h-0 flex-1">
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
    noteId: string,
): Promise<{ elements: unknown[]; appState: unknown; files: unknown } | null> {
    if (typeof window === "undefined") return null;
    const key = getExcalidrawStorageKeyById(noteId);
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
