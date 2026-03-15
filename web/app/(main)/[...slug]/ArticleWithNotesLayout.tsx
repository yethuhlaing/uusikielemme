"use client";

import dynamic from "next/dynamic";

const ExcalidrawNotesPanel = dynamic(
    () =>
        import("./ExcalidrawNotesPanel").then((m) => ({
            default: m.ExcalidrawNotesPanel,
        })),
    { ssr: false },
);

type Props = {
    slug: string[];
    children: React.ReactNode;
};

export function ArticleWithNotesLayout({ slug, children }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-10 w-full">
            <div className="min-w-0">{children}</div>
            <aside className="min-w-0 pt-8 lg:pt-0 lg:fixed lg:right-12 lg:top-(--navbar-height) lg:w-[calc(0.45*(100vw-6rem))] lg:h-[calc(100vh-var(--navbar-height))] lg:pl-2 lg:border-l lg:border-border">
                <ExcalidrawNotesPanel slug={slug} />
            </aside>
        </div>
    );
}
