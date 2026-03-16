import type { Metadata } from "next";
import { NotesPageLoader } from "./NotesPageLoader";

export const metadata: Metadata = {
    title: "My notes",
    description: "View and edit all your Excalidraw notes from article pages.",
};

export default function NotesPage() {
    return <NotesPageLoader />;
}
