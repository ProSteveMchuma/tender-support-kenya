import { site } from "@/config/site";
import { CTA, HERO } from "@/config/content";
import { isIndexable } from "@/lib/readiness";
import { pageMeta, siteUrl } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { HeroArt } from "@/components/HeroArt";
import { Icon } from "@/components/Icon";
import {
  Faq,
  Founder,
  HowItWorks,
  Pricing,
  QualityProcess,
  QuoteSection,
  SampleBriefSection,
  ServiceCards,
  SourcingSection,
} from "@/components/sections";

export const metadata = pageMeta(
  "/",
  `${site.name} | Tender sourcing and bid preparation in Kenya`,
  "Expert-reviewed tender preparation for Kenyan businesses, from KSh 15,000 for a straightforward agreed scope. Find suitable tenders, organise your evidence and prepare your bid.",
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
  return (
    <>
      <StructuredData />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="kicker">Tender support for Kenyan businesses</p>
            <h1>{HERO.heading}</h1>
            <p className="lede">{HERO.body}</p>
            <div className="hero-actions">
              <CtaLink href="/tender-preparation#quote-form" event="preparation_cta_clicked" location="hero" arrow>
                {CTA.primary}
              </CtaLink>
              <CtaLink href="/tender-sourcing#sourcing-form" variant="secondary" event="sourcing_interest_started" location="hero">
                {CTA.secondary}
              </CtaLink>
            </div>
            <p className="reassure">
              <Icon name="shield" size={20} /> {HERO.reassurance}
            </p>
          </div>
          <HeroArt />
        </div>
      </section>
      <ServiceCards />
      <HowItWorks />
      <SampleBriefSection />
      <QualityProcess />
      <Pricing />
      <Founder />
      <Faq />
      <QuoteSection />
      <SourcingSection />
    </>
  );
}
