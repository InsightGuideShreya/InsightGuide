import { SITE_NAME } from "@/lib/config";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <section className="container-wide" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 760 }}>
      <span className="eyebrow">Legal</span>
      <h1 className="display" style={{ marginTop: 12, marginBottom: 8 }}>Terms of use</h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        Plain English. Read once, then ignore.
      </p>

      <div className="prose" style={{ fontSize: 16.5, lineHeight: 1.7 }}>
        <h2 className="display h3" style={{ marginTop: 18 }}>1. What this site is</h2>
        <p>
          {SITE_NAME} is a personal review site operated by an individual
          (not a company, agency, or panel). Reviews are personal opinions
          based on hands-on use. They are not professional buying advice.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>2. Affiliate links & commissions</h2>
        <p>
          Some links on this site are affiliate links. If you buy through them
          we may earn a small commission, at no extra cost to you. The verdict
          for every product is written before any link goes in and is never
          altered for compensation.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>3. No warranties</h2>
        <p>
          Information on this site is provided &ldquo;as is&rdquo;. We work to keep
          reviews accurate and current, but product specs, prices, and
          availability change without notice. Verify anything that matters
          (compatibility, current price, regional availability) on the
          retailer&apos;s own page before you buy.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>4. Pricing & availability</h2>
        <p>
          Prices shown via linked retailers change frequently. The price you
          see on the retailer&apos;s site is the one that applies. Live links
          may break; if a link stops working, search the product name on the
          retailer directly.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>5. Buying is between you and the retailer</h2>
        <p>
          {SITE_NAME} is not a seller. Orders, payment, shipping, returns,
          warranties, and customer service happen entirely with the retailer.
          We can&apos;t mediate disputes, process refunds, or replace defective
          items &mdash; the retailer handles that.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>6. Reviews & opinions</h2>
        <p>
          Reviews reflect our experience with the specific model we tested, at
          the time we tested it. Newer versions, firmware updates, or
          different regional variants can change the picture. We&apos;ll update
          a post when something material changes; sometimes we won&apos;t
          know &mdash; tell us if you spot something.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>7. Use of site content</h2>
        <p>
          You may quote short excerpts with attribution and a link back to the
          original post. Don&apos;t republish full reviews, including photos, on
          another site or in print without asking first.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>8. Newsletter</h2>
        <p>
          Subscribing is opt-in. You can unsubscribe in one click from any
          email we send. See the Privacy page for how your email is stored.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>9. Limitation of liability</h2>
        <p>
          {SITE_NAME}, the operator, and any contributors aren&apos;t liable for
          losses from decisions you make using information on this site,
          including purchases you make through affiliate links.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>10. Changes</h2>
        <p>
          These terms can change. Material updates will be noted at the top of
          this page with the new effective date. Continuing to use the site
          after a change means you accept the updated terms.
        </p>

        <h2 className="display h3" style={{ marginTop: 28 }}>11. Contact</h2>
        <p>
          Questions: reach out via the YouTube channel link in the footer.
        </p>
      </div>
    </section>
  );
}
