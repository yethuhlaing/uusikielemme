import type { Metadata } from "next";
import { NotesPageClient } from "./NotesPageClient";

export const metadata: Metadata = {
    title: "My notes",
    description: "View and edit all your Excalidraw notes from article pages.",
};

export default function NotesPage() {
    return <NotesPageClient />;
}
