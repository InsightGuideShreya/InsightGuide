import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicUrl, formatDate } from "@/lib/util";
import { YOUTUBE_URL } from "@/lib/config";

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
    .select("id, slug, headline, category, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, image_path, affiliate_url, rating")
    .eq("post_id", post.id)
    .order("position", { ascending: true });

  const list = products ?? [];

  return (
    <article className="article container-wide" style={{ paddingTop: 32 }}>
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
        <span>
          {formatDate(post.created_at, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="sep" />
        <span>{list.length} {list.length === 1 ? "product" : "products"}</span>
      </div>

      {list.length > 0 ? (
        <div className="products-stack" style={{ maxWidth: 980, margin: "8px auto 0" }}>
          {list.map((p: {
            id: string;
            name: string;
            description: string;
            image_path: string | null;
            affiliate_url: string;
            rating: number | null;
          }, i: number) => (
            <div className="product product-card-row" key={p.id}>
              <div className="img">
                {p.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicUrl(p.image_path)!} alt={p.name} />
                ) : null}
              </div>
              <div className="body">
                <div className="product-name-row">
                  <span className="eyebrow">#{i + 1}</span>
                  <h4>{p.name}</h4>
                  {typeof p.rating === "number" ? (
                    <div className="rating-chip" aria-label={`Rating ${p.rating.toFixed(1)} out of 10`}>
                      <span>★</span>
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
                {p.description ? <p>{p.description}</p> : null}
                <div className="actions">
                  <a
                    className="btn"
                    href={p.affiliate_url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                  >
                    Click here to buy ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notice">No products listed on this review yet.</div>
      )}

      <div className="notice" style={{ maxWidth: 880, margin: "28px auto 0" }}>
        Affiliate note: We may earn a small commission if you buy through these
        links &mdash; at no extra cost to you.
      </div>

      {list.length > 0 ? (
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
            href={list[0].affiliate_url}
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            See on retailer ↗
          </a>
        </div>
      ) : null}
    </article>
  );
}
