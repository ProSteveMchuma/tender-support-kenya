import { site, whatsappDisplay } from "@/config/site";
import { CTA, HERO } from "@/config/content";
import { isIndexable } from "@/lib/readiness";
import { pageMeta, siteUrl } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { GetStarted } from "@/components/GetStarted";
import { HeroArt } from "@/components/HeroArt";
import { Icon } from "@/components/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Faq, Founder, HowItWorks, Pricing, QualityProcess, SampleBriefSection, ServiceCards } from "@/components/sections";

export const metadata = pageMeta(
  "/",
  `${site.name} | Tender sourcing and bid preparation in Kenya`,
  "Expert-reviewed tender preparation for Kenyan businesses, from KSh 15,000 for a straightforward agreed scope. Find suitable tenders, arrange tender securities and prepare your bid.",
);

function StructuredData() {
  const base = siteUrl();
  if (!base || !isIndexable(site, process.env)) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalEntity ?? site.name,
    url: base,
    areaServed: { "@type": "Country", name: "Kenya" },
    description: site.shortDescription,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  const wa = whatsappDisplay();
  return (
    <>
      <StructuredData />
      <section className="hero">
        <div className="wrap hero-inner">
          <p className="eyebrow-pill">Tender support for Kenyan businesses</p>
          <h1>{HERO.heading}</h1>
          <p className="hero-lede">{HERO.body}</p>
          <div className="hero-actions">
            <CtaLink href="#quote-form" event="preparation_cta_clicked" location="hero">{CTA.primary}</CtaLink>
            <CtaLink href="#sourcing-form" variant="secondary" event="sourcing_interest_started" location="hero">{CTA.secondary}</CtaLink>
          </div>
          <p className="reassure"><Icon name="shield" size={18} /> {HERO.reassurance}</p>
          {wa && (
            <p className="hero-wa">
              <WhatsAppLink location="hero">
                <Icon name="chat" size={18} /> Or chat on WhatsApp
              </WhatsAppLink>
            </p>
          )}
        </div>
        <HeroArt />
      </section>
      <ServiceCards />
      <HowItWorks />
      <SampleBriefSection />
      <QualityProcess />
      <Pricing />
      <Founder />
      <Faq />
      <GetStarted />
    </>
  );
}
