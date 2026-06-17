import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };

type SP = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: SP) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  let results: Array<{
    id: string;
    slug: string;
    headline: string;
    excerpt: string;
    cover_image_path: string | null;
    category: string | null;
    rating: number | null;
    created_at: string;
  }> = [];

  if (term) {
    const supabase = await createClient();
    const like = `%${term}%`;
    const { data } = await supabase
      .from("posts")
      .select("id, slug, headline, excerpt, cover_image_path, category, rating, created_at")
      .eq("status", "published")
      .or(`headline.ilike.${like},excerpt.ilike.${like},description.ilike.${like},category.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(30);
    results = data ?? [];
  }

  return (
    <section className="search-page container-wide">
      <span className="eyebrow">Search</span>
      <h1 className="display h2" style={{ marginTop: 8 }}>
        {term ? <>Results for &ldquo;{term}&rdquo;</> : "Search reviews"}
      </h1>
      <form className="search-input-lg" style={{ marginTop: 18 }} method="get" action="/search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Search reviews, categories, products…"
          aria-label="Search"
        />
      </form>

      {!term ? (
        <div className="empty-state" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Type a query above. You&apos;ll see matches across review titles,
            categories, and descriptions.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "var(--text)" }}>
            No matches for &ldquo;{term}&rdquo;.
          </p>
          <p style={{ marginTop: 6 }}>
            Try a different term, or <a href="/" style={{ color: "var(--accent-2)" }}>browse every review</a>.
          </p>
        </div>
      ) : (
        <>
          <div className="muted" style={{ marginTop: 24, marginBottom: 12, fontSize: 13 }}>
            {results.length} {results.length === 1 ? "result" : "results"}
          </div>
          <div className="grid">
            {results.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
