import { site, whatsappDisplay } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { GetStarted } from "@/components/GetStarted";
import { Icon } from "@/components/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PageHero } from "@/components/sections";

export const metadata = pageMeta(
  "/contact",
  "Contact us about tender support",
  "Request a tender preparation quote, get help with a tender security or register interest in tender sourcing in Kenya. Chat on WhatsApp or send a short request.",
);

export default function Page() {
  const c = site.contact;
  const wa = whatsappDisplay();
  return (
    <>
      <PageHero kicker="Contact" title="Let’s talk about your tender." intro="Send a short request below, or message us directly. An official tender link and the deadline are enough to start." />
      {(wa || c.email || c.phone) && (
        <div className="wrap contact-cards">
          {wa && (
            <WhatsAppLink location="contact_page" className="contact-card">
              <span className="card-icon"><Icon name="chat" size={22} /></span>
              <span><strong>WhatsApp</strong><span className="muted">{wa}</span></span>
            </WhatsAppLink>
          )}
          {c.email && (
            <a className="contact-card" href={`mailto:${c.email}`}>
              <span className="card-icon"><Icon name="mail" size={22} /></span>
              <span><strong>Email</strong><span className="muted">{c.email}</span></span>
            </a>
          )}
          {c.phone && (
            <a className="contact-card" href={`tel:${c.phone}`}>
              <span className="card-icon"><Icon name="phone" size={22} /></span>
              <span><strong>Call</strong><span className="muted">{c.phone}</span></span>
            </a>
          )}
        </div>
      )}
      <p className="center-note">Please don’t send tender documents, ID numbers or bank details by WhatsApp at this stage.</p>
      <GetStarted title="Or send a request" />
    </>
  );
}
