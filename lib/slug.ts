export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function ensureUniqueSlug(
  base: string,
  exists: (s: string) => Promise<boolean>,
): Promise<string> {
  let slug = base || "post";
  let i = 1;
  while (await exists(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
