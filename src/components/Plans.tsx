"use client";
import { useMemo, useState } from "react";
import { annualPrice, formatKsh, site, type PlanId, type SourcingPlan } from "@/config/site";
import { PLAN_COPY } from "@/config/content";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

type Billing = "monthly" | "annual";

export const PLAN_EVENT = "tsk:choose-plan";
export const PLAN_KEY = "tsk_plan_choice";

function features(p: SourcingPlan): { text: string; strong?: boolean }[] {
  const f: { text: string; strong?: boolean }[] = [];
  if (p.id !== "starter") f.push({ text: `Everything in ${p.id === "growth" ? "Starter" : "Growth"}, plus:`, strong: true });
  f.push({ text: p.categories === null ? "No limit on categories or counties" : `Up to ${p.categories} categories` });
  if (p.id !== "pro") f.push({ text: p.alerts === "weekly-digest" ? "Weekly digest of matched tenders by WhatsApp or email" : "Alerts within 24 hours of publication" });
  if (p.id === "starter") f.push({ text: "A one-line fit note on every match" });
  if (p.briefsPerMonth) f.push({ text: `${p.briefsPerMonth} full requirements briefs a month` });
  if (p.bidCalendar) f.push({ text: "Monthly bid calendar" });
  if (p.complianceReminders) f.push({ text: "Expiry reminders for compliance documents" });
  if (p.preparationDiscountPct) f.push({ text: `${p.preparationDiscountPct}% off tender preparation` });
  if (p.priorityTurnaround) f.push({ text: "Priority turnaround on preparation" });
  return f;
}

function waLink(plan: PlanId) {
  const n = site.contact.whatsapp;
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(PLAN_COPY[plan].whatsapp)}`;
}

/** Suggests a plan from two simple answers. */
function suggest(cats: string, briefs: string): PlanId | null {
  if (!cats || !briefs) return null;
  if (cats === "many" || briefs === "many") return "pro";
  if (cats === "some" || briefs === "few") return "growth";
  return "starter";
}

export function Plans({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [cats, setCats] = useState("");
  const [briefs, setBriefs] = useState("");
  const pick = useMemo(() => suggest(cats, briefs), [cats, briefs]);
  const plans = site.sourcing.plans;
  const H = headingLevel;

  const choose = (plan: PlanId) => {
    try {
      sessionStorage.setItem(PLAN_KEY, JSON.stringify({ plan, billing }));
    } catch {}
    window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: { plan, billing } }));
    track("sourcing_interest_started", { location: `plan_${plan}` });
    if (location.hash !== "#sourcing-form") {
      location.hash = "sourcing-form";
    } else {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      document.getElementById("sourcing-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const seg = (name: string, value: string, set: (v: string) => void, opts: [string, string][]) => (
    <div className="segmented segmented-sm" role="radiogroup" aria-label={name}>
      {opts.map(([v, label]) => (
        <label key={v}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => set(v)} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="plans" id="plans">
      <div className="plans-controls">
        <div className="billing-switch" role="radiogroup" aria-label="Billing period">
          {(["monthly", "annual"] as Billing[]).map((b) => (
            <label key={b}>
              <input type="radio" name="billing" value={b} checked={billing === b} onChange={() => setBilling(b)} />
              <span>
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && <em>2 months free</em>}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="finder">
        <p className="finder-title"><Icon name="search" size={18} /> Not sure which plan? Answer two questions.</p>
        <div className="finder-grid">
          <div>
            <p className="finder-q" id="q-cats">How many kinds of goods or services do you supply?</p>
            {seg("Categories", cats, setCats, [["few", "1 to 3"], ["some", "4 to 8"], ["many", "More than 8"]])}
          </div>
          <div>
            <p className="finder-q" id="q-briefs">How many tenders do you want fully briefed each month?</p>
            {seg("Briefs a month", briefs, setBriefs, [["none", "None yet"], ["few", "Up to 4"], ["many", "5 or more"]])}
          </div>
        </div>
        <p className="finder-result" aria-live="polite">
          {pick ? (
            <>
              <strong>{plans.find((p) => p.id === pick)!.name}</strong> looks like the best fit. We’ve highlighted it below.
            </>
          ) : (
            "Your suggestion will appear here."
          )}
        </p>
      </div>

      <div className="plan-grid">
        {plans.map((p) => {
          const annual = billing === "annual";
          const price = annual ? annualPrice(p) : p.monthlyPrice;
          const wa = waLink(p.id);
          const highlighted = pick ? pick === p.id : !!p.recommended;
          return (
            <article
              key={p.id}
              className={`plan${p.recommended ? " plan-dark" : ""}${highlighted ? " plan-pick" : ""}`}
              aria-labelledby={`plan-${p.id}`}
            >
              <div className="plan-top">
                <H id={`plan-${p.id}`} className="plan-name">{p.name}</H>
                {p.recommended && <span className="plan-badge">Recommended</span>}
                {pick === p.id && !p.recommended && <span className="plan-badge plan-badge-pick">Your fit</span>}
              </div>
              <p className="plan-for">{PLAN_COPY[p.id].forWho}</p>
              <p className="plan-price" aria-live="polite">
                <span className="plan-amount" key={`${p.id}-${billing}`}>{formatKsh(price)}</span>
                <span className="plan-per">{annual ? "per year" : "per month"}</span>
              </p>
              <p className="plan-sub">
                {annual
                  ? `Works out at ${formatKsh(Math.round(price / 12))} a month. You save ${formatKsh(p.monthlyPrice * 2)}.`
                  : `Or ${formatKsh(annualPrice(p))} a year, with 2 months free.`}
              </p>
              <button type="button" className={`btn ${p.recommended ? "btn-light" : "btn-primary"} plan-cta`} onClick={() => choose(p.id)}>
                Choose {p.name}
              </button>
              {wa && (
                <a
                  className="plan-wa"
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_clicked", { location: `plan_${p.id}` })}
                >
                  <Icon name="chat" size={16} /> Ask about {p.name} on WhatsApp
                </a>
              )}
              <ul className="plan-features">
                {features(p).map((f) => (
                  <li key={f.text} className={f.strong ? "plan-feature-head" : undefined}>
                    {!f.strong && <Icon name="check" size={16} />}
                    {f.text}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <details className="compare">
        <summary>Compare every feature</summary>
        <div className="compare-scroll">
          <table>
            <caption className="sr-only">Sourcing plan comparison</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                {plans.map((p) => <th scope="col" key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly price", (p: SourcingPlan) => formatKsh(p.monthlyPrice)],
                ["Annual price (2 months free)", (p: SourcingPlan) => formatKsh(annualPrice(p))],
                ["Categories", (p: SourcingPlan) => (p.categories === null ? "No limit" : `Up to ${p.categories}`)],
                ["Counties", (p: SourcingPlan) => (p.categories === null ? "No limit" : "As agreed")],
                ["How you hear about matches", (p: SourcingPlan) => (p.alerts === "weekly-digest" ? "Weekly digest" : "Within 24 hours")],
                ["Fit note on each match", () => true],
                ["Full requirements briefs a month", (p: SourcingPlan) => (p.briefsPerMonth ? String(p.briefsPerMonth) : false)],
                ["Monthly bid calendar", (p: SourcingPlan) => p.bidCalendar],
                ["Compliance document reminders", (p: SourcingPlan) => p.complianceReminders],
                ["Discount on tender preparation", (p: SourcingPlan) => (p.preparationDiscountPct ? `${p.preparationDiscountPct}%` : false)],
                ["Priority turnaround", (p: SourcingPlan) => p.priorityTurnaround],
              ].map(([label, fn]) => (
                <tr key={label as string}>
                  <th scope="row">{label as string}</th>
                  {plans.map((p) => {
                    const v = (fn as (p: SourcingPlan) => string | boolean)(p);
                    return (
                      <td key={p.id}>
                        {v === true ? (
                          <span className="yes"><Icon name="check" size={18} /><span className="sr-only">Included</span></span>
                        ) : v === false ? (
                          <span className="no" aria-label="Not included">—</span>
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <ul className="plan-fine">
        <li>Choosing a plan doesn’t charge you. We confirm your categories and the areas we cover, then send an invoice. Nothing is paid on this website.</li>
        <li>Matches and briefs help you decide whether to bid. They do not confirm eligibility. Full evidence reviews and bid preparation are quoted separately.</li>
        <li>Alerts cover the official sources we monitor. Compliance reminders cover documents such as tax compliance, NCA and AGPO certificates that you share with us.</li>
        <li>Prices are in Kenya shillings. {site.pricing.taxStatement ?? "Any applicable taxes will be shown on your invoice."}</li>
      </ul>
    </div>
  );
}
