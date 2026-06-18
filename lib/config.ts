export const SITE_NAME = "Insight Guide";
export const SITE_TAGLINE = "Honest reviews. Real deal.";
export const SITE_DESCRIPTION =
  "Insight Guide reviews products you actually need. Find deal links for the gear we recommend in our videos.";
export const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@ReviewMartHome";

export const CATEGORIES = [
  "All",
  "Reviews",
  "Guides",
  "Top Picks",
  "Comparison",
  "How-to",
];

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = getAdminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
}

export const SUPABASE_BUCKET = "media";
