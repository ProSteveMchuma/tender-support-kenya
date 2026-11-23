import { CTA, FAQS } from "@/config/content";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { Icon } from "@/components/Icon";
import { Faq, QuoteSection, SectionHead, TaxLine } from "@/components/sections";

export const metadata = pageMeta(
  "/printing-and-submission-support",
  "Tender printing, binding and submission support in Kenya",
  "Printing, binding and packaging for physical tender submissions in Kenya, matched to the tender’s instructions. Delivery or submission assistance is quoted separately where available.",
);

const ITEMS = [
  { icon: "print", title: "Printing", body: "Original and copies printed as the tender specifies, with colour where it matters." },
  { icon: "layers", title: "Binding and pagination", body: "Bound, paginated and tabbed in the order the instructions require." },
  { icon: "document", title: "Packaging and labelling", body: "Sealed and labelled envelopes or boxes following the tender’s marking instructions." },
];

export default function Page() {
  const submission = site.services.submissionAssistance;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">Printing and submission support</p>
          <h1>Printing, binding and packaging for physical bids</h1>
          <p className="lede">
            For physical submissions, request printing, binding and packaging to match the tender instructions. Delivery or
            submission assistance is scoped separately where available.
          </p>
          <div className="hero-actions">
            <CtaLink href="#quote-form" location="printing_hero" arrow>{CTA.printing}</CtaLink>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="print-items-h">
        <div className="wrap">
          <SectionHead id="print-items-h" title="What we can prepare" intro="Useful whether we prepared your documents or you did." />
          <div className="feature-grid feature-grid-3">
            {ITEMS.map((i) => (
              <div key={i.title} className="feature">
                <Icon name={i.icon} size={24} />
                <h3>{i.title}</h3>
                <p>{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="print-terms-h">
        <div className="wrap split split-even">
          <div>
            <SectionHead id="print-terms-h" title="How it is quoted" />
            <p>Printing is priced by number of copies, pages, colour, binding and packaging. <TaxLine /></p>
            <p>Tell us the number of copies and the closing date and time. We will confirm what is feasible before accepting.</p>
          </div>
          <div>
            <h3 className="h4">Delivery and submission</h3>
            {submission === "unavailable" ? (
              <p>Delivery and submission assistance is not currently offered.</p>
            ) : (
              <p>
                Delivery or submission assistance can be discussed and, where available, agreed separately in writing. It
                must follow the tender’s instructions, and you remain responsible for the content and timing of your
                bid.
              </p>
            )}
          </div>
        </div>
      </section>

      <Faq items={[FAQS[6], FAQS[7]]} />
      <QuoteSection
        title="Request printing support"
        intro="Choose printing, or submission assistance, and tell us the copies required and the closing time."
        defaultService="printing"
      />
    </>
  );
}
