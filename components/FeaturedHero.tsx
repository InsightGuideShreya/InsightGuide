import Link from "next/link";
import { publicUrl, formatDate } from "@/lib/util";

type Featured = {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  cover_image_path: string | null;
  category: string | null;
  created_at: string;
  rating?: number | null;
};

export default function FeaturedHero({ post }: { post: Featured }) {
  return (
    <Link href={`/posts/${post.slug}`} className="featured fade-in">
      <div className="img">
        {post.cover_image_path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={publicUrl(post.cover_image_path)!} alt={post.headline} />
        ) : null}
      </div>
      <div className="body">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="eyebrow" style={{ color: "var(--accent-2)" }}>
            Worth your time
          </span>
          {post.category ? (
            <span className="chip" style={{ padding: "4px 10px", fontSize: 12 }}>
              {post.category}
            </span>
          ) : null}
        </div>
        <h1 className="display h1">{post.headline}</h1>
        {post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
        <div style={{ display: "flex", gap: 14, alignItems: "center", color: "var(--muted)", fontSize: 13 }}>
          <span>{formatDate(post.created_at)}</span>
          {post.rating ? (
            <>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--muted-2)" }} />
              <span>★ {post.rating.toFixed(1)} — our verdict</span>
            </>
          ) : null}
        </div>
        <div style={{ marginTop: 14 }}>
          <span className="btn lg">Read the review →</span>
        </div>
      </div>
    </Link>
  );
}
