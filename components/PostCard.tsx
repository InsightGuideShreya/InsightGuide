import Link from "next/link";
import { publicUrl, formatDate } from "@/lib/util";

type Post = {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  cover_image_path: string | null;
  category: string | null;
  created_at: string;
  rating?: number | null;
};

export default function PostCard({ post, size = "md" }: { post: Post; size?: "sm" | "md" }) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-card fade-in">
      <div className="img">
        {post.cover_image_path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={publicUrl(post.cover_image_path)!} alt={post.headline} loading="lazy" />
        ) : null}
        {post.category ? (
          <span className="pill">{post.category}</span>
        ) : null}
      </div>
      <div className="body">
        <h3>{post.headline}</h3>
        {post.excerpt ? <p className="excerpt">{post.excerpt}</p> : null}
        <div className="meta">
          <span>{formatDate(post.created_at)}</span>
          {post.rating ? (
            <>
              <span className="dot" />
              <span>★ {post.rating.toFixed(1)}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
