import Link from "next/link";
import { SITE_NAME, YOUTUBE_URL } from "@/lib/config";
import NewsletterForm from "./NewsletterForm";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide footer-newsletter">
        <h5 className="footer-newsletter-title">Newsletter</h5>
        <div className="footer-newsletter-form">
          <NewsletterForm />
        </div>
      </div>

      <div className="container-wide footer-grid">
        <div>
          <div className="brand" style={{ marginBottom: 14 }}>
            <span className="mark">IG</span>
            <span>{SITE_NAME}</span>
          </div>
          <p style={{ color: "var(--muted)", maxWidth: 340, margin: 0, fontSize: 14 }}>
            One person. A smaller set of products tested over weeks, not hours,
            with the verdict written before any deal link goes in.
          </p>
        </div>

        <div>
          <h5>Browse</h5>
          <Link href="/#reviews">All reviews</Link>
          <Link href="/?category=Top%20Picks">Top picks</Link>
          <Link href="/?category=Guides">Guides</Link>
          <Link href="/?category=Comparison">Comparisons</Link>
        </div>

        <div>
          <h5>Channel</h5>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
          <Link href="/about">About</Link>
          <Link href="/search">Search</Link>
        </div>

        <div>
          <h5>Legal</h5>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>

      <div className="container-wide copyright">
        <div>
          © {new Date().getFullYear()} {SITE_NAME}. Some links on this page are
          affiliate links — we may earn a small commission at no extra cost to you. The verdict is written before the link goes in.
        </div>
        <div></div>
      </div>
    </footer>
  );
}
