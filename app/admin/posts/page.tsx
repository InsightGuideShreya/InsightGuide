import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/util";

export const dynamic = "force-dynamic";
export const metadata = { title: "Posts" };

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, headline, status, category, rating, created_at, featured")
    .order("created_at", { ascending: false });

  const all = posts ?? [];
  const live = all.filter((p) => p.status === "published").length;
  const drafts = all.length - live;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Posts</h1>
          <div className="desc">Drafts and published reviews across every category.</div>
        </div>
        <Link href="/admin/posts/new" className="btn lg">
          + New post
        </Link>
      </div>

      <div className="row" style={{ marginBottom: 22 }}>
        <div className="stat-card" style={{ flex: 1, minWidth: 160 }}>
          <div className="lbl">Total</div>
          <div className="val">{all.length}</div>
        </div>
        <div className="stat-card" style={{ flex: 1, minWidth: 160 }}>
          <div className="lbl">Published</div>
          <div className="val">{live}</div>
        </div>
        <div className="stat-card" style={{ flex: 1, minWidth: 160 }}>
          <div className="lbl">Drafts</div>
          <div className="val">{drafts}</div>
        </div>
      </div>

      <div className="panel-card" style={{ padding: 6 }}>
        <table className="admin">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr key={p.id}>
                <td data-label="Headline">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    style={{ fontWeight: 600 }}
                  >
                    {p.headline}
                  </Link>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    /{p.slug}
                    {p.featured ? (
                      <>
                        {" · "}
                        <span className="badge live">Featured</span>
                      </>
                    ) : null}
                  </div>
                </td>
                <td data-label="Category" style={{ color: "var(--muted)" }}>{p.category}</td>
                <td data-label="Rating" style={{ color: "var(--muted)" }}>
                  {p.rating ? `★ ${p.rating.toFixed(1)}` : "—"}
                </td>
                <td data-label="Status">
                  <span className={`badge ${p.status === "published" ? "live" : "draft"}`}>
                    {p.status}
                  </span>
                </td>
                <td data-label="Created" style={{ color: "var(--muted)" }}>{formatDate(p.created_at)}</td>
                <td data-label="Actions" style={{ textAlign: "right" }}>
                  <Link
                    className="btn ghost"
                    href={`/admin/posts/${p.id}`}
                    style={{ padding: "6px 12px" }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: "var(--muted)", padding: 28, textAlign: "center" }}>
                  No posts yet. Click <strong>+ New post</strong> to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
