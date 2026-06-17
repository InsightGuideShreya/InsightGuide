import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export default function HeroCopy() {
  return (
    <>
      <span className="eyebrow">Reviews · {SITE_TAGLINE}</span>
      <h1 className="display h1" style={{ marginTop: 12 }}>
        {SITE_NAME}:&nbsp;<span style={{ color: "var(--accent-2)" }}>real reviews</span>, <br />no fluff.
      </h1>
    </>
  );
}
