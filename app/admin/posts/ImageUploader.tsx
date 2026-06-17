"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const BUCKET = "media";

type Props = {
  value: string | null;
  previewUrl: string | null;
  onChange: (path: string | null) => void;
};

export default function ImageUploader({ value, previewUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image too large (max 8 MB).");
      return;
    }

    setBusy(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safe = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 40) || "image";
    const path = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${safe}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setBusy(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    onChange(path);
  }

  async function remove() {
    if (!value) return;
    if (!confirm("Remove this image? It will be deleted from storage.")) return;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    setBusy(true);
    await supabase.storage.from(BUCKET).remove([value]);
    setBusy(false);
    onChange(null);
  }

  return (
    <div>
      <div className="image-uploader">
        <div className="preview">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn secondary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value ? (
            <button
              type="button"
              className="btn ghost"
              disabled={busy}
              onClick={remove}
            >
              Remove
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {error ? (
        <div className="notice error" style={{ marginTop: 8 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
