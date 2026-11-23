"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CTA } from "@/config/content";
import { track } from "@/lib/analytics";
import {
  CONTACT_METHODS,
  QUOTE_SERVICES,
  hasErrors,
  parseQuote,
  type Errors,
  type QuoteInput,
  type QuoteService,
} from "@/lib/validation";
import { ErrorSummary, Field, Honeypot, ResultPanel, SubmitError, describedBy, focusFirstError, useLeadSubmit } from "./shared";

const LABELS: Record<keyof QuoteInput, string> = {
  service: "Service requested",
  companyName: "Company name",
  contactName: "Contact name",
  contactMethod: "Preferred contact method",
  email: "Email address",
  phone: "Phone number",
  tenderReference: "Tender reference or official link",
  deadline: "Submission deadline",
  description: "What you need help with",
  lotsOrCopies: "Number of lots or copies",
  privacyAcknowledged: "Privacy notice",
};

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
  const [touched, setTouched] = useState(false);
  const { state, setState, submit } = useLeadSubmit("/api/quote");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const id = (k: keyof QuoteInput) => `${idPrefix}-${k}`;

  // Allow links such as /contact?service=printing#quote-form to preselect a service.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    if (s && QUOTE_SERVICES.some((o) => o.value === s)) setValues((v) => ({ ...v, service: s as QuoteService }));
  }, []);

  useEffect(() => {
    if (state.kind === "received") track("quote_request_received", { service: values.service || undefined });
    if (state.kind === "received" || state.kind === "preview") resultRef.current?.querySelector<HTMLElement>("[role=status]")?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.kind]);

  const set = <K extends keyof QuoteInput>(k: K, v: QuoteInput[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched) setErrors(parseQuote(next as unknown as Record<string, unknown>).errors);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setTouched(true);
    const hp = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const { errors: errs } = parseQuote(values as unknown as Record<string, unknown>);
    setErrors(errs);
    if (hasErrors(errs)) return focusFirstError(formRef.current, summaryRef.current);
    const { serverErrors } = await submit({ ...values, website: hp });
    if (serverErrors) {
      setErrors(serverErrors as Errors<QuoteInput>);
      focusFirstError(formRef.current, summaryRef.current);
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

  return (
    <form ref={formRef} className="lead-form" noValidate onSubmit={onSubmit} data-lead-form aria-busy={busy}>
      <ErrorSummary errors={errors} labels={LABELS} prefix={idPrefix} summaryRef={summaryRef} />

      <fieldset className="field" aria-describedby={err("service") ? `${id("service")}-error` : undefined}>
        <legend>{LABELS.service}</legend>
        <div className="choice-grid">
          {QUOTE_SERVICES.map((s, i) => (
            <label key={s.value} className="choice">
              <input
                type="radio"
                name={`${idPrefix}-service`}
                id={i === 0 ? id("service") : undefined}
                value={s.value}
                checked={values.service === s.value}
                onChange={() => set("service", s.value)}
                aria-invalid={!!err("service")}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        {err("service") && <p className="error" id={`${id("service")}-error`}>{err("service")}</p>}
      </fieldset>

      <div className="grid-2">
        <Field id={id("companyName")} label={LABELS.companyName} error={err("companyName")}>
          <input id={id("companyName")} autoComplete="organization" value={values.companyName}
            onChange={(e) => set("companyName", e.target.value)} aria-invalid={!!err("companyName")}
            aria-describedby={describedBy(id("companyName"), false, err("companyName"))} maxLength={120} />
        </Field>
        <Field id={id("contactName")} label={LABELS.contactName} error={err("contactName")}>
          <input id={id("contactName")} autoComplete="name" value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)} aria-invalid={!!err("contactName")}
            aria-describedby={describedBy(id("contactName"), false, err("contactName"))} maxLength={120} />
        </Field>
      </div>

      <fieldset className="field">
        <legend>{LABELS.contactMethod}</legend>
        <p className="hint" id={`${id("contactMethod")}-hint`}>
          Give at least one way to reach you: an email address or a phone number. Both are not required.
        </p>
        <div className="choice-row">
          {CONTACT_METHODS.map((m, i) => (
            <label key={m.value} className="choice">
              <input type="radio" name={`${idPrefix}-contactMethod`} id={i === 0 ? id("contactMethod") : undefined}
                value={m.value} checked={values.contactMethod === m.value}
                onChange={() => set("contactMethod", m.value)} aria-invalid={!!err("contactMethod")} />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
        {err("contactMethod") && <p className="error" id={`${id("contactMethod")}-error`}>{err("contactMethod")}</p>}
      </fieldset>

      <div className="grid-2">
        <Field id={id("email")} label={LABELS.email} error={err("email")} optional={values.contactMethod !== "email"}>
          <input id={id("email")} type="email" inputMode="email" autoComplete="email" value={values.email}
            onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")}
            aria-describedby={describedBy(id("email"), false, err("email"))} maxLength={254} />
        </Field>
        <Field id={id("phone")} label={LABELS.phone} error={err("phone")}
          optional={values.contactMethod !== "phone" && values.contactMethod !== "whatsapp"}>
          <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} placeholder="07XX XXX XXX"
            onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err("phone")}
            aria-describedby={describedBy(id("phone"), false, err("phone"))} maxLength={20} />
        </Field>
      </div>

      <Field id={id("tenderReference")} label={LABELS.tenderReference} optional error={err("tenderReference")}
        hint="Paste the official tender link or the reference number from the tender document. Do not send documents yet.">
        <input id={id("tenderReference")} value={values.tenderReference}
          onChange={(e) => set("tenderReference", e.target.value)} aria-invalid={!!err("tenderReference")}
          aria-describedby={describedBy(id("tenderReference"), true, err("tenderReference"))} maxLength={300} />
      </Field>

      <div className="grid-2">
        <Field id={id("deadline")} label={<>Submission deadline <span className="tz">East Africa Time (UTC+3)</span></>}
          optional error={err("deadline")} hint="If known. Use the closing date and time from the tender.">
          <input id={id("deadline")} type="datetime-local" value={values.deadline}
            onChange={(e) => set("deadline", e.target.value)} aria-invalid={!!err("deadline")}
            aria-describedby={describedBy(id("deadline"), true, err("deadline"))} />
        </Field>
        <Field id={id("lotsOrCopies")} label={LABELS.lotsOrCopies} optional error={err("lotsOrCopies")}
          hint="Lots you are bidding for, or printed copies required.">
          <input id={id("lotsOrCopies")} inputMode="numeric" pattern="[0-9]*" value={values.lotsOrCopies}
            onChange={(e) => set("lotsOrCopies", e.target.value)} aria-invalid={!!err("lotsOrCopies")}
            aria-describedby={describedBy(id("lotsOrCopies"), true, err("lotsOrCopies"))} maxLength={3} />
        </Field>
      </div>

      <Field id={id("description")} label={LABELS.description} error={err("description")}
        hint="A short description of the tender and the support you need. Please leave out bank details, ID numbers and passwords.">
        <textarea id={id("description")} rows={5} value={values.description}
          onChange={(e) => set("description", e.target.value)} aria-invalid={!!err("description")}
          aria-describedby={describedBy(id("description"), true, err("description"))} maxLength={2000} />
      </Field>

      {!site.uploads.enabled && (
        <p className="note">
          You do not need to send tender documents or company records now. If we agree a scope, we will arrange a secure
          way to collect what is needed.
        </p>
      )}

      <div className={`field checkbox${err("privacyAcknowledged") ? " has-error" : ""}`}>
        <label className="choice">
          <input type="checkbox" id={id("privacyAcknowledged")} checked={values.privacyAcknowledged}
            onChange={(e) => set("privacyAcknowledged", e.target.checked)} aria-invalid={!!err("privacyAcknowledged")}
            aria-describedby={err("privacyAcknowledged") ? `${id("privacyAcknowledged")}-error` : undefined} />
          <span>
            I have read the <Link href="/privacy">privacy notice</Link> and agree that my details are used to handle this
            inquiry.
          </span>
        </label>
        {err("privacyAcknowledged") && <p className="error" id={`${id("privacyAcknowledged")}-error`}>{err("privacyAcknowledged")}</p>}
      </div>

      <Honeypot prefix={idPrefix} />
      <SubmitError state={state} />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Sending…" : state.kind === "error" ? "Try again" : CTA.primary}
        </button>
        <p className="small muted">
          A quotation does not confirm eligibility or guarantee award. Submitting an inquiry does not reserve capacity.
        </p>
      </div>
    </form>
  );
}
