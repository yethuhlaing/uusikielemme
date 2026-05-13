"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
    Clock,
    ExternalLink,
    FileText,
    Link as LinkIcon,
    PanelLeftClose,
    PanelLeftOpen,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import {
    createNote,
    deleteNote,
    getExcalidrawStorageKeyById,
    getRegistry,
    runMigrationIfNeeded,
    touchNote,
    updateNoteMeta,
    type NoteMeta,
} from "@/lib/excalidraw-notes";
import { sileo } from "sileo";

const DEBOUNCE_MS = 400;
const SIDEBAR_WIDTH_KEY = "notes-sidebar-width";
const SIDEBAR_COLLAPSED_KEY = "notes-sidebar-collapsed";
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 520;
const SIDEBAR_DEFAULT = 288;

type SortMode = "recent" | "oldest" | "az" | "za" | "modified";

const NotesCanvas = dynamic(
    () => import("./NotesCanvas").then((m) => ({ default: m.NotesCanvas })),
    { ssr: false },
);

async function loadNoteData(
    noteId: string,
): Promise<{ elements: unknown[]; appState: unknown; files: unknown } | null> {
    if (typeof window === "undefined") return null;
    const key = getExcalidrawStorageKeyById(noteId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
        const { loadFromBlob } = await import("@excalidraw/excalidraw");
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

function formatRelative(ts: number): string {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60_000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(ts).toLocaleDateString();
}

export function NotesPageClient() {
    const [notes, setNotes] = useState<NoteMeta[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    type NoteData = Awaited<ReturnType<typeof loadNoteData>> | null | undefined;
    const [initialData, setInitialData] = useState<NoteData>(undefined as NoteData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortMode>("modified");
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
    const [resizing, setResizing] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const refreshNotes = useCallback(() => setNotes(getRegistry()), []);

    useEffect(() => {
        runMigrationIfNeeded();
        refreshNotes();
        try {
            const w = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
            if (w) {
                const n = parseInt(w, 10);
                if (!Number.isNaN(n)) setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, n)));
            }
            const c = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
            if (c === "1") setCollapsed(true);
        } catch {
            // ignore
        }
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
                const persist = async () => {
                    try {
                        const { serializeAsJSON } = await import(
                            "@excalidraw/excalidraw"
                        );
                        const json = serializeAsJSON(
                            elements as never,
                            appState as never,
                            files as never,
                            "local",
                        );
                        const key = getExcalidrawStorageKeyById(selectedId);
                        if (typeof window !== "undefined" && window.localStorage) {
                            window.localStorage.setItem(key, json);
                            touchNote(selectedId);
                            refreshNotes();
                        }
                    } catch (_) {
                        // ignore serialization failures
                    } finally {
                        saveTimeoutRef.current = null;
                    }
                };
                void persist();
            }, DEBOUNCE_MS);
        },
        [selectedId, refreshNotes],
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

    const toggleCollapsed = useCallback(() => {
        setCollapsed((c) => {
            const next = !c;
            try {
                window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    useEffect(() => {
        if (!resizing) return;
        const onMove = (e: MouseEvent) => {
            const w = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, e.clientX));
            setSidebarWidth(w);
        };
        const onUp = () => {
            setResizing(false);
            try {
                window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
            } catch {
                // ignore
            }
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [resizing, sidebarWidth]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement | null)?.tagName;
            const isField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement | null)?.isContentEditable;
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key.toLowerCase() === "n") {
                e.preventDefault();
                handleNewNote();
                return;
            }
            if (mod && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
                return;
            }
            if (mod && e.key === "\\") {
                e.preventDefault();
                toggleCollapsed();
                return;
            }
            if (isField) return;
            if (e.key === "Escape") {
                if (editingId) handleRenameCancel();
                else if (selectedId) setSelectedId(null);
                return;
            }
            if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !editingId) {
                e.preventDefault();
                handleDelete(selectedId);
                return;
            }
            if (e.key === "F2" && selectedId && !editingId) {
                e.preventDefault();
                const n = notes.find((x) => x.id === selectedId);
                if (n) handleRenameStart(n);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleNewNote, toggleCollapsed, selectedId, editingId, notes, handleDelete, handleRenameStart, handleRenameCancel]);

    const selectedNote = selectedId ? notes.find((n) => n.id === selectedId) : null;

    const visibleNotes = useMemo(() => {
        const q = search.trim().toLowerCase();
        const filtered = q
            ? notes.filter((n) => n.title.toLowerCase().includes(q))
            : notes.slice();
        const ts = (n: NoteMeta) => n.updatedAt ?? n.createdAt;
        switch (sort) {
            case "recent":
                return filtered.sort((a, b) => b.createdAt - a.createdAt);
            case "oldest":
                return filtered.sort((a, b) => a.createdAt - b.createdAt);
            case "az":
                return filtered.sort((a, b) => a.title.localeCompare(b.title));
            case "za":
                return filtered.sort((a, b) => b.title.localeCompare(a.title));
            case "modified":
            default:
                return filtered.sort((a, b) => ts(b) - ts(a));
        }
    }, [notes, search, sort]);

    return (
        <div className="flex flex-1 min-h-0 w-full -mx-6 sm:-mx-8 lg:-mx-12 -my-8 overflow-hidden">
            {!collapsed && (
                <aside
                    className="shrink-0 border-r border-border bg-card flex flex-col relative"
                    style={{ width: sidebarWidth }}
                >
                    <div className="p-4 border-b border-border space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <h1 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <FileText className="size-4" />
                                Notes
                                <span className="text-xs font-normal text-muted-foreground">
                                    {notes.length}
                                </span>
                            </h1>
                            <button
                                type="button"
                                onClick={toggleCollapsed}
                                title="Collapse sidebar (⌘\\)"
                                aria-label="Collapse sidebar"
                                className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <PanelLeftClose className="size-4" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleNewNote}
                            title="New note (⌘N)"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                            <Plus className="size-4" />
                            New note
                        </button>
                        <div className="relative">
                            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search…"
                                aria-label="Search notes"
                                className="w-full pl-8 pr-7 py-1.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="shrink-0">Sort:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortMode)}
                                aria-label="Sort notes"
                                className="flex-1 min-w-0 bg-transparent border-none focus:outline-none cursor-pointer text-foreground hover:text-primary"
                            >
                                <option value="modified">Last modified</option>
                                <option value="recent">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="az">A → Z</option>
                                <option value="za">Z → A</option>
                            </select>
                        </div>
                    </div>
                    <nav
                        className="flex-1 overflow-y-auto p-2 scrollbar-hide"
                        aria-label="Notes list"
                    >
                        {visibleNotes.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <FileText className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                                <p className="text-xs text-muted-foreground">
                                    {search
                                        ? "No notes match."
                                        : "No notes yet."}
                                </p>
                            </div>
                        ) : (
                            <ul>
                                {visibleNotes.map((note) => {
                                    const isActive = selectedId === note.id;
                                    const isEditing = editingId === note.id;
                                    const ts = note.updatedAt ?? note.createdAt;
                                    return (
                                        <li key={note.id}>
                                            {isEditing ? (
                                                <div className="flex flex-col gap-1 px-2 py-1.5">
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) =>
                                                            setEditTitle(e.target.value)
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleRenameSubmit();
                                                            if (e.key === "Escape") handleRenameCancel();
                                                        }}
                                                        onBlur={handleRenameSubmit}
                                                        className="rounded border border-ring/40 bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-md cursor-pointer border-l-2 transition-colors ${
                                                        isActive
                                                            ? "bg-muted/60 border-primary"
                                                            : "border-transparent hover:bg-muted/40"
                                                    }`}
                                                    onClick={() => setSelectedId(note.id)}
                                                    onDoubleClick={() => handleRenameStart(note)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            setSelectedId(note.id);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm truncate ${isActive ? "font-medium text-foreground" : "text-foreground"}`}>
                                                            {note.title}
                                                        </div>
                                                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {formatRelative(ts)}
                                                            </span>
                                                            {note.linkedPath && (
                                                                <span className="inline-flex items-center gap-0.5 text-primary/80">
                                                                    <LinkIcon className="size-3" />
                                                                    linked
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRenameStart(note);
                                                            }}
                                                            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            title="Rename (F2)"
                                                            aria-label="Rename note"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(note.id);
                                                            }}
                                                            className="p-1 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            title="Delete"
                                                            aria-label="Delete note"
                                                        >
                                                            <Trash2 className="size-3.5" />
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
                    <div className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground space-y-0.5">
                        <div><kbd className="font-mono">⌘N</kbd> new · <kbd className="font-mono">⌘K</kbd> search</div>
                        <div><kbd className="font-mono">F2</kbd> rename · <kbd className="font-mono">Del</kbd> delete</div>
                    </div>
                    <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label="Resize sidebar"
                        onMouseDown={() => setResizing(true)}
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors"
                    />
                </aside>
            )}

            {collapsed && (
                <button
                    type="button"
                    onClick={toggleCollapsed}
                    title="Open sidebar (⌘\\)"
                    aria-label="Open sidebar"
                    className="self-start mt-3 ml-2 p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground border border-border bg-card transition-colors"
                >
                    <PanelLeftOpen className="size-4" />
                </button>
            )}

            <main className="flex-1 min-w-0 flex flex-col bg-background">
                {!selectedId ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center max-w-sm">
                            <FileText className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                            <h2 className="text-base font-semibold text-foreground mb-1">
                                No note selected
                            </h2>
                            <p className="text-muted-foreground text-sm mb-4">
                                Pick one from the list, or create a new one.
                            </p>
                            <button
                                type="button"
                                onClick={handleNewNote}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                            >
                                <Plus className="size-4" />
                                New note
                                <span className="text-[10px] opacity-70 ml-1">⌘N</span>
                            </button>
                        </div>
                    </div>
                ) : initialData === undefined ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <p className="text-muted-foreground text-sm">Loading…</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full min-h-0">
                        <div className="shrink-0 px-4 py-2 border-b border-border bg-card flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileText className="size-4 text-muted-foreground shrink-0" />
                                <span className="text-sm font-medium text-foreground truncate">
                                    {selectedNote?.title ?? "Note"}
                                </span>
                                {selectedNote && (
                                    <span className="text-[11px] text-muted-foreground shrink-0">
                                        · {formatRelative(selectedNote.updatedAt ?? selectedNote.createdAt)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {selectedNote && (
                                    <button
                                        type="button"
                                        onClick={() => handleRenameStart(selectedNote)}
                                        title="Rename (F2)"
                                        aria-label="Rename note"
                                        className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <Pencil className="size-3.5" />
                                    </button>
                                )}
                                {selectedNote?.linkedPath && (
                                    <Link
                                        href={selectedNote.linkedPath}
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-2"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        Article
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(selectedId)}
                                    title="Delete (Del)"
                                    aria-label="Delete note"
                                    className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            <NotesCanvas
                                noteId={selectedId}
                                initialData={initialData ?? null}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
