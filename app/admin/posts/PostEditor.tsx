"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import ImageUploader from "./ImageUploader";
import { CATEGORIES } from "@/lib/config";

type Product = {
  id?: string;
  name: string;
  description: string;
  image_path: string | null;
  affiliate_url: string;
  rating: number | null;
  position: number;
};

type Post = {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  description: string;
  cover_image_path: string | null;
  category: string;
  verdict: string | null;
  rating: number | null;
  featured: boolean;
  status: "draft" | "published";
  author_id?: string | null;
};

type Props =
  | { mode: "create"; authorId: string | null; post?: undefined; products?: undefined }
  | { mode: "edit"; post: Post; products: Product[]; authorId?: undefined };

function emptyProduct(): Product {
  return {
    name: "",
    description: "",
    image_path: null,
    affiliate_url: "",
    rating: null,
    position: 0,
  };
}

const SUPABASE_BUCKET = "media";
function publicUrl(path: string | null) {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
}

function autoSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function PostEditor(props: Props) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const init = props.mode === "edit" ? props.post : null;

  const [headline, setHeadline] = useState(init?.headline ?? "");
  const [slug, setSlug] = useState(init?.slug ?? "");
  const [excerpt, setExcerpt] = useState(init?.excerpt ?? "");
  const [description, setDescription] = useState(init?.description ?? "");
  const [coverImagePath, setCoverImagePath] = useState<string | null>(
    init?.cover_image_path ?? null,
  );
  const [category, setCategory] = useState(init?.category ?? "Reviews");
  const [verdict, setVerdict] = useState(init?.verdict ?? "");
  const [rating, setRating] = useState<number | null>(init?.rating ?? null);
  const [featured, setFeatured] = useState<boolean>(init?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published">(
    (init?.status as "draft" | "published") ?? "draft",
  );
  const [products, setProducts] = useState<Product[]>(
    props.mode === "edit" && props.products.length > 0
      ? props.products
      : [emptyProduct()],
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slugTouched = useRef(props.mode === "edit");

  useEffect(() => {
    if (slugTouched.current) return;
    if (!headline.trim()) return;
    setSlug(autoSlug(headline));
  }, [headline]);

  function updateProduct(i: number, patch: Partial<Product>) {
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addProduct() {
    setProducts((prev) => [...prev, emptyProduct()]);
  }
  function removeProduct(i: number) {
    setProducts((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i),
    );
  }
  function moveProduct(i: number, dir: -1 | 1) {
    setProducts((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return next;
    });
  }

  async function save(nextStatus: "draft" | "published") {
    setError(null);
    setBusy(true);

    if (!headline.trim()) {
      setError("Headline is required.");
      setBusy(false);
      return;
    }
    const validProducts = products.filter(
      (p) => p.name.trim() && p.affiliate_url.trim(),
    );
    if (validProducts.length === 0) {
      setError("Add at least one product with a name and affiliate link.");
      setBusy(false);
      return;
    }

    const finalSlug = slug.trim() || autoSlug(headline) || "post";

    let postId: string;

    if (props.mode === "create") {
      const { data, error: insErr } = await supabase
        .from("posts")
        .insert({
          headline: headline.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          description: description.trim(),
          cover_image_path: coverImagePath,
          category,
          verdict: verdict.trim() || null,
          rating,
          featured,
          status: nextStatus,
          author_id: props.authorId ?? null,
        })
        .select("id")
        .single();
      if (insErr || !data) {
        setError(insErr?.message ?? "Failed to create post.");
        setBusy(false);
        return;
      }
      postId = data.id;
    } else {
      const { error: updErr } = await supabase
        .from("posts")
        .update({
          headline: headline.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          description: description.trim(),
          cover_image_path: coverImagePath,
          category,
          verdict: verdict.trim() || null,
          rating,
          featured,
          status: nextStatus,
        })
        .eq("id", props.post.id);
      if (updErr) {
        setError(updErr.message);
        setBusy(false);
        return;
      }
      postId = props.post.id;
    }

    await supabase.from("products").delete().eq("post_id", postId);
    const rows = validProducts.map((p, i) => ({
      post_id: postId,
      name: p.name.trim(),
      description: (p.description || "").trim(),
      image_path: p.image_path ?? null,
      affiliate_url: p.affiliate_url.trim(),
      rating: p.rating ?? null,
      position: i,
    }));
    const { error: prodErr } = await supabase.from("products").insert(rows);
    if (prodErr) {
      setError(`Post saved, but products failed: ${prodErr.message}. Edit and retry.`);
      setBusy(false);
      return;
    }

    setStatus(nextStatus);
    setBusy(false);
    if (props.mode === "create") {
      router.push(`/admin/posts/${postId}`);
    } else {
      router.refresh();
    }
  }

  async function deletePost() {
    if (props.mode !== "edit") return;
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    setBusy(true);
    const { error: delErr } = await supabase.from("posts").delete().eq("id", props.post.id);
    setBusy(false);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>{props.mode === "create" ? "New post" : "Edit post"}</h1>
          <div className="desc">
            {props.mode === "edit"
              ? "Tweak headline, content, products, and verdict."
              : "Compose a fresh review. You can save as draft or publish immediately."}
          </div>
        </div>
        <div className="row">
          <span className={`badge ${status === "published" ? "live" : "draft"}`}>{status}</span>
          <span className="badge">{category}</span>
          {featured ? <span className="badge live">Featured</span> : null}
        </div>
      </div>

      {/* Review meta */}
      <div className="panel-card">
        <div className="row">
          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <label className="label">Headline</label>
            <input
              className="input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Best Budget Monitors of 2026"
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label className="label">Slug</label>
            <input
              className="input"
              value={slug}
              onChange={(e) => {
                slugTouched.current = true;
                setSlug(e.target.value);
              }}
              placeholder="best-budget-monitors-2026"
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 180 }}>
            <label className="label">Category</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label className="label">Status</label>
            <select
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label className="label">Rating (0–10)</label>
            <input
              className="input"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={rating ?? ""}
              onChange={(e) =>
                setRating(e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="8.5"
            />
          </div>
          <div
            className="field"
            style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "end" }}
          >
            <label className="row" style={{ alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
              />
              <span style={{ color: "var(--text)", fontSize: 14 }}>
                Pin as featured on the homepage
              </span>
            </label>
          </div>
        </div>

        <div className="field">
          <label className="label">Short description (home grid)</label>
          <textarea
            className="textarea"
            style={{ minHeight: 80 }}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A quick one-liner about what's in this review…"
          />
        </div>

        <div className="field">
          <label className="label">Full description</label>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the intro to your review here…"
          />
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label className="label">Verdict (one-paragraph wrap-up)</label>
          <textarea
            className="textarea"
            value={verdict ?? ""}
            onChange={(e) => setVerdict(e.target.value)}
            placeholder="The bottom line on this review…"
          />
        </div>
      </div>

      {/* Cover */}
      <h2 className="display h3" style={{ margin: "26px 0 12px" }}>Cover image</h2>
      <div className="panel-card">
        <ImageUploader
          value={coverImagePath}
          previewUrl={publicUrl(coverImagePath)}
          onChange={(path) => setCoverImagePath(path)}
        />
      </div>

      {/* Products */}
      <div className="spread" style={{ margin: "26px 0 12px" }}>
        <h2 className="display h3" style={{ margin: 0 }}>Products</h2>
        <button type="button" className="btn quiet" onClick={addProduct}>
          + Add another product
        </button>
      </div>

      {products.map((p, i) => (
        <div className="product-row" key={i} style={{ marginBottom: 14 }}>
          <div className="spread" style={{ marginBottom: 12 }}>
            <div className="row" style={{ alignItems: "center", gap: 10 }}>
              <span className="eyebrow">Product {i + 1}</span>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button
                type="button"
                className="btn ghost"
                style={{ padding: "6px 10px" }}
                onClick={() => moveProduct(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="btn ghost"
                style={{ padding: "6px 10px" }}
                onClick={() => moveProduct(i, 1)}
                disabled={i === products.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="btn danger"
                style={{ padding: "6px 12px" }}
                onClick={() => removeProduct(i)}
                disabled={products.length === 1}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="row">
            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="label">Product name</label>
              <input
                className="input"
                value={p.name}
                onChange={(e) => updateProduct(i, { name: e.target.value })}
                placeholder="Logitech MX Master 3S"
              />
            </div>
            <div className="field" style={{ flex: 1, minWidth: 240 }}>
              <label className="label">Affiliate link</label>
              <input
                className="input"
                value={p.affiliate_url}
                onChange={(e) => updateProduct(i, { affiliate_url: e.target.value })}
                placeholder="https://amzn.to/…"
              />
            </div>
            <div className="field" style={{ width: 140, flexShrink: 0 }}>
              <label className="label">Rating (0–10)</label>
              <input
                className="input"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={p.rating ?? ""}
                onChange={(e) =>
                  updateProduct(i, {
                    rating: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                placeholder="8.5"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              style={{ minHeight: 80 }}
              value={p.description}
              onChange={(e) => updateProduct(i, { description: e.target.value })}
              placeholder="Why it's good (or why it's not)…"
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Product image</label>
            <ImageUploader
              value={p.image_path}
              previewUrl={publicUrl(p.image_path)}
              onChange={(path) => updateProduct(i, { image_path: path })}
            />
          </div>
        </div>
      ))}

      {error ? (
        <div className="notice error" style={{ marginTop: 18 }}>
          {error}
        </div>
      ) : null}

      <div className="admin-actions">
        <button className="btn lg" disabled={busy} onClick={() => save(status)}>
          {busy
            ? "Saving…"
            : props.mode === "create"
              ? status === "published"
                ? "Publish"
                : "Save draft"
              : "Save"}
        </button>
        {props.mode === "create" && status === "draft" ? (
          <button
            className="btn ghost lg"
            disabled={busy}
            onClick={() => save("published")}
          >
            Save & publish
          </button>
        ) : null}
        {props.mode === "edit" ? (
          <button
            className="btn danger"
            disabled={busy}
            onClick={deletePost}
            style={{ marginLeft: "auto" }}
          >
            Delete post
          </button>
        ) : null}
      </div>
    </div>
  );
}
