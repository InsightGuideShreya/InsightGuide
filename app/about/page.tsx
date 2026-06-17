import { SITE_NAME, YOUTUBE_URL } from "@/lib/config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="container-wide" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 760 }}>
      <span className="eyebrow">About</span>
      <h1 className="display" style={{ marginTop: 12, marginBottom: 24 }}>
        {SITE_NAME}
      </h1>

      <div className="prose" style={{ fontSize: 17, lineHeight: 1.7 }}>
        <p>
          {SITE_NAME} is one person testing fewer products, for longer, and
          writing down what actually matters — the small annoyances, the things
          you only learn after a month of daily use.
        </p>
        <p>
          Reviews are honest. The verdict is written before any deal link goes
          in. Some of those links earn a small commission — at no cost to you —
          and that&apos;s how the site pays for itself.
        </p>
        <p>
          No sponsored reviews. No PR scripts. If a product isn&apos;t worth
          your money, we say so.
        </p>
      </div>

      <hr style={{ margin: "36px 0 24px" }} />

      <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
        <a className="btn lg" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          Watch on YouTube ↗
        </a>
        <a className="btn ghost lg" href="/#reviews">Read the reviews</a>
      </div>
    </section>
  );
}
