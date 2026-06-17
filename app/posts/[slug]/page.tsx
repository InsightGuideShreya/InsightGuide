import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicUrl, formatDate, estimateReadingTime } from "@/lib/util";
import { YOUTUBE_URL } from "@/lib/config";
import PostCard from "@/components/PostCard";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("headline, excerpt, cover_image_path")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) return { title: "Not found" };
  return {
    title: post.headline,
    description: post.excerpt || undefined,
    openGraph: post.cover_image_path
      ? { images: [publicUrl(post.cover_image_path)!] }
      : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, image_path, affiliate_url")
    .eq("post_id", post.id)
    .order("position", { ascending: true });

  // Related: same category, different post
  const { data: related } = await supabase
    .from("posts")
    .select("id, slug, headline, excerpt, cover_image_path, category, rating, created_at")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const minutes = estimateReadingTime(post.description);

  return (
    <article className="article container-wide">
      <div className="crumbs">
        <Link href="/">Reviews</Link>
        <span>›</span>
        {post.category ? (
          <>
            <Link href={`/?category=${encodeURIComponent(post.category)}`}>
              {post.category}
            </Link>
            <span>›</span>
          </>
        ) : null}
        <span style={{ color: "var(--text)" }}>{post.headline}</span>
      </div>

      {post.category ? (
        <span className="chip" style={{ marginBottom: 14 }}>{post.category}</span>
      ) : null}

      <h1 className="headline">{post.headline}</h1>

      <div className="meta-bar">
        <span>{formatDate(post.created_at, { year: "numeric", month: "long", day: "numeric" })}</span>
        {minutes ? (
          <>
            <span className="sep" />
            <span>{minutes} min read</span>
          </>
        ) : null}
        <span className="sep" />
        <span>{(products ?? []).length} products</span>
      </div>

      {post.cover_image_path ? (
        <div className="cover-full fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicUrl(post.cover_image_path)!} alt={post.headline} />
        </div>
      ) : null}

      {post.description ? (
        <div className="prose" style={{ maxWidth: 780, margin: "0 auto 24px" }}>
          {post.description.split(/\n{2,}/).map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : null}

      {post.verdict || post.rating ? (
        <div className="verdict-block" style={{ maxWidth: 880, margin: "0 auto 40px" }}>
          <div>
            <div className="eyebrow">Verdict</div>
            {post.rating ? (
              <div className="rating" style={{ marginTop: 10 }}>
                <span>★</span>
                <span>{post.rating.toFixed(1)} / 10</span>
              </div>
            ) : null}
          </div>
          <div>
            <h3>The bottom line, in one paragraph</h3>
            <p style={{ color: "var(--muted)", margin: "8px 0 0" }}>
              {post.verdict ?? "Worth it — see each product below for what to grab and what to skip."}
            </p>
          </div>
        </div>
      ) : null}

      <h2 className="display h3" style={{ margin: "24px 0 16px" }}>
        The products we used — and what we&apos;d skip
      </h2>

      {(products ?? []).length > 0 ? (
        <div className="products-stack" style={{ maxWidth: 980, margin: "0 auto" }}>
          {(products ?? []).map((p: {
            id: string;
            name: string;
            description: string;
            image_path: string | null;
            affiliate_url: string;
          }, i: number) => (
            <div className="product" key={p.id}>
              <div className="img">
                {p.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicUrl(p.image_path)!} alt={p.name} />
                ) : null}
              </div>
              <div className="body">
                <span className="eyebrow">#{i + 1}</span>
                <h4>{p.name}</h4>
                {p.description ? <p>{p.description}</p> : null}
              </div>
              <div className="actions">
                <a
                  className="btn lg"
                  href={p.affiliate_url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  Click here to buy ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notice">No products listed on this review yet.</div>
      )}

      <div className="notice" style={{ maxWidth: 880, margin: "28px auto 0" }}>
        Affiliate note: We may earn a small commission if you buy through these
        links — at no extra cost to you. It helps fund the testing time that
        makes these reviews possible. The verdict above was written before the
        links went in, and never the other way around.
      </div>

      {products && products.length > 0 ? (
        <div className="post-cta">
          <a
            className="btn ghost"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch video
          </a>
          <a
            className="btn"
            href={products[0].affiliate_url}
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            See on retailer ↗
          </a>
        </div>
      ) : null}

      {(related ?? []).length > 0 ? (
        <section style={{ marginTop: 56 }}>
          <div className="section-head">
            <h2 className="display h3">More in {post.category ?? "Reviews"}</h2>
            <Link href="/" className="more">All reviews →</Link>
          </div>
          <div className="grid">
            {(related ?? []).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
