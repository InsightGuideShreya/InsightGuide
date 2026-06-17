import Link from "next/link";
import { SITE_NAME, YOUTUBE_URL } from "@/lib/config";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container-wide" style={{ maxWidth: 980 }}>
          <span className="eyebrow">About</span>
          <h1 className="display">
            We buy it, we live with it, and we tell you if it&apos;s actually worth it.
          </h1>
          <p className="lede" style={{ maxWidth: 720, marginTop: 18 }}>
            {SITE_NAME} is one person (not a brand) testing fewer products than
            you&apos;d expect, for longer than you&apos;d expect, and writing down
            what actually broke. No PR unboxings that turn into advertorials. No
            swapping the verdict on a commission.
          </p>
          <div className="stat-row">
            <div className="stat">
              <span className="num">~ 30</span>
              <span className="lbl">days minimum with every product</span>
            </div>
            <div className="stat">
              <span className="num">1</span>
              <span className="lbl">person, 1 opinion. No panel.</span>
            </div>
            <div className="stat">
              <span className="num">0</span>
              <span className="lbl">reviews we&apos;ve been paid to write</span>
            </div>
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn lg" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              Watch on YouTube ↗
            </a>
            <Link href="/#reviews" className="btn ghost lg">Read the reviews</Link>
          </div>
        </div>
      </section>

      <section className="container-wide" style={{ paddingBottom: 40 }}>
        <div className="bio-block">
          <div className="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80" alt="The host" />
          </div>
          <div>
            <span className="eyebrow">Who&apos;s writing this</span>
            <h2 style={{ marginTop: 12 }}>One person, a borrowed desk, and a lot of cables.</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              I started {SITE_NAME} because I kept getting burned by ten-minute
              reviews that never mentioned the thing that broke three months in.
              So I started keeping things longer and writing down what actually
              mattered — the small annoyances, the things you only learn on day 47.
            </p>
            <p className="lede" style={{ marginTop: 12 }}>
              When something&apos;s good, I&apos;ll say so. When it isn&apos;t,
              I&apos;ll say why. Either way you get a deal link if I think it&apos;s
              worth your money — and a frank verdict if it isn&apos;t.
            </p>
          </div>
        </div>

        <div className="grid" style={{ marginTop: 32 }}>
          <div className="panel-card">
            <span className="eyebrow">What we test</span>
            <h3 className="display h3" style={{ marginTop: 10 }}>Fewer products. Longer.</h3>
            <p className="muted" style={{ marginTop: 10 }}>
              Most weeks nothing publishes. A review only goes up after at least
              a month of daily use — and only if it&apos;s still on the desk on
              day 30.
            </p>
          </div>
          <div className="panel-card">
            <span className="eyebrow">What we won&apos;t do</span>
            <h3 className="display h3" style={{ marginTop: 10 }}>No pay-to-play. No PR scripts.</h3>
            <p className="muted" style={{ marginTop: 10 }}>
              We don&apos;t take payment for a positive review, we don&apos;t get
              talking points from brands, and we don&apos;t pretend a tool is
              great because the company sent it over.
            </p>
          </div>
          <div className="panel-card">
            <span className="eyebrow">Affiliate links</span>
            <h3 className="display h3" style={{ marginTop: 10 }}>They help, they don&apos;t decide.</h3>
            <p className="muted" style={{ marginTop: 10 }}>
              Some links here earn us a small commission at no cost to you. The
              verdict is written before the link is added — and never the other
              way around.
            </p>
          </div>
        </div>

        <div className="panel-card" style={{ marginTop: 28 }}>
          <div className="spread" style={{ marginBottom: 16 }}>
            <h2 className="display h3" style={{ margin: 0 }}>Get the next review in your inbox</h2>
          </div>
          <div className="row" style={{ alignItems: "start" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p className="muted">
                Issues are rare on purpose. You&apos;ll get exactly one email when
                a new review goes live — never any marketing blasts.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
