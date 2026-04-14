"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

type NotesCanvasProps = {
    noteId: string;
    initialData: unknown;
    onChange: (elements: readonly unknown[], appState: unknown, files: unknown) => void;
};

export function NotesCanvas({ noteId, initialData, onChange }: NotesCanvasProps) {
    return (
        <Excalidraw
            key={noteId}
            initialData={initialData as never}
            onChange={onChange}
            theme="light"
        />
    );
}
