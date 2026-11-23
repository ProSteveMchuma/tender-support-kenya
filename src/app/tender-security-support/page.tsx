import { CTA, faqs } from "@/config/content";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { CtaLink } from "@/components/CtaLink";
import { GetStarted } from "@/components/GetStarted";
import { Icon } from "@/components/Icon";
import { Faq, FeatureGrid, PageHero, SectionHead } from "@/components/sections";

export const metadata = pageMeta(
  "/tender-security-support",
  "Tender security and bid bond support in Kenya",
  "Help arranging the tender security a Kenyan tender requires: understand the form, amount and validity, prepare the application for your chosen bank or insurer, and check the issued security before you submit.",
);

const STEPS = [
  { icon: "search", title: "Read the requirement", body: "We confirm what the tender asks for: whether a security or a Tender Securing Declaration is required, the form, amount or percentage, validity period and acceptable issuers." },
  { icon: "document", title: "Prepare the application", body: "We help you complete the issuer’s request using the tender’s prescribed security form, so the wording the procuring entity expects is what gets issued." },
  { icon: "chat", title: "Deal with your issuer for you", body: "With your written authority, we handle the back-and-forth with the bank, insurer or other institution you choose, so questions are answered quickly and nothing waits in a queue." },
  { icon: "check", title: "Check before you submit", body: "We check the issued document against the tender: name, reference, amount, validity, beneficiary and format, and flag anything that needs correcting while there is still time." },
];

const AFTER = [
  { title: "Performance security", body: "If you are awarded the contract, the procuring entity may ask for a performance security within a set period. We help you arrange it in the required form." },
  { title: "Advance payment guarantee", body: "Where a contract offers an advance payment against a guarantee, we help prepare the request and check the guarantee wording." },
  { title: "Extensions and amendments", body: "If the tender validity is extended, the security may need extending too. We help you request the amendment from your issuer in time." },
];

export default function Page() {
  if (site.services.securities === "unavailable") return null;
  return (
    <>
      <PageHero
        kicker="Tender security support"
        title="The right security, in the right form, on time."
        intro="Many tenders need a bid bond, bank guarantee or insurance guarantee in a prescribed form. We deal with the issuer you choose on your behalf, and check the security matches the tender before you submit."
      >
        <CtaLink href="#quote-form" location="security_hero" arrow>{CTA.security}</CtaLink>
      </PageHero>

      <FeatureGrid id="security-how-h" title="How we help." items={STEPS} />

      <section className="band band-surface" aria-labelledby="security-clear-h">
        <div className="wrap split-even">
          <div>
            <SectionHead id="security-clear-h" title="What we do, and what we don’t." />
            <ul className="ticks">
              <li><Icon name="check" size={20} /> Explain the security requirement in plain language</li>
              <li><Icon name="check" size={20} /> Prepare the application and the prescribed form wording</li>
              <li><Icon name="check" size={20} /> Deal with your chosen bank or insurer on your behalf, with your written authority</li>
              <li><Icon name="check" size={20} /> Check the issued security against the tender</li>
            </ul>
          </div>
          <div className="note-card">
            <h3 className="h4"><Icon name="info" size={20} /> Good to know</h3>
            <ul>
              <li>Securities are issued by banks, insurance companies or other institutions the tender permits. We do not issue, guarantee or finance them; the issuer decides on its own terms and may ask for collateral or cash cover.</li>
              <li>Issuer fees, commissions and any collateral are between you and the issuer, and paid by you directly. Our support is quoted separately, with any applicable taxes set out in the quotation.</li>
              <li>Processing times vary by issuer, so start as early as possible. We will tell you honestly if the deadline looks too close.</li>
              <li>Some tenders ask for a Tender Securing Declaration, a signed undertaking, instead of a security. Whether one applies depends on the tender’s own instructions; we check, and help you complete it in the prescribed form.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="after-award-h">
        <div className="wrap">
          <SectionHead id="after-award-h" kicker="After award" title="Securities don’t stop at submission." center />
          <div className="feature-grid feature-grid-3">
            {AFTER.map((a) => (
              <div key={a.title} className="feature">
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={faqs("Can you provide the tender security", "Can you handle an urgent")} />
      <GetStarted defaultService="security" title="Get help with a tender security" intro="Share the tender link and the closing time. If you already bank with an issuer you would like to use, mention it in your description." />
    </>
  );
}
