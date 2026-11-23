import Link from "next/link";
import { formatKsh, isPaidSourcingConfirmed, site } from "@/config/site";
import { AI_STATEMENT, CONFIDENTIALITY, CTA, FAQS, QUALITY_CONTROLS, SAMPLE_BRIEF, SERVICES, STEPS } from "@/config/content";
import { CtaLink } from "./CtaLink";
import { Icon } from "./Icon";
import { QuoteForm } from "./forms/QuoteForm";
import { SourcingForm } from "./forms/SourcingForm";
import type { QuoteService } from "@/lib/validation";

export function SectionHead({ id, kicker, title, intro }: { id?: string; kicker?: string; title: string; intro?: React.ReactNode }) {
  return (
    <div className="section-head">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 id={id}>{title}</h2>
      {intro && <p className="lede">{intro}</p>}
    </div>
  );
}

export function ServiceCards() {
  return (
    <section className="band" aria-labelledby="services-h">
      <div className="wrap">
        <SectionHead id="services-h" kicker="Services" title="Three ways we can help" intro="Use one service or combine them. Sourcing and preparation are separate, so you can bring a tender you found yourself." />
        <div className="cards">
          {SERVICES.map((s) => (
            <article key={s.id} className={`card card-${s.id}`}>
              <span className="card-icon"><Icon name={s.icon} size={26} /></span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="card-actions">
                <CtaLink
                  href={s.href}
                  variant={s.id === "preparation" ? "primary" : "secondary"}
                  event={s.id === "preparation" ? "preparation_cta_clicked" : s.id === "sourcing" ? "sourcing_interest_started" : undefined}
                  location={`service_card_${s.id}`}
                >
                  {s.cta}
                </CtaLink>
                <Link href={s.more} className="text-link">
                  Learn more<span className="sr-only"> about {s.title.toLowerCase()}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ withCta = true }: { withCta?: boolean }) {
  return (
    <section className="band band-tint" aria-labelledby="how-h">
      <div className="wrap">
        <SectionHead id="how-h" kicker="How it works" title="From tender link to approved package" intro="Every assignment follows the same four steps, so you know what happens next and what we need from you." />
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="fine">
          Receiving a quotation does not confirm that your business is eligible, and no one can guarantee acceptance or
          award. The procuring entity evaluates every bid.
        </p>
        {withCta && (
          <div className="center">
            <CtaLink href="/tender-preparation#quote-form" event="preparation_cta_clicked" location="how_it_works" arrow>
              {CTA.primary}
            </CtaLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function SampleBrief({ headingId = "brief-h", compact = false }: { headingId?: string; compact?: boolean }) {
  const b = SAMPLE_BRIEF;
  return (
    <figure className={`brief${compact ? " brief-compact" : ""}`} aria-labelledby={headingId}>
      <div className="brief-stamp">Illustrative requirements brief — sample only</div>
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
        Every row above is invented to show the format. The entity, reference and requirements are fictional. A real brief
        is based on the issued tender, notes the date it was checked, and marks anything still unknown.
      </p>
    </figure>
  );
}

export function SampleBriefSection() {
  return (
    <section className="band" aria-labelledby="brief-section-h">
      <div className="wrap split">
        <div>
          <SectionHead
            id="brief-section-h"
            kicker="See the format"
            title="A requirements brief you can act on"
            intro="Before anyone commits time to a bid, a brief sets out what the tender asks for, where it says so, what evidence would answer it and who does what next."
          />
          <ul className="ticks">
            <li><Icon name="link" size={20} /> Each requirement points back to the tender section it came from.</li>
            <li><Icon name="document" size={20} /> Evidence is named, so you can see gaps early.</li>
            <li><Icon name="info" size={20} /> Unknowns are marked as unknown, not guessed.</li>
          </ul>
          <p className="small muted">
            A sourcing brief is concise. A full clause-by-clause evidence review is part of a separately quoted preparation
            or review assignment.
          </p>
        </div>
        <SampleBrief />
      </div>
    </section>
  );
}

export function QualityProcess() {
  return (
    <section className="band band-navy" aria-labelledby="quality-h">
      <div className="wrap">
        <SectionHead id="quality-h" kicker="Quality and confidentiality" title="How we check the work" intro="These are the controls built into every preparation assignment. They reduce avoidable mistakes; they are not a certification or a promise of an error-free bid." />
        <ol className="controls">
          {QUALITY_CONTROLS.map((c) => (
            <li key={c.title}>
              <Icon name="check" size={20} />
              <div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="split split-even confid">
          <div>
            <h3 className="h4"><Icon name="lock" size={20} /> Your documents stay yours</h3>
            <ul>
              {CONFIDENTIALITY.map((c) => <li key={c}>{c}</li>)}
            </ul>
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
    <section className="band" id="pricing" aria-labelledby="pricing-h">
      <div className="wrap">
        <SectionHead id="pricing-h" kicker="Pricing" title="Know the likely starting fee" intro="Fees are agreed in writing before any preparation begins." />
        <div className="price-grid">
          <article className="price-card price-main">
            <h3>Tender preparation</h3>
            <p className="price">
              <span className="from">from</span> {formatKsh(site.pricing.preparationFrom)}
            </p>
            <p>
              Tender preparation from {formatKsh(site.pricing.preparationFrom)} for a straightforward, agreed scope. Your
              final quotation depends on the tender’s requirements, complexity, number of lots, available documents and
              deadline.
            </p>
            <p className="small muted"><TaxLine /> We never promise a completion time before the scope and our capacity are checked.</p>
            <CtaLink href="/tender-preparation#quote-form" event="preparation_cta_clicked" location="pricing">{CTA.primary}</CtaLink>
          </article>
          <article className="price-card">
            <h3>Tender sourcing</h3>
            {paid ? (
              <p className="price">
                {formatKsh(site.sourcing.paid.monthlyPrice!)} <span className="from">per month</span>
              </p>
            ) : (
              <p className="price price-text">Register your interest in tailored sourcing</p>
            )}
            <p>
              Matched opportunities and concise requirements briefs for your categories and service area.{" "}
              {!paid && "Paid sourcing is not open yet; registering interest is free and does not start a subscription."}
            </p>
            <CtaLink href="/tender-sourcing#sourcing-form" variant="secondary" event="sourcing_interest_started" location="pricing">{CTA.secondary}</CtaLink>
          </article>
          <article className="price-card">
            <h3>Printing and submission</h3>
            <p className="price price-text">Quoted separately</p>
            <p>Printing, binding and packaging are priced by copies, pages and finishing. Delivery or submission assistance is agreed separately where available.</p>
            <CtaLink href="/printing-and-submission-support#quote-form" variant="secondary" location="pricing">{CTA.printing}</CtaLink>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section className="band band-tint" aria-labelledby="founder-h">
      <div className="wrap founder">
        <div className="founder-mark" aria-hidden="true">SK</div>
        <div>
          <p className="kicker">Who you will work with</p>
          <h2 id="founder-h">{site.founderLine}</h2>
          <p className="lede">
            Your request is reviewed by a person who prepares tenders, not passed to an automated system. You get a clear
            scope, direct questions about the evidence you hold, and an expert review before anything is delivered.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items = FAQS }: { items?: typeof FAQS }) {
  return (
    <section className="band" aria-labelledby="faq-h">
      <div className="wrap narrow">
        <SectionHead id="faq-h" kicker="Questions" title="Frequently asked questions" />
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

export function QuoteSection({
  title = "Get a tender preparation quote",
  intro = "Tell us about the tender and the help you need. We will review the scope and reply with questions or a written quotation.",
  defaultService,
}: {
  title?: string;
  intro?: string;
  defaultService?: QuoteService;
}) {
  return (
    <section className="band band-form" id="quote-form" aria-labelledby="quote-form-h">
      <div className="wrap form-layout">
        <div className="form-aside">
          <h2 id="quote-form-h">{title}</h2>
          <p className="lede">{intro}</p>
          <ul className="ticks">
            <li><Icon name="check" size={20} /> No account needed</li>
            <li><Icon name="check" size={20} /> An official tender link is enough to start</li>
            <li><Icon name="check" size={20} /> Fees agreed before preparation begins</li>
          </ul>
        </div>
        <div className="form-card">
          <QuoteForm defaultService={defaultService} />
        </div>
      </div>
    </section>
  );
}

export function SourcingSection() {
  return (
    <section className="band band-form" id="sourcing-form" aria-labelledby="sourcing-form-h">
      <div className="wrap form-layout">
        <div className="form-aside">
          <h2 id="sourcing-form-h">Register your interest in tailored sourcing</h2>
          <p className="lede">
            Tell us what you supply and where you operate. We will contact you as sourcing opens, with details of what a
            subscription includes before you decide anything.
          </p>
          <ul className="ticks">
            <li><Icon name="check" size={20} /> Free to register, no payment</li>
            <li><Icon name="check" size={20} /> Updates only if you tick the consent box</li>
          </ul>
        </div>
        <div className="form-card">
          <SourcingForm />
        </div>
      </div>
    </section>
  );
}

export function PageHero({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}
