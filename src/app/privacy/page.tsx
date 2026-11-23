import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { LegalDraftNote } from "@/components/LegalDraftNote";

export const metadata = pageMeta("/privacy", "Privacy notice", `How ${site.name} collects, uses, stores and deletes information sent through this website.`);

export default function Page() {
  const who = site.legalEntity ?? site.name;
  const email = site.contact.email;
  return (
    <article className="legal wrap narrow">
      <h1>Privacy notice</h1>
      <LegalDraftNote reviewed={site.legal.privacyReviewedByOwner} />
      {site.legal.lastUpdated && <p className="muted">Last updated {site.legal.lastUpdated}</p>}

      <h2>Who we are</h2>
      <p>
        This website is operated by {who}, which provides tender sourcing, tender preparation and printing support in
        Kenya. We handle personal data in line with the Data Protection Act, 2019 of Kenya.
      </p>

      <h2>What we collect</h2>
      <p>We only ask for what we need to respond to your request.</p>
      <ul>
        <li><strong>Quote requests:</strong> the service you need, company and contact name, email address and/or phone number, preferred contact method, tender reference or link, deadline, a short description and the number of lots or copies.</li>
        <li><strong>Sourcing interest:</strong> company and contact name, email address, business categories, service area, a short description of capabilities and whether you want ongoing sourcing updates.</li>
        <li><strong>Technical information:</strong> your IP address is used briefly to limit repeated or automated submissions. We may record which page or campaign link brought you to the site, without your name or contact details.</li>
      </ul>
      <p>
        We do not ask for identity cards, bank statements, full accounts, signatures or staff CVs through this website. If
        an agreed assignment needs supporting documents, we will arrange a secure way to collect them.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To review your request, contact you and prepare a quotation.</li>
        <li>To deliver work you agree to, under a separate written scope.</li>
        <li>To send sourcing updates, only if you ticked the consent box. You can withdraw consent at any time, and every update will explain how.</li>
      </ul>
      <p>
        We use AI tools to assist internal preparation, with expert review before delivery. Your documents are kept
        separate from other clients’ information and are used only for your assignment.
      </p>

      <h2>Who can see it</h2>
      <p>
        Access is limited to the people handling your request. We use service providers to host this website and store
        inquiries; they process data on our instructions. We do not sell your information.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Inquiries that do not become assignments are deleted within 12 months of our last contact with you. Records of
        agreed assignments are kept for as long as needed for the work and for legal, tax and accounting obligations. You
        can ask us to delete your inquiry sooner.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete your personal data, object to its use, or withdraw consent for updates.
        {email ? <> Contact us at <a href={`mailto:${email}`}>{email}</a>.</> : " Contact details for privacy requests will be published here before launch."}{" "}
        You may also complain to the Office of the Data Protection Commissioner.
      </p>
    </article>
  );
}
