import type { ReactNode } from "react";
import Link from "next/link";
import { getHomePage, rewriteContentUrls } from "@/lib/wp-json";

export const metadata = {
    title: "How it Works",
    description: "Learn how Uusi kielemme helps you practice Finnish.",
};

function CenteredArticle({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full flex-1 flex-col items-center">
            <div className="w-full max-w-2xl">{children}</div>
        </div>
    );
}

export default async function HowItWorksPage() {
    const home = getHomePage();
    if (!home) {
        return (
            <CenteredArticle>
                <div className="space-y-4">
                    <h1 className="m-0 mb-2">Uusi kielemme</h1>
                    <p>Finnish for Busy People</p>
                    <nav className="mt-6 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/finnish-grammar"
                            className="text-primary no-underline hover:underline"
                        >
                            Finnish Grammar
                        </Link>
                        <Link
                            href="/finnish-vocabulary"
                            className="text-primary no-underline hover:underline"
                        >
                            Finnish Vocabulary
                        </Link>
                    </nav>
                </div>
            </CenteredArticle>
        );
    }

    const content = rewriteContentUrls(home.content?.rendered ?? "");

    return (
        <CenteredArticle>
            <article className="text-left">
                <div
                    className="post-body"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>
        </CenteredArticle>
    );
}
