import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleWithNotesLayout } from "./ArticleWithNotesLayout";
import { ContentScrollTracker } from "./ContentScrollTracker";
import { getAdjacentLinks } from "@/lib/adjacent-pages";
import { getAllRoutePaths, pathToSlugSegments } from "@/lib/static-paths";
import { getByPath, rewriteContentUrls } from "@/lib/wp-json";

type Props = { params: Promise<{ slug?: string[] }> };

/** Paths that match the catch-all but are static assets (we 404 them so export succeeds) */
const RESERVED_SLUGS: { slug: string[] }[] = [
    { slug: ["favicon.ico"] },
    { slug: ["robots.txt"] },
    { slug: ["sitemap.xml"] },
];

/** Required for output: "export" — list all dynamic paths at build time. */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    try {
        const paths = getAllRoutePaths();
        const fromData = paths
            .map((routePath) => pathToSlugSegments(routePath))
            .filter((segments) => segments.length > 0)
            .map((slug) => ({ slug }));
        return [...fromData, ...RESERVED_SLUGS];
    } catch {
        return RESERVED_SLUGS;
    }
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = getByPath(slug ?? []);
    if (!item) return { title: "Uusi kielemme" };
    const yoast = item.yoast_head_json;
    return {
        title: yoast?.title ?? item.title?.rendered ?? "Uusi kielemme",
        description: yoast?.description ?? undefined,
        openGraph: yoast?.og_image?.[0]?.url
            ? { images: [rewriteContentUrls(yoast.og_image[0].url)] }
            : undefined,
    };
}

export default async function SlugPage({ params }: Props) {
    const { slug } = await params;
    const segments = slug ?? [];
    const isReserved = RESERVED_SLUGS.some(
        (r) =>
            r.slug.length === segments.length &&
            r.slug.every((s, i) => s === segments[i]),
    );
    if (isReserved) notFound();
    const item = getByPath(segments);
    if (!item) notFound();

    const content = rewriteContentUrls(item.content?.rendered ?? "");
    const { prev, next } = await getAdjacentLinks(segments);

    return (
        <ArticleWithNotesLayout slug={segments} prev={prev} next={next}>
            <article className="min-w-0 rounded-xl bg-card border border-border shadow-sm p-6 sm:p-8">
                <ContentScrollTracker />
                <header className="mb-6">
                    <h1
                        className="font-sans font-semibold text-2xl sm:text-3xl tracking-tight text-foreground m-0 mb-2"
                        dangerouslySetInnerHTML={{
                            __html: item.title?.rendered ?? "",
                        }}
                    />
                    {(item.date || item.modified) && (
                        <time
                            dateTime={item.modified || item.date}
                            className="text-sm text-muted-foreground"
                        >
                            {new Date(
                                item.modified || item.date,
                            ).toLocaleDateString("fi-FI")}
                        </time>
                    )}
                </header>
                <div
                    className="post-body"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>
        </ArticleWithNotesLayout>
    );
}
