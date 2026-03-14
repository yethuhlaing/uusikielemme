import Link from "next/link";
import { getHomePage, rewriteContentUrls } from "@/lib/wp-json";

export const metadata = {
    title: "How it Works",
    description: "Learn how Uusi kielemme helps you practice Finnish.",
};

export default async function HowItWorksPage() {
    const home = getHomePage();
    if (!home) {
        return (
            <div className="home-fallback">
                <h1>Uusi kielemme</h1>
                <p>Finnish for Busy People</p>
                <nav>
                    <Link href="/finnish-grammar">Finnish Grammar</Link>
                    <Link href="/finnish-vocabulary">Finnish Vocabulary</Link>
                </nav>
            </div>
        );
    }

    const content = rewriteContentUrls(home.content?.rendered ?? "");

    return (
        <article className="home-content post-content">
            <div
                className="post-body"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </article>
    );
}
