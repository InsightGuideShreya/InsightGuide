import { SITE_NAME } from "@/lib/config";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <section className="container-wide" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 760 }}>
      <span className="eyebrow">Legal</span>
      <h1 className="display" style={{ marginTop: 12, marginBottom: 8 }}>Privacy policy</h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        Short and honest. Effective {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.
      </p>

      <div className="prose" style={{ fontSize: 16.5, lineHeight: 1.7 }}>
        <h2 className="display h3" style={{ marginTop: 18 }}>What we collect</h2>
        <p>
          Two things, and only two:
        </p>
        <ul>
          <li>
            <strong>Newsletter email</strong> &mdash; if you choose to subscribe.
            Stored in our database, used only to send the next review email.
          </li>
          <li>
            <strong>Standard server logs</strong> &mdash; anonymized IP, browser
            type, pages visited. Kept briefly for spam and abuse protection.
          </li>
        </ul>

        <h2 className="display h3" style={{ marginTop: 28 }}>What we don&apos;t collect</h2>
        <ul>
          <li>No advertising trackers, no remarketing pixels, no cross-site profiles.</li>
          <li>No third-party analytics tied to your identity.</li>
        </ul>

        <h2 className="display h3" style={{ marginTop: 28 }}>Affiliate links</h2>
        <p>
          Some links in reviews go through partner networks (Amazon, retailers).
          Those networks may set a cookie to attribute a sale to {SITE_NAME}.
          We receive a small commission at no extra cost to you. The verdict
          on every product was written before any link was added and is
          unchanged by it.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>Your data, your control</h2>
        <ul>
          <li>Unsubscribe from the newsletter: every email has a one-click unsubscribe link.</li>
          <li>Want your email deleted entirely? Email us and we&apos;ll remove it within 7 days.</li>
          <li>You can request a copy of any personal data we hold about you.</li>
        </ul>

        <h2 className="display h3" style={{ marginTop: 28 }}>Where the data lives</h2>
        <p>
          Site and database are hosted on Supabase; deployment is on Vercel. Both
          are GDPR-compliant processors with EU/US data centers.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>Children</h2>
        <p>
          This site is not for anyone under 13. We do not knowingly collect
          data from children.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>Changes</h2>
        <p>
          If this policy changes in a meaningful way, we&apos;ll note it at
          the top of this page with the new effective date.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>Contact</h2>
        <p>
          Questions or requests: reach out via the YouTube channel link in the footer.
        </p>
      </div>
    </section>
  );
}
