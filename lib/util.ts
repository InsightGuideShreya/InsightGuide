export function publicUrl(path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "media";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function formatDate(d: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString(
    undefined,
    opts ?? { year: "numeric", month: "short", day: "numeric" },
  );
}

export function estimateReadingTime(text?: string | null) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return minutes;
}
