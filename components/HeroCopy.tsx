import { SITE_NAME, SITE_TAGLINE, YOUTUBE_URL } from "@/lib/config";

const ROTATING = [
  "we bought with our own money",
  "we live with for weeks",
  "we'd still recommend to a friend",
  "we put through real, ugly workloads",
];

const picker = ROTATING[0]; // deterministic for SSR; client can surprise later

export default function HeroCopy() {
  return (
    <>
      <span className="eyebrow">Reviews · {SITE_TAGLINE}</span>
      <h1 className="display h1" style={{ marginTop: 12 }}>
        {SITE_NAME}: gear {picker},<br />
        <span style={{ color: "var(--accent-2)" }}>honest about the rest.</span>
      </h1>
      <p className="lede">
        No &ldquo;top 10&rdquo; listicles. No sponsors in the script. We pick a few
        products, test them in real life, and tell you what&apos;s genuinely worth
        your money — and what isn&apos;t. The deal links help us keep the lights on;
        the verdict never changes because of them.
      </p>
    </>
  );
}
