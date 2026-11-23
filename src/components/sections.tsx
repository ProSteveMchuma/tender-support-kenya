import Link from "next/link";
import { formatKsh, isPaidSourcingConfirmed, site } from "@/config/site";
import { AI_STATEMENT, CONFIDENTIALITY, CTA, FAQS, QUALITY_CONTROLS, SAMPLE_BRIEF, SERVICES, STEPS } from "@/config/content";
import { CtaLink } from "./CtaLink";
import { Icon } from "./Icon";

export function SectionHead({
  id,
  kicker,
  title,
  intro,
  center = false,
}: {
  id?: string;
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`section-head${center ? " center-head" : ""}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 id={id}>{title}</h2>
      {intro && <p className="lede">{intro}</p>}
    </div>
  );
}

export function ServiceCards() {
  return (
    <section className="band" id="services" aria-labelledby="services-h">
      <div className="wrap">
        <SectionHead id="services-h" kicker="Services" title="Everything a bid needs." intro="Use one, or combine them. You can bring a tender you found yourself." center />
        <div className="cards">
          {SERVICES.map((s) => (
            <article key={s.id} className={`card${s.id === "preparation" ? " card-featured" : ""}`}>
              {s.id === "preparation" && <p className="card-flag">Most requested</p>}
              <span className="card-icon"><Icon name={s.icon} size={24} /></span>
              <h3><Link href={s.more} className="card-title-link">{s.title}</Link></h3>
              <p>{s.body}</p>
              <CtaLink
                href={s.id === "sourcing" ? "#sourcing-form" : s.id === "preparation" ? "#quote-form" : s.href}
                variant="link"
                event={s.id === "preparation" ? "preparation_cta_clicked" : s.id === "sourcing" ? "sourcing_interest_started" : undefined}
                location={`service_card_${s.id}`}
                arrow
              >
                {s.cta}
              </CtaLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="band band-surface" aria-labelledby="how-h">
      <div className="wrap">
        <SectionHead id="how-h" kicker="How it works" title="Four steps. No surprises." intro="You always know what happens next and what we need from you." center />
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <h3><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="fine">
          A quotation does not confirm eligibility, and no one can guarantee acceptance or award. The procuring entity
          evaluates every bid.
        </p>
      </div>
    </section>
  );
}

export function SampleBrief({ headingId = "brief-h" }: { headingId?: string }) {
  const b = SAMPLE_BRIEF;
  return (
    <figure className="brief" aria-labelledby={headingId}>
      <div className="brief-bar">
        <span className="brief-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="brief-stamp">Illustrative requirements brief — sample only</span>
      </div>
      <figcaption>
        <p className="brief-title" id={headingId}>{b.title}</p>
        <dl className="brief-meta">
          {b.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </figcaption>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">Illustrative sample rows. Not a real tender.</caption>
          <thead>
            <tr>
              <th scope="col">Requirement</th>
              <th scope="col">Source reference</th>
              <th scope="col">Evidence needed</th>
              <th scope="col">Next action</th>
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.requirement}>
                <td data-l="Requirement"><span><span className="tag">Sample</span> {r.requirement}</span></td>
                <td data-l="Source reference"><span>{r.source}</span></td>
                <td data-l="Evidence needed"><span>{r.evidence}</span></td>
                <td data-l="Next action"><span>{r.action}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="brief-foot">
        Every row is invented to show the format; the entity, reference and requirements are fictional. A real brief is
        based on the issued tender, notes when it was checked, and marks anything still unknown.
      </p>
    </figure>
  );
}

export function SampleBriefSection() {
  return (
    <section className="band" aria-labelledby="brief-section-h">
      <div className="wrap">
        <SectionHead
          id="brief-section-h"
          kicker="See the format"
          title="Know what a tender asks for, before you commit."
          intro="A requirements brief lists each requirement, where the tender says it, the evidence that answers it and the next action."
          center
        />
        <SampleBrief />
        <ul className="brief-points">
          <li><Icon name="link" size={20} /> Traced to the tender section</li>
          <li><Icon name="document" size={20} /> Evidence named early</li>
          <li><Icon name="info" size={20} /> Unknowns marked, not guessed</li>
        </ul>
        <p className="fine">A sourcing brief is concise. A full clause-by-clause evidence review is part of a separately quoted preparation or review assignment.</p>
      </div>
    </section>
  );
}

export function QualityProcess() {
  return (
    <section className="band band-navy" aria-labelledby="quality-h">
      <div className="wrap">
        <SectionHead id="quality-h" kicker="Quality and confidentiality" title="Checked by an expert. Approved by you." intro="The controls in every preparation assignment. They reduce avoidable mistakes; they are not a certification or a promise of an error-free bid." center />
        <ol className="controls">
          {QUALITY_CONTROLS.map((c) => (
            <li key={c.title}>
              <span className="control-tick"><Icon name="check" size={18} /></span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="assurances">
          <div>
            <h3 className="h4"><Icon name="lock" size={20} /> Your documents stay yours</h3>
            <ul>{CONFIDENTIALITY.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div>
            <h3 className="h4"><Icon name="user" size={20} /> How we use AI</h3>
            <p>{AI_STATEMENT}</p>
            <p>AI does not decide whether you qualify, and we do not produce instant automated bids.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TaxLine() {
  return (
    <>
      {site.pricing.taxStatement ??
        "Printing, delivery, third-party charges and any applicable taxes will be set out clearly in your quotation."}
    </>
  );
}

export function Pricing() {
  const paid = isPaidSourcingConfirmed();
  return (
    <section className="band band-surface" id="pricing" aria-labelledby="pricing-h">
      <div className="wrap">
        <SectionHead id="pricing-h" kicker="Pricing" title="Simple, agreed upfront." center />
        <div className="price-hero">
          <p className="price-label">Tender preparation</p>
          <p className="price-big"><span>from</span> {formatKsh(site.pricing.preparationFrom)}</p>
          <p className="price-copy">
            Tender preparation from {formatKsh(site.pricing.preparationFrom)} for a straightforward, agreed scope. Your final
            quotation depends on the tender’s requirements, complexity, number of lots, available documents and deadline.
          </p>
          <CtaLink href="#quote-form" event="preparation_cta_clicked" location="pricing">{CTA.primary}</CtaLink>
          <p className="fine"><TaxLine /> We never promise a completion time before the scope and our capacity are checked.</p>
        </div>
        <div className="price-side">
          <div>
            <h3>Tender sourcing</h3>
            <p>
              {paid
                ? `${formatKsh(site.sourcing.paid.monthlyPrice!)} per month.`
                : "Register your interest in tailored sourcing. Not open for payment yet; registering is free."}
            </p>
            <CtaLink href="#sourcing-form" variant="link" event="sourcing_interest_started" location="pricing" arrow>{CTA.secondary}</CtaLink>
          </div>
          <div>
            <h3>Printing and submission</h3>
            <p>Quoted separately, by copies, pages and finishing. Delivery or submission help is agreed separately where available.</p>
            <CtaLink href="/printing-and-submission-support#quote-form" variant="link" location="pricing" arrow>{CTA.printing}</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section className="band" aria-labelledby="founder-h">
      <div className="wrap founder">
        <div className="founder-mark" aria-hidden="true">SK</div>
        <h2 id="founder-h">{site.founderLine}</h2>
        <p className="lede">
          Your request is read by a person who prepares tenders, not an automated system. You get a clear scope, direct
          questions about your evidence, and an expert review before anything is delivered.
        </p>
      </div>
    </section>
  );
}

export function Faq({ items = FAQS }: { items?: typeof FAQS }) {
  return (
    <section className="band band-surface" aria-labelledby="faq-h">
      <div className="wrap narrow">
        <SectionHead id="faq-h" kicker="Questions" title="Good questions." center />
        <div className="faq">
          {items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PageHero({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="wrap center-head">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}

export function FeatureGrid({ id, title, intro, items }: { id: string; title: string; intro?: string; items: { icon: string; title: string; body: string }[] }) {
  return (
    <section className="band" aria-labelledby={id}>
      <div className="wrap">
        <SectionHead id={id} title={title} intro={intro} center />
        <div className="feature-grid">
          {items.map((i) => (
            <div key={i.title} className="feature">
              <span className="card-icon"><Icon name={i.icon} size={22} /></span>
              <h3>{i.title}</h3>
              <p>{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
