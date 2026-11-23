"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CTA } from "@/config/content";
import { track } from "@/lib/analytics";
import { QUOTE_SERVICES, hasErrors, parseQuote, type Errors, type QuoteInput, type QuoteService } from "@/lib/validation";
import { Icon } from "../Icon";
import {
  ErrorSummary,
  Field,
  Honeypot,
  ResultPanel,
  StepHeader,
  SubmitError,
  describedBy,
  focusFirstError,
  pick,
  useLeadSubmit,
} from "./shared";

const LABELS: Record<keyof QuoteInput, string> = {
  service: "What you need",
  companyName: "Company name",
  contactName: "Your name",
  contactMethod: "How to reach you",
  email: "Email address",
  phone: "Phone number",
  tenderReference: "Tender link or reference",
  deadline: "Submission deadline",
  description: "What you need help with",
  lotsOrCopies: "Lots or copies",
  privacyAcknowledged: "Privacy notice",
};

const SERVICE_DETAIL: Record<QuoteService, { icon: string; text: string }> = {
  preparation: { icon: "document", text: "Requirements, evidence, forms and expert review" },
  review: { icon: "check", text: "An expert check of a bid you have prepared" },
  security: { icon: "shield", text: "Arrange the bid bond or guarantee the tender requires" },
  printing: { icon: "print", text: "Print, bind and package a physical bid" },
  submission: { icon: "layers", text: "Help delivering a physical bid, where available" },
  unsure: { icon: "info", text: "Tell us about the tender and we will advise" },
};

const SHORT_LABEL: Record<QuoteService, string> = {
  preparation: "Tender preparation",
  review: "Review my bid",
  security: "Tender security",
  printing: "Printing and packaging",
  submission: "Delivery or submission",
  unsure: "Not sure yet",
};

const METHODS = [
  { value: "whatsapp", label: "WhatsApp", icon: "chat" },
  { value: "phone", label: "Phone call", icon: "phone" },
  { value: "email", label: "Email", icon: "mail" },
] as const;

const STEPS: { title: string; fields: (keyof QuoteInput)[] }[] = [
  { title: "What do you need help with?", fields: ["service"] },
  { title: "Tell us about the tender", fields: ["tenderReference", "deadline", "description", "lotsOrCopies"] },
  { title: "How should we reach you?", fields: ["contactName", "companyName", "contactMethod", "email", "phone", "privacyAcknowledged"] },
];

const EMPTY: QuoteInput = {
  service: "",
  companyName: "",
  contactName: "",
  contactMethod: "",
  email: "",
  phone: "",
  tenderReference: "",
  deadline: "",
  description: "",
  lotsOrCopies: "",
  privacyAcknowledged: false,
};

export function QuoteForm({ defaultService, idPrefix = "quote" }: { defaultService?: QuoteService; idPrefix?: string }) {
  const [values, setValues] = useState<QuoteInput>({ ...EMPTY, service: defaultService ?? "" });
  const [errors, setErrors] = useState<Errors<QuoteInput>>({});
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0);
  const { state, setState, submit } = useLeadSubmit("/api/quote");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const id = (k: keyof QuoteInput) => `${idPrefix}-${k}`;

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    if (s && QUOTE_SERVICES.some((o) => o.value === s)) setValues((v) => ({ ...v, service: s as QuoteService }));
  }, []);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (state.kind === "received") track("quote_request_received", { service: values.service || undefined });
    if (state.kind === "received" || state.kind === "preview") resultRef.current?.querySelector<HTMLElement>("[role=status]")?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.kind]);

  const stepErrors = (v: QuoteInput, s: number) => {
    const e = pick(parseQuote(v as unknown as Record<string, unknown>).errors, STEPS[s].fields);
    // Only report errors for the contact field that is actually on screen.
    if (!v.contactMethod || v.contactMethod === "email") delete e.phone;
    if (v.contactMethod !== "email") delete e.email;
    return e;
  };

  const set = <K extends keyof QuoteInput>(k: K, v: QuoteInput[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (checked) setErrors(stepErrors(next, step));
  };

  const go = (s: number) => {
    moved.current = true;
    setChecked(false);
    setErrors({});
    setStep(s);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    const errs = stepErrors(values, step);
    setChecked(true);
    setErrors(errs);
    if (hasErrors(errs)) return focusFirstError(formRef.current);
    if (step < STEPS.length - 1) return go(step + 1);

    const hp = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const { serverErrors } = await submit({ ...values, website: hp });
    if (serverErrors) {
      const first = STEPS.findIndex((s) => s.fields.some((f) => serverErrors[f as string]));
      const target = first === -1 ? step : first;
      moved.current = true;
      setStep(target);
      setChecked(true);
      setErrors(pick(serverErrors as Errors<QuoteInput>, STEPS[target].fields));
      focusFirstError(formRef.current);
    }
  }

  if (state.kind === "received" || state.kind === "preview") {
    return (
      <div ref={resultRef}>
        <ResultPanel
          state={state}
          onReset={() => setState({ kind: "idle" })}
          receivedText="We will review the scope and reply using your preferred contact method. A quotation is not confirmation of eligibility, and capacity is confirmed only when we accept the work in writing."
        />
      </div>
    );
  }

  const err = (k: keyof QuoteInput) => errors[k];
  const busy = state.kind === "submitting";
  const usesPhone = values.contactMethod === "whatsapp" || values.contactMethod === "phone";
  const last = step === STEPS.length - 1;
  const submitLabel = ["preparation", "review", "unsure", ""].includes(values.service) ? CTA.primary : "Send request";

  return (
    <form ref={formRef} className="lead-form" noValidate onSubmit={onSubmit} data-lead-form aria-busy={busy}>
      <StepHeader step={step + 1} total={STEPS.length} title={STEPS[step].title} headingRef={headingRef} />
      <ErrorSummary errors={errors} labels={LABELS} prefix={idPrefix} summaryRef={summaryRef} />

      {step === 0 && (
        <fieldset className="field">
          <legend className="sr-only">{LABELS.service}</legend>
          <div className="tiles">
            {QUOTE_SERVICES.map((s, i) => (
              <label key={s.value} className="tile">
                <input
                  type="radio"
                  name={`${idPrefix}-service`}
                  id={i === 0 ? id("service") : undefined}
                  value={s.value}
                  checked={values.service === s.value}
                  onChange={() => set("service", s.value)}
                  aria-invalid={!!err("service")}
                />
                <span className="tile-icon"><Icon name={SERVICE_DETAIL[s.value].icon} size={22} /></span>
                <span className="tile-text">
                  <span className="tile-title">{SHORT_LABEL[s.value]}</span>
                  <span className="tile-sub">{SERVICE_DETAIL[s.value].text}</span>
                </span>
              </label>
            ))}
          </div>
          {err("service") && <p className="error" id={`${id("service")}-error`}>{err("service")}</p>}
        </fieldset>
      )}

      {step === 1 && (
        <>
          <Field id={id("tenderReference")} label={LABELS.tenderReference} optional error={err("tenderReference")}
            hint="Paste the official link or the reference number. No documents needed yet.">
            <input id={id("tenderReference")} value={values.tenderReference} placeholder="https:// or tender number"
              onChange={(e) => set("tenderReference", e.target.value)} aria-invalid={!!err("tenderReference")}
              aria-describedby={describedBy(id("tenderReference"), true, err("tenderReference"))} maxLength={300} />
          </Field>
          <Field id={id("description")} label={LABELS.description} error={err("description")}
            hint="A sentence or two is enough. Please leave out bank details, ID numbers and passwords.">
            <textarea id={id("description")} rows={4} value={values.description}
              onChange={(e) => set("description", e.target.value)} aria-invalid={!!err("description")}
              aria-describedby={describedBy(id("description"), true, err("description"))} maxLength={2000} />
          </Field>
          <div className="grid-2">
            <Field id={id("deadline")} label={<>Deadline <span className="tz">East Africa Time (UTC+3)</span></>}
              optional error={err("deadline")}>
              <input id={id("deadline")} type="datetime-local" value={values.deadline}
                onChange={(e) => set("deadline", e.target.value)} aria-invalid={!!err("deadline")}
                aria-describedby={describedBy(id("deadline"), false, err("deadline"))} />
            </Field>
            <Field id={id("lotsOrCopies")} label={LABELS.lotsOrCopies} optional error={err("lotsOrCopies")}>
              <input id={id("lotsOrCopies")} inputMode="numeric" pattern="[0-9]*" value={values.lotsOrCopies}
                onChange={(e) => set("lotsOrCopies", e.target.value)} aria-invalid={!!err("lotsOrCopies")}
                aria-describedby={describedBy(id("lotsOrCopies"), false, err("lotsOrCopies"))} maxLength={3} />
            </Field>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid-2">
            <Field id={id("contactName")} label={LABELS.contactName} error={err("contactName")}>
              <input id={id("contactName")} autoComplete="name" value={values.contactName}
                onChange={(e) => set("contactName", e.target.value)} aria-invalid={!!err("contactName")}
                aria-describedby={describedBy(id("contactName"), false, err("contactName"))} maxLength={120} />
            </Field>
            <Field id={id("companyName")} label={LABELS.companyName} error={err("companyName")}>
              <input id={id("companyName")} autoComplete="organization" value={values.companyName}
                onChange={(e) => set("companyName", e.target.value)} aria-invalid={!!err("companyName")}
                aria-describedby={describedBy(id("companyName"), false, err("companyName"))} maxLength={120} />
            </Field>
          </div>

          <fieldset className="field">
            <legend>{LABELS.contactMethod}</legend>
            <div className="segmented">
              {METHODS.map((m, i) => (
                <label key={m.value}>
                  <input type="radio" name={`${idPrefix}-contactMethod`} id={i === 0 ? id("contactMethod") : undefined}
                    value={m.value} checked={values.contactMethod === m.value}
                    onChange={() => set("contactMethod", m.value)} aria-invalid={!!err("contactMethod")} />
                  <span><Icon name={m.icon} size={18} /> {m.label}</span>
                </label>
              ))}
            </div>
            {err("contactMethod") && <p className="error" id={`${id("contactMethod")}-error`}>{err("contactMethod")}</p>}
          </fieldset>

          {usesPhone && (
            <Field id={id("phone")} label={values.contactMethod === "whatsapp" ? "WhatsApp number" : LABELS.phone} error={err("phone")}>
              <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} placeholder="0712 345 678"
                onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err("phone")}
                aria-describedby={describedBy(id("phone"), false, err("phone"))} maxLength={20} />
            </Field>
          )}
          {values.contactMethod === "email" && (
            <Field id={id("email")} label={LABELS.email} error={err("email")}>
              <input id={id("email")} type="email" inputMode="email" autoComplete="email" value={values.email}
                placeholder="name@company.co.ke" onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")}
                aria-describedby={describedBy(id("email"), false, err("email"))} maxLength={254} />
            </Field>
          )}

          <div className={`field checkbox${err("privacyAcknowledged") ? " has-error" : ""}`}>
            <label className="check">
              <input type="checkbox" id={id("privacyAcknowledged")} checked={values.privacyAcknowledged}
                onChange={(e) => set("privacyAcknowledged", e.target.checked)} aria-invalid={!!err("privacyAcknowledged")}
                aria-describedby={err("privacyAcknowledged") ? `${id("privacyAcknowledged")}-error` : undefined} />
              <span>
                I have read the <Link href="/privacy">privacy notice</Link> and agree my details are used to handle this inquiry.
              </span>
            </label>
            {err("privacyAcknowledged") && <p className="error" id={`${id("privacyAcknowledged")}-error`}>{err("privacyAcknowledged")}</p>}
          </div>
          <Honeypot prefix={idPrefix} />
        </>
      )}

      <SubmitError state={state} />

      <div className="form-nav">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} disabled={busy}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Sending…" : last ? (state.kind === "error" ? "Try again" : submitLabel) : "Continue"}
        </button>
      </div>
      {last && (
        <p className="form-fine">
          {!site.uploads.enabled && "No documents needed now; if we agree a scope, we will arrange a secure way to collect them. "}
          A quotation does not confirm eligibility or guarantee award, and an inquiry does not reserve capacity.
        </p>
      )}
    </form>
  );
}
