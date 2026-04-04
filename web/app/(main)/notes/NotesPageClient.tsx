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
    createNote,
    deleteNote,
    getExcalidrawStorageKeyById,
    getRegistry,
    runMigrationIfNeeded,
    updateNoteMeta,
    type NoteMeta,
} from "@/lib/excalidraw-notes";
import { sileo } from "sileo";

const DEBOUNCE_MS = 400;

async function loadNoteData(
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

export function NotesPageClient() {
    const [notes, setNotes] = useState<NoteMeta[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    type NoteData = Awaited<ReturnType<typeof loadNoteData>> | null | undefined;
    const [initialData, setInitialData] = useState<NoteData>(undefined as NoteData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refreshNotes = useCallback(() => setNotes(getRegistry()), []);

    useEffect(() => {
        runMigrationIfNeeded();
        refreshNotes();
        const onStorage = (): void => refreshNotes();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [refreshNotes]);

    useEffect(() => {
        if (!selectedId) {
            setInitialData(undefined);
            return;
        }
        setInitialData(undefined);
        let cancelled = false;
        loadNoteData(selectedId).then((data) => {
            if (!cancelled) setInitialData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    const handleChange = useCallback(
        (elements: readonly unknown[], appState: unknown, files: unknown) => {
            if (!selectedId) return;
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    const json = serializeAsJSON(
                        elements as never,
                        appState as never,
                        files as never,
                        "local",
                    );
                    const key = getExcalidrawStorageKeyById(selectedId);
                    if (typeof window !== "undefined" && window.localStorage) {
                        window.localStorage.setItem(key, json);
                    }
                } catch (_) {}
                saveTimeoutRef.current = null;
            }, DEBOUNCE_MS);
        },
        [selectedId],
    );

    const handleNewNote = useCallback(() => {
        const note = createNote({
            id: crypto.randomUUID(),
            title: "Untitled note",
        });
        refreshNotes();
        setSelectedId(note.id);
        sileo.success({ title: "Note created" });
    }, [refreshNotes]);

    const handleRenameStart = useCallback((note: NoteMeta) => {
        setEditingId(note.id);
        setEditTitle(note.title);
    }, []);

    const handleRenameSubmit = useCallback(() => {
        if (editingId && editTitle.trim()) {
            updateNoteMeta(editingId, { title: editTitle.trim() });
            refreshNotes();
        }
        setEditingId(null);
        setEditTitle("");
    }, [editingId, editTitle, refreshNotes]);

    const handleRenameCancel = useCallback(() => {
        setEditingId(null);
        setEditTitle("");
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            sileo.action({
                title: "Delete this note?",
                description: "This cannot be undone.",
                button: {
                    title: "Delete",
                    onClick: () => {
                        deleteNote(id);
                        refreshNotes();
                        if (selectedId === id) setSelectedId(null);
                        sileo.success({ title: "Note deleted" });
                    },
                },
            });
        },
        [selectedId, refreshNotes],
    );

    const selectedNote = selectedId
        ? notes.find((n) => n.id === selectedId)
        : null;
    const sortedNotes = [...notes].sort(
        (a, b) => b.createdAt - a.createdAt,
    );

    return (
        <div className="flex min-h-[calc(100vh-var(--navbar-height))] w-full">
            <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">
                        All my notes
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Create and manage your notes. They are not tied to any
                        page unless you link them.
                    </p>
                    <button
                        type="button"
                        onClick={handleNewNote}
                        title="Add a new blank canvas note"
                        className="mt-3 w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Add note
                    </button>
                </div>
                <nav
                    className="flex-1 overflow-y-auto p-2 scrollbar-hide"
                    aria-label="Notes list"
                >
                    {sortedNotes.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-3">
                            No notes yet. Create a note here or from an article
                            page.
                        </p>
                    ) : (
                        <ul className="space-y-0.5">
                            {sortedNotes.map((note) => {
                                const isActive = selectedId === note.id;
                                const isEditing = editingId === note.id;
                                return (
                                    <li key={note.id}>
                                        {isEditing ? (
                                            <div className="flex flex-col gap-1 px-2 py-1">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) =>
                                                        setEditTitle(e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            handleRenameSubmit();
                                                        if (e.key === "Escape")
                                                            handleRenameCancel();
                                                    }}
                                                    className="rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                                                    autoFocus
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={handleRenameSubmit}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRenameCancel}
                                                        className="text-xs text-muted-foreground hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="group flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedId(note.id)
                                                    }
                                                    className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${
                                                        isActive
                                                            ? "bg-primary text-primary-foreground font-medium"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                                >
                                                    {note.title}
                                                </button>
                                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRenameStart(note)
                                                        }
                                                        className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        title="Rename"
                                                        aria-label="Rename note"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(note.id)
                                                        }
                                                        className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        title="Delete"
                                                        aria-label="Delete note"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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

            <main className="flex-1 min-w-0 flex flex-col bg-background">
                {!selectedId ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Select a note
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Choose a note from the list or use Add note.
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
                        <div className="shrink-0 px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground truncate min-w-0">
                                {selectedNote?.title ?? "Note"}
                            </span>
                            {selectedNote?.linkedPath && (
                                <Link
                                    href={selectedNote.linkedPath}
                                    className="text-xs text-primary hover:underline shrink-0"
                                >
                                    Open article →
                                </Link>
                            )}
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            <Excalidraw
                                key={selectedId}
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
