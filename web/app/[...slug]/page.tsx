import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPaths,
  getByPath,
  pathToSlugSegments,
  rewriteContentUrls,
} from "@/lib/wp-json";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const paths = getAllPaths();
  return paths.map(({ path: routePath }) => ({
    slug: pathToSlugSegments(routePath),
  }));
}

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
  const item = getByPath(slug ?? []);
  if (!item) notFound();

  const content = rewriteContentUrls(item.content?.rendered ?? "");

  return (
    <article className="post-content">
      <header>
        <h1
          className="post-title"
          dangerouslySetInnerHTML={{ __html: item.title?.rendered ?? "" }}
        />
        {(item.date || item.modified) && (
          <time dateTime={item.modified || item.date}>
            {new Date(item.modified || item.date).toLocaleDateString("fi-FI")}
          </time>
        )}
      </header>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
