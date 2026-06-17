import { createClient } from "@/lib/supabase/server";
import { SITE_NAME, YOUTUBE_URL } from "@/lib/config";
import PostCard from "@/components/PostCard";
import CategoryRail from "@/components/CategoryRail";
import FeaturedHero from "@/components/FeaturedHero";
import HeroCopy from "@/components/HeroCopy";
import Link from "next/link";

export const revalidate = 60;
export const dynamic = "force-dynamic";

type SP = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function HomePage({ searchParams }: SP) {
  const sp = await searchParams;
  const category = sp?.category;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, slug, headline, excerpt, cover_image_path, category, rating, created_at, featured")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data: posts } = await query;
  const list = posts ?? [];

  let featured = list.find((p) => p.featured);
  if (!featured && category) {
    featured = undefined as unknown as typeof list[number];
  }
  const recent = list.filter((p) => p.id !== featured?.id).slice(0, 9);

  return (
    <>
      <section className="hero">
        <div className="container-wide">
          <HeroCopy />
          <div className="meta-row">
            <a className="btn lg" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </section>

      <section className="container-wide" id="reviews" style={{ paddingTop: 24, scrollMarginTop: 96 }}>
        <CategoryRail active={category ?? "All"} />

        {featured ? (
          <FeaturedHero post={featured} />
        ) : null}

        <div className="section-head">
          <h2 className="display h3">
            {category && category !== "All" ? category : "Latest reviews"}
          </h2>
          <Link href="/search" className="more">Browse all →</Link>
        </div>

        {recent.length > 0 ? (
          <div className="grid">
            {recent.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: 18, color: "var(--text)", marginBottom: 6 }}>
              No published reviews in this category yet.
            </div>
            <p style={{ margin: "0 0 14px" }}>
              Check back soon — or jump into the full list.
            </p>
            <Link href="/" className="btn">Show me everything</Link>
          </div>
        )}
      </section>
    </>
  );
}
