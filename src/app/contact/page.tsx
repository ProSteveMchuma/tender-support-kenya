import { site, whatsappLink } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { Icon } from "@/components/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { QuoteSection, SourcingSection } from "@/components/sections";

export const metadata = pageMeta(
  "/contact",
  "Contact us about tender support",
  "Request a tender preparation quote or register your interest in tender sourcing in Kenya. Share the official tender link and deadline to start.",
);

export default function Page() {
  const c = site.contact;
  const wa = whatsappLink();
  const hasDirect = !!(c.email || c.phone || wa);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">Contact</p>
          <h1>Tell us what you need</h1>
          <p className="lede">
            Use the quote form for help with a specific tender, or register interest in tailored sourcing. An official tender
            link and the deadline are enough to start.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#quote-form">Request a quote</a>
            <a className="btn btn-secondary" href="#sourcing-form">Register sourcing interest</a>
          </div>
          {hasDirect && (
            <ul className="contact-list">
              {c.email && <li><Icon name="mail" size={20} /> <a href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.phone && <li><Icon name="phone" size={20} /> <a href={`tel:${c.phone}`}>{c.phone}</a></li>}
              {wa && <li><Icon name="chat" size={20} /> <WhatsAppLink location="contact_page">Message us on WhatsApp</WhatsAppLink></li>}
              {c.hours && <li><Icon name="clock" size={20} /> {c.hours}</li>}
            </ul>
          )}
        </div>
      </section>
      <QuoteSection />
      <SourcingSection />
    </>
  );
}
