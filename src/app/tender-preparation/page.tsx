import { formatKsh, site } from "@/config/site";
import { CTA, FAQS } from "@/config/content";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { Icon } from "@/components/Icon";
import { Faq, HowItWorks, QualityProcess, QuoteSection, SectionHead, TaxLine } from "@/components/sections";

export const metadata = pageMeta(
  "/tender-preparation",
  "Tender preparation services in Kenya",
  "Get expert help preparing a tender in Kenya: requirements review, evidence organisation, prescribed forms and expert review. From KSh 15,000 for a straightforward agreed scope.",
);

const INCLUDED = [
  { icon: "search", title: "Requirements review", body: "We read the issued tender and addenda and list what is mandatory, what is scored and what is unclear." },
  { icon: "layers", title: "Evidence organisation", body: "We match each requirement to the documents you hold and show you what is missing before work goes further." },
  { icon: "document", title: "Prescribed forms", body: "We complete the forms the procuring entity prescribes, in the format it requires." },
  { icon: "calculator", title: "Proposal and schedules", body: "We prepare the agreed technical and financial sections and check the arithmetic in price schedules." },
  { icon: "check", title: "Compilation and expert review", body: "We compile the package in the required order and an expert reviews it before it goes to you for approval." },
];

const NEED = [
  "The official tender link or reference and the closing date",
  "Which lots you intend to bid for",
  "Your company documents and past-work evidence, once the scope is agreed",
  "A contact who can answer questions and approve the final package",
];

const AFFECTS = ["Tender requirements", "Technical complexity", "Number of lots", "Documents you already have", "Pricing support needed", "Time to the deadline", "Printed copies, if any"];

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">Tender preparation</p>
          <h1>Expert help preparing your tender, against the requirements as issued</h1>
          <p className="lede">
            Already found an opportunity? We help you review the requirements, organise your evidence, complete the
            prescribed forms and prepare a submission that is checked by an expert before you approve it.
          </p>
          <div className="hero-actions">
            <CtaLink href="#quote-form" event="preparation_cta_clicked" location="prep_hero" arrow>{CTA.primary}</CtaLink>
          </div>
          <p className="reassure"><Icon name="shield" size={20} /> From {formatKsh(site.pricing.preparationFrom)} for a straightforward, agreed scope.</p>
        </div>
      </section>

      <section className="band" aria-labelledby="included-h">
        <div className="wrap">
          <SectionHead id="included-h" title="What preparation can include" intro="Your quotation lists exactly which of these are in scope for your tender." />
          <div className="feature-grid">
            {INCLUDED.map((i) => (
              <div key={i.title} className="feature">
                <Icon name={i.icon} size={24} />
                <h3>{i.title}</h3>
                <p>{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="need-h">
        <div className="wrap split split-even">
          <div>
            <SectionHead id="need-h" title="What we will need from you" />
            <ul className="ticks">{NEED.map((n) => <li key={n}><Icon name="check" size={20} /> {n}</li>)}</ul>
            <p className="small muted">
              We do not invent experience, qualifications, certificates or supporting evidence. If something required is
              missing, we tell you early.
            </p>
          </div>
          <div className="price-card price-main">
            <h3>Fees</h3>
            <p className="price"><span className="from">from</span> {formatKsh(site.pricing.preparationFrom)}</p>
            <p>
              Tender preparation from {formatKsh(site.pricing.preparationFrom)} for a straightforward, agreed scope. Your
              final quotation depends on the tender’s requirements, complexity, number of lots, available documents and
              deadline.
            </p>
            <p className="small"><strong>What affects the quotation:</strong> {AFFECTS.join(", ").toLowerCase()}.</p>
            <p className="small muted"><TaxLine /> No completion time is promised until scope and capacity are checked.</p>
          </div>
        </div>
      </section>

      <HowItWorks withCta={false} />
      <QualityProcess />
      <Faq items={[FAQS[0], FAQS[2], FAQS[3], FAQS[4], FAQS[7]]} />
      <QuoteSection defaultService="preparation" />
    </>
  );
}
