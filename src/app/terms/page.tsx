import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { LegalDraftNote } from "@/components/LegalDraftNote";

export const metadata = pageMeta("/terms", "Service terms", `Terms for tender sourcing, preparation and printing support from ${site.name}.`);

export default function Page() {
  return (
    <article className="legal wrap narrow">
      <h1>Service terms</h1>
      <LegalDraftNote reviewed={site.legal.termsReviewedByOwner} />
      {site.legal.lastUpdated && <p className="muted">Last updated {site.legal.lastUpdated}</p>}

      <h2>Inquiries are not bookings</h2>
      <p>
        Submitting a form does not create a contract, reserve capacity or start any work. We accept an assignment only by
        confirming a written scope and quotation with you.
      </p>

      <h2>Quotations and fees</h2>
      <p>
        Each quotation sets out the documents and work included, the review process, the delivery schedule, payment terms
        and any separate charges such as printing, delivery, third-party costs and applicable taxes. Extra work outside the
        agreed scope needs your approval first.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide accurate, genuine documents and information, and tell us about addenda or clarifications you receive.</li>
        <li>Review and approve the final package before submission.</li>
        <li>Remain responsible for your bid, including its content, pricing, signatures and timely submission, unless a specific submission task is agreed in writing.</li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not guarantee eligibility, acceptance or award. The procuring entity evaluates and awards every tender.</li>
        <li>We do not invent experience, qualifications, certificates or other evidence.</li>
        <li>A sourcing match is a suggestion to assess, not a confirmation that you qualify.</li>
      </ul>

      <h2>Sourcing</h2>
      <p>
        Registering interest in sourcing is free and does not start a subscription. Any paid sourcing service will have its
        price, included briefs, coverage and terms confirmed with you before you are charged.
      </p>

      <h2>Confidentiality</h2>
      <p>
        We keep your documents confidential, separate from other clients’ information, and use them only for your
        assignment. See the <a href="/privacy">privacy notice</a> for details.
      </p>
    </article>
  );
}
