import { CTA, FAQS } from "@/config/content";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { Icon } from "@/components/Icon";
import { Faq, SampleBrief, SectionHead, SourcingSection } from "@/components/sections";

export const metadata = pageMeta(
  "/tender-sourcing",
  "Tender sourcing for Kenyan businesses",
  "Register your interest in tailored tender sourcing in Kenya: opportunities matched to your categories and service area, with concise requirements briefs.",
);

const HOW = [
  { icon: "user", title: "Profile your business", body: "Your categories, the counties you can serve and what you can deliver. No confidential document pack is needed to register." },
  { icon: "search", title: "Match opportunities", body: "Notices from official sources are checked against your profile. A match means worth a look, not confirmed eligibility." },
  { icon: "document", title: "Send a concise brief", body: "Title, reference, buyer, official link, closing time in East Africa Time, submission method and key requirements, with unknowns marked." },
  { icon: "clock", title: "Track changes", body: "Relevant addenda and changes to opportunities already shared with you are flagged." },
];

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">Tender sourcing</p>
          <h1>Find tenders that suit what your business actually supplies</h1>
          <p className="lede">
            Tell us what your business supplies and where you operate. Register your interest in tailored tender sourcing
            and concise requirements briefs, so you can assess opportunities before committing to a bid.
          </p>
          <div className="hero-actions">
            <CtaLink href="#sourcing-form" event="sourcing_interest_started" location="sourcing_hero" arrow>{CTA.secondary}</CtaLink>
          </div>
          <p className="reassure"><Icon name="info" size={20} /> Paid sourcing is not open yet. Registering interest is free and does not start a subscription.</p>
        </div>
      </section>

      <section className="band" aria-labelledby="sourcing-how-h">
        <div className="wrap">
          <SectionHead id="sourcing-how-h" title="How tailored sourcing is designed to work" />
          <div className="feature-grid">
            {HOW.map((i) => (
              <div key={i.title} className="feature">
                <Icon name={i.icon} size={24} />
                <h3>{i.title}</h3>
                <p>{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-tint" aria-labelledby="brief-vs-h">
        <div className="wrap split">
          <div>
            <SectionHead id="brief-vs-h" title="A brief is not a full evidence audit" />
            <p>
              A sourcing brief tells you what an opportunity is, when and how it closes, and the critical requirements
              visible in the source, so you can decide whether to pursue it.
            </p>
            <p>
              A clause-by-clause evidence review, technical response, prescribed-form completion and price-schedule checking
              are part of a separately quoted preparation or review assignment.
            </p>
            <p>
              Sourcing and preparation are independent. You can prepare bids yourself, or{" "}
              <a href="/tender-preparation">request preparation support</a> for any tender, including one you found
              elsewhere.
            </p>
          </div>
          <SampleBrief headingId="sourcing-brief-h" compact />
        </div>
      </section>

      <Faq items={[FAQS[1], FAQS[0], FAQS[5]]} />
      <SourcingSection />
    </>
  );
}
