"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Post = {
  id: string;
  slug: string;
  headline: string;
  status: string;
  category: string;
  rating: number | null;
  created_at: string;
  featured: boolean;
};

export default function PostSidebar({
  published,
  drafts,
  selectedId,
}: {
  published: Post[];
  drafts: Post[];
  selectedId: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <SidebarGroup
        title={`Published (${published.length})`}
        empty="Nothing published yet."
        posts={published}
        pathname={pathname}
        selectedId={selectedId}
        tone="live"
      />
      <SidebarGroup
        title={`Drafts (${drafts.length})`}
        empty="No drafts."
        posts={drafts}
        pathname={pathname}
        selectedId={selectedId}
        tone="draft"
      />
    </aside>
  );
}

function SidebarGroup({
  title,
  empty,
  posts,
  pathname,
  selectedId,
  tone,
}: {
  title: string;
  empty: string;
  posts: Post[];
  pathname: string;
  selectedId: string | null;
  tone: "live" | "draft";
}) {
  return (
    <div className="sb-group">
      <h6 className="sb-title">
        <span className={`badge ${tone === "live" ? "live" : "draft"}`}>{title}</span>
      </h6>
      {posts.length === 0 ? (
        <div className="sb-empty">{empty}</div>
      ) : (
        <ul className="sb-post-list">
          {posts.map((p) => {
            const active = p.id === selectedId;
            return (
              <li key={p.id} className={`sb-post-row ${active ? "active" : ""}`}>
                <Link
                  href={{ pathname, query: { id: p.id } }}
                  className="sb-post-link"
                >
                  <span className="sb-post-title">{p.headline}</span>
                  <span className="sb-post-meta">
                    <span className={`badge ${tone === "live" ? "live" : "draft"}`} style={{ padding: "2px 8px", fontSize: 10 }}>
                      {tone}
                    </span>
                    <span className="sb-cat">{p.category}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
