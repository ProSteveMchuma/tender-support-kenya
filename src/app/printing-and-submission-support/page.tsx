import { CTA, faqs } from "@/config/content";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { GetStarted } from "@/components/GetStarted";
import { Faq, FeatureGrid, PageHero, SectionHead, TaxLine } from "@/components/sections";

export const metadata = pageMeta(
  "/printing-and-submission-support",
  "Tender printing, binding and submission support in Kenya",
  "Printing, binding and packaging for physical tender submissions in Kenya, matched to the tender’s instructions. Delivery or submission assistance is quoted separately where available.",
);

const ITEMS = [
  { icon: "print", title: "Printing", body: "Original and copies printed as the tender specifies, with colour where it matters." },
  { icon: "layers", title: "Binding and pagination", body: "Bound, paginated and tabbed in the order the instructions require." },
  { icon: "document", title: "Packaging and labelling", body: "Sealed and labelled envelopes or boxes, following the tender’s marking instructions." },
];

export default function Page() {
  const submission = site.services.submissionAssistance;
  return (
    <>
      <PageHero
        kicker="Printing and submission support"
        title="Physical bids, finished properly."
        intro="For physical submissions, request printing, binding and packaging to match the tender instructions. Delivery or submission assistance is scoped separately where available."
      >
        <CtaLink href="#quote-form" location="printing_hero">{CTA.printing}</CtaLink>
      </PageHero>
      <FeatureGrid id="print-items-h" title="What we can prepare." intro="Whether we prepared your documents or you did." items={ITEMS} />
      <section className="band band-surface" aria-labelledby="print-terms-h">
        <div className="wrap split-even">
          <div>
            <SectionHead id="print-terms-h" title="How it’s quoted." />
            <p>Priced by copies, pages, colour, binding and packaging. <TaxLine /></p>
            <p>Tell us the copies needed and the closing time. We confirm what is feasible before accepting.</p>
          </div>
          <div className="note-card">
            <h3 className="h4">Delivery and submission</h3>
            {submission === "unavailable" ? (
              <p>Delivery and submission assistance is not currently offered.</p>
            ) : (
              <p>Delivery or submission assistance can be agreed separately in writing where available. It must follow the tender’s instructions, and you remain responsible for your bid’s content and timing.</p>
            )}
          </div>
        </div>
      </section>
      <Faq items={faqs("Can you print and submit", "Can you handle an urgent")} />
      <GetStarted defaultService="printing" title="Request printing support" />
    </>
  );
}
