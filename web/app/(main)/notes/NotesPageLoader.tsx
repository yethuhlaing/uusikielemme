"use client";

import dynamic from "next/dynamic";

const NotesPageClient = dynamic(
    () =>
        import("./NotesPageClient").then((m) => ({
            default: m.NotesPageClient,
        })),
    { ssr: false },
);

export function NotesPageLoader() {
    return <NotesPageClient />;
}
