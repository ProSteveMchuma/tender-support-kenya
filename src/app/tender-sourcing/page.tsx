import { CTA, faqs } from "@/config/content";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { GetStarted } from "@/components/GetStarted";
import { Faq, FeatureGrid, PageHero, SampleBrief, SectionHead } from "@/components/sections";

export const metadata = pageMeta(
  "/tender-sourcing",
  "Tender sourcing for Kenyan businesses",
  "Register your interest in tailored tender sourcing in Kenya: opportunities matched to your categories and service area, with concise requirements briefs.",
);

const HOW = [
  { icon: "user", title: "Profile your business", body: "Your categories, the counties you serve and what you can deliver. No confidential documents needed." },
  { icon: "search", title: "Match opportunities", body: "Notices from official sources are checked against your profile. A match is worth a look, not confirmed eligibility." },
  { icon: "document", title: "Get a concise brief", body: "Title, reference, buyer, official link, closing time in East Africa Time, submission method and key requirements." },
  { icon: "clock", title: "Track changes", body: "Relevant addenda and changes to opportunities already shared with you are flagged." },
];

export default function Page() {
  return (
    <>
      <PageHero
        kicker="Tender sourcing"
        title="Tenders that fit what you actually supply."
        intro="Tell us what your business supplies and where you operate. Register your interest in tailored tender sourcing and concise requirements briefs, so you can assess opportunities before committing to a bid."
      >
        <CtaLink href="#sourcing-form" event="sourcing_interest_started" location="sourcing_hero">{CTA.secondary}</CtaLink>
      </PageHero>
      <p className="center-note">Paid sourcing is not open yet. Registering interest is free and does not start a subscription.</p>
      <FeatureGrid id="sourcing-how-h" title="How tailored sourcing works." items={HOW} />
      <section className="band band-surface" aria-labelledby="brief-vs-h">
        <div className="wrap">
          <SectionHead
            id="brief-vs-h"
            title="A brief, not a full audit."
            intro="A sourcing brief tells you what an opportunity is, how it closes and its critical requirements. A clause-by-clause evidence review, forms and price schedules are part of a separately quoted preparation assignment."
            center
          />
          <SampleBrief headingId="sourcing-brief-h" />
        </div>
      </section>
      <Faq items={faqs("Do I need to subscribe", "Can you help with a tender I found", "Do you use AI")} />
      <GetStarted defaultTab="sourcing" title="Register your interest in tailored sourcing" intro="Two short steps. Free, no payment, and updates only if you ask for them." />
    </>
  );
}
