import Link from "next/link";
import { getHomePage, rewriteContentUrls } from "@/lib/wp-json";

export default async function HomePage() {
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
