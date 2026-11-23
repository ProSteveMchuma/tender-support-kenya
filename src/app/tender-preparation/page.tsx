import { formatKsh, site } from "@/config/site";
import { CTA, faqs } from "@/config/content";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { GetStarted } from "@/components/GetStarted";
import { Icon } from "@/components/Icon";
import { Faq, FeatureGrid, HowItWorks, PageHero, QualityProcess, SectionHead, TaxLine } from "@/components/sections";

export const metadata = pageMeta(
  "/tender-preparation",
  "Tender preparation services in Kenya",
  "Get expert help preparing a tender in Kenya: requirements review, evidence organisation, prescribed forms and expert review. From KSh 15,000 for a straightforward agreed scope.",
);

const INCLUDED = [
  { icon: "search", title: "Requirements review", body: "We read the issued tender and addenda and list what is mandatory, what is scored and what is unclear." },
  { icon: "layers", title: "Evidence organisation", body: "We match each requirement to the documents you hold and show you what is missing early." },
  { icon: "document", title: "Prescribed forms", body: "We complete the forms the procuring entity prescribes, in the format it requires." },
  { icon: "calculator", title: "Proposal and schedules", body: "We prepare the agreed sections and check the arithmetic in price schedules." },
  { icon: "check", title: "Expert review", body: "We compile the package in order and an expert reviews it before it comes to you for approval." },
];

const NEED = [
  "The official tender link or reference and the closing date",
  "Which lots you intend to bid for",
  "Your company documents and past-work evidence, once the scope is agreed",
  "Someone who can answer questions and approve the final package",
];

export default function Page() {
  return (
    <>
      <PageHero
        kicker="Tender preparation"
        title="Your bid, prepared against the tender as issued."
        intro="Already found an opportunity? We help you review the requirements, organise your evidence, complete the prescribed forms and prepare a submission that an expert checks before you approve it."
      >
        <CtaLink href="#quote-form" event="preparation_cta_clicked" location="prep_hero">{CTA.primary}</CtaLink>
      </PageHero>
      <FeatureGrid id="included-h" title="What preparation can include." intro="Your quotation lists exactly which of these are in scope." items={INCLUDED} />
      <section className="band band-surface" aria-labelledby="need-h">
        <div className="wrap split-even">
          <div>
            <SectionHead id="need-h" title="What we’ll need from you." />
            <ul className="ticks">{NEED.map((n) => <li key={n}><Icon name="check" size={20} /> {n}</li>)}</ul>
            <p className="fine-left">We never invent experience, qualifications, certificates or evidence. If something is missing, we tell you early.</p>
          </div>
          <div className="price-hero price-hero-sm">
            <p className="price-label">Fees</p>
            <p className="price-big"><span>from</span> {formatKsh(site.pricing.preparationFrom)}</p>
            <p className="price-copy">
              Tender preparation from {formatKsh(site.pricing.preparationFrom)} for a straightforward, agreed scope. Your final
              quotation depends on the tender’s requirements, complexity, number of lots, available documents and deadline.
            </p>
            <p className="fine"><TaxLine /> No completion time is promised until scope and capacity are checked.</p>
          </div>
        </div>
      </section>
      <HowItWorks />
      <QualityProcess />
      <Faq items={faqs("Can you help with a tender I found", "What does the preparation fee", "Do you guarantee", "What if some documents", "Can you handle an urgent")} />
      <GetStarted defaultService="preparation" title="Get a tender preparation quote" />
    </>
  );
}
