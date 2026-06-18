import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicUrl, formatDate } from "@/lib/util";
import PostSidebar from "./PostSidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Posts" };

async function publishPost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("posts").update({ status: "published" }).eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/posts/${String(formData.get("slug") || "")}`);
}

async function unpublishPost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("posts").update({ status: "draft" }).eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${String(formData.get("slug") || "")}`);
}

async function deletePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  redirect("/admin/posts");
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, headline, status, category, created_at")
    .order("created_at", { ascending: false });

  const all = posts ?? [];
  const published = all.filter((p) => p.status === "published");
  const drafts = all.filter((p) => p.status !== "published");

  // Pick selected post from the URL or fall back to the most recent post
  const selectedId = sp?.id ?? null;
  const selected =
    (selectedId && all.find((p) => p.id === selectedId)) || all[0] || null;

  let products: Array<{
    id: string;
    name: string;
    description: string;
    image_path: string | null;
    affiliate_url: string;
    rating: number | null;
    position: number;
  }> = [];

  if (selected) {
    const { data } = await supabase
      .from("products")
      .select("id, name, description, image_path, affiliate_url, rating, position")
      .eq("post_id", selected.id)
      .order("position", { ascending: true });
    products = data ?? [];
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Posts</h1>
          <div className="desc">Pick a post to edit, publish, or delete.</div>
        </div>
        <Link href="/admin/posts/new" className="btn lg">
          + New post
        </Link>
      </div>

      <div className="admin-stack">
        <PostSidebar
          published={published}
          drafts={drafts}
          selectedId={selected?.id ?? null}
        />

        {selected ? (
          <div className="admin-detail">
            <div className="admin-detail-head">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                  <span className={`badge ${selected.status === "published" ? "live" : "draft"}`}>
                    {selected.status}
                  </span>
                  <span className="chip" style={{ padding: "3px 10px" }}>
                    {selected.category}
                  </span>
                </div>
                <h2 className="display h3" style={{ margin: 0 }}>
                  {selected.headline}
                </h2>
                <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                  /{selected.slug} · {formatDate(selected.created_at)}
                </div>
              </div>
            </div>

            <div className="admin-detail-actions">
              <Link
                href={`/admin/posts/${selected.id}`}
                className="btn lg"
              >
                Edit
              </Link>
              {selected.status === "published" ? (
                <form action={unpublishPost} style={{ display: "contents" }}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="slug" value={selected.slug} />
                  <button type="submit" className="btn ghost lg">
                    Unpublish
                  </button>
                </form>
              ) : (
                <form action={publishPost} style={{ display: "contents" }}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="slug" value={selected.slug} />
                  <button type="submit" className="btn ghost lg">
                    Publish
                  </button>
                </form>
              )}
              <form action={deletePost} style={{ display: "contents" }} id={`delete-${selected.id}`}>
                <input type="hidden" name="id" value={selected.id} />
                <button type="submit" className="btn danger lg">
                  Delete
                </button>
              </form>
            </div>

            {products.length > 0 ? (
              <>
                <div className="eyebrow" style={{ marginTop: 18, marginBottom: 10 }}>
                  Products in this review ({products.length})
                </div>
                <ol className="admin-products">
                  {products.map((p) => (
                    <li key={p.id} className="admin-product">
                      <div className="thumb">
                        {p.image_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={publicUrl(p.image_path)!} alt={p.name} />
                        ) : (
                          <span aria-hidden>—</span>
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="spread" style={{ gap: 8 }}>
                          <strong style={{ fontSize: 14 }}>{p.name}</strong>
                          {typeof p.rating === "number" ? (
                            <span className="rating-chip" style={{ padding: "2px 8px", fontSize: 12 }}>
                              ★ {p.rating.toFixed(1)}
                            </span>
                          ) : null}
                        </div>
                        {p.description ? (
                          <div className="muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                            {p.description}
                          </div>
                        ) : null}
                        <a
                          href={p.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="muted"
                          style={{ fontSize: 12, display: "inline-block", marginTop: 6, textDecoration: "underline" }}
                        >
                          {p.affiliate_url}
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <div className="notice" style={{ marginTop: 18 }}>
                No products on this post yet. Click <strong>Edit</strong> to add some.
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p style={{ margin: 0 }}>
              No posts yet. Click <strong>+ New post</strong> to write your first review.
            </p>
          </div>
        )}
      </div>

      {/* Tiny inline script for the delete confirmation */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('submit', function(e) {
              var form = e.target;
              if (form && form.id && form.id.indexOf('delete-') === 0) {
                if (!window.confirm('Delete this post permanently? This cannot be undone.')) {
                  e.preventDefault();
                }
              }
            });
          `,
        }}
      />
    </div>
  );
}
