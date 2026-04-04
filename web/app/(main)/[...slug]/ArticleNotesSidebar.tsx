"use client";

import dynamic from "next/dynamic";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";
import {
    createNote,
    getRegistry,
    runMigrationIfNeeded,
    updateNoteMeta,
    type NoteMeta,
} from "@/lib/excalidraw-notes";

const ExcalidrawNotesPanel = dynamic(
    () =>
        import("./ExcalidrawNotesPanel").then((m) => ({
            default: m.ExcalidrawNotesPanel,
        })),
    { ssr: false },
);

function useRegistry(): [NoteMeta[], () => void] {
    const [registry, setRegistry] = useState<NoteMeta[]>([]);
    const refresh = useCallback(() => setRegistry(getRegistry()), []);
    useEffect(() => {
        runMigrationIfNeeded();
        refresh();
        const onStorage = (): void => refresh();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [refresh]);
    return [registry, refresh];
}

export function ArticleNotesSidebar() {
    const [notes, refreshRegistry] = useRegistry();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const handleNewNote = useCallback(() => {
        const note = createNote({
            id: crypto.randomUUID(),
            title: "Untitled note",
        });
        refreshRegistry();
        setSelectedId(note.id);
        sileo.success({ title: "Note created" });
    }, [refreshRegistry]);

    const handleRenameStart = useCallback((note: NoteMeta) => {
        setEditingId(note.id);
        setEditTitle(note.title);
    }, []);

    const handleRenameSubmit = useCallback(() => {
        if (editingId && editTitle.trim()) {
            updateNoteMeta(editingId, { title: editTitle.trim() });
            refreshRegistry();
        }
        setEditingId(null);
        setEditTitle("");
    }, [editingId, editTitle, refreshRegistry]);

    const handleRenameCancel = useCallback(() => {
        setEditingId(null);
        setEditTitle("");
    }, []);

    const selectedNote = selectedId
        ? notes.find((n) => n.id === selectedId)
        : null;
    const sortedNotes = [...notes].sort(
        (a, b) => b.createdAt - a.createdAt,
    );
    const isEditingSelected =
        selectedNote && editingId === selectedNote.id;

    return (
        <aside className="min-w-0 pt-8 lg:pt-0 lg:fixed lg:right-12 lg:top-(--navbar-height) lg:w-[calc(0.45*(100vw-6rem))] lg:h-[calc(100vh-var(--navbar-height))] lg:pl-2 lg:border-l lg:border-border flex flex-col gap-2">
            <div className="flex flex-col gap-2 shrink-0 mt-1">
                <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                    Notes for this page
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleNewNote}
                        title="Add a new blank canvas note"
                        className="inline-flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        <Plus className="size-4 shrink-0" aria-hidden />
                        Add note
                    </button>
                    {sortedNotes.length > 0 && !isEditingSelected && (
                        <>
                            <select
                                value={selectedId ?? ""}
                                onChange={(e) =>
                                    setSelectedId(e.target.value || null)
                                }
                                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                aria-label="Open a note"
                            >
                                <option value="">Select a note…</option>
                                {sortedNotes.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.title}
                                    </option>
                                ))}
                            </select>
                            {selectedNote && (
                                <button
                                    type="button"
                                    onClick={() => handleRenameStart(selectedNote)}
                                    className="shrink-0 p-2 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    title="Rename note"
                                    aria-label="Rename note"
                                >
                                    <Pencil className="size-4" aria-hidden />
                                </button>
                            )}
                        </>
                    )}
                </div>
                {isEditingSelected && (
                    <div className="flex flex-col gap-1.5">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRenameSubmit();
                                if (e.key === "Escape") handleRenameCancel();
                            }}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            placeholder="Note title"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleRenameSubmit}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleRenameCancel}
                                className="px-3 py-1.5 rounded-lg text-sm border border-border bg-background text-foreground hover:bg-muted"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {selectedId && selectedNote ? (
                <div className="flex-1 min-h-0">
                    <ExcalidrawNotesPanel
                        key={selectedId}
                        noteId={selectedId}
                        title={selectedNote.title}
                    />
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex items-center justify-center rounded-xl border border-border bg-muted/30 p-6">
                    <p className="text-sm text-muted-foreground text-center">
                        Create a note or choose one above.
                    </p>
                </div>
            )}
        </aside>
    );
}
