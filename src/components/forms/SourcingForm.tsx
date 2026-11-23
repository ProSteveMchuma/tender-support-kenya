"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { hasErrors, parseSourcing, type Errors, type SourcingInput } from "@/lib/validation";
import { ErrorSummary, Field, Honeypot, ResultPanel, SubmitError, describedBy, focusFirstError, useLeadSubmit } from "./shared";

const LABELS: Record<keyof SourcingInput, string> = {
  companyName: "Company name",
  contactName: "Your name",
  email: "Email for opportunity updates",
  categories: "What your business supplies",
  serviceArea: "Counties or areas you serve",
  capabilities: "Your capabilities",
  updatesConsent: "Updates consent",
};

const EMPTY: SourcingInput = {
  companyName: "",
  contactName: "",
  email: "",
  categories: "",
  serviceArea: "",
  capabilities: "",
  updatesConsent: false,
};

export function SourcingForm({ idPrefix = "sourcing" }: { idPrefix?: string }) {
  const [values, setValues] = useState<SourcingInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<SourcingInput>>({});
  const [touched, setTouched] = useState(false);
  const started = useRef(false);
  const { state, setState, submit } = useLeadSubmit("/api/sourcing-interest");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const id = (k: keyof SourcingInput) => `${idPrefix}-${k}`;

  useEffect(() => {
    if (state.kind === "received") track("sourcing_interest_received");
    if (state.kind === "received" || state.kind === "preview") resultRef.current?.querySelector<HTMLElement>("[role=status]")?.focus();
  }, [state.kind]);

  const set = <K extends keyof SourcingInput>(k: K, v: SourcingInput[K]) => {
    if (!started.current) {
      started.current = true;
      track("sourcing_interest_started", { location: "form" });
    }
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched) setErrors(parseSourcing(next as unknown as Record<string, unknown>).errors);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setTouched(true);
    const hp = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const { errors: errs } = parseSourcing(values as unknown as Record<string, unknown>);
    setErrors(errs);
    if (hasErrors(errs)) return focusFirstError(formRef.current, summaryRef.current);
    const { serverErrors } = await submit({ ...values, website: hp });
    if (serverErrors) {
      setErrors(serverErrors as Errors<SourcingInput>);
      focusFirstError(formRef.current, summaryRef.current);
    }
  }

  if (state.kind === "received" || state.kind === "preview") {
    return (
      <div ref={resultRef}>
        <ResultPanel
          state={state}
          onReset={() => setState({ kind: "idle" })}
          receivedText="Thank you for registering interest. This has not started a subscription and you have not been charged. We will contact you before any paid service begins."
        />
      </div>
    );
  }

  const err = (k: keyof SourcingInput) => errors[k];
  const busy = state.kind === "submitting";
  const text = (k: Exclude<keyof SourcingInput, "updatesConsent">, opts: { auto?: string; hint?: string; area?: boolean; max: number; type?: string }) => (
    <Field id={id(k)} label={LABELS[k]} error={err(k)} hint={opts.hint}>
      {opts.area ? (
        <textarea id={id(k)} rows={4} value={values[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)}
          aria-describedby={describedBy(id(k), !!opts.hint, err(k))} maxLength={opts.max} />
      ) : (
        <input id={id(k)} type={opts.type ?? "text"} autoComplete={opts.auto} value={values[k]}
          onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)}
          aria-describedby={describedBy(id(k), !!opts.hint, err(k))} maxLength={opts.max} />
      )}
    </Field>
  );

  return (
    <form ref={formRef} className="lead-form" noValidate onSubmit={onSubmit} data-lead-form aria-busy={busy}>
      <ErrorSummary errors={errors} labels={LABELS} prefix={idPrefix} summaryRef={summaryRef} />
      <p className="note note-strong">
        Registering interest does not start or charge for a subscription. Paid sourcing is not open yet.
      </p>

      <div className="grid-2">
        {text("companyName", { auto: "organization", max: 120 })}
        {text("contactName", { auto: "name", max: 120 })}
      </div>
      {text("email", { auto: "email", type: "email", max: 254 })}
      {text("categories", { max: 300, hint: "For example: office furniture, ICT equipment, cleaning services, road works." })}
      {text("serviceArea", { max: 200, hint: "For example: Nairobi and Kiambu, or nationwide." })}
      {text("capabilities", {
        area: true,
        max: 1500,
        hint: "A short description of what you can deliver and at what scale. Please do not send certificates, accounts or CVs.",
      })}

      <div className="field checkbox">
        <label className="choice">
          <input type="checkbox" id={id("updatesConsent")} checked={values.updatesConsent}
            onChange={(e) => set("updatesConsent", e.target.checked)} />
          <span>
            Optional: send me ongoing tender-sourcing updates by email. I can withdraw this consent at any time.
          </span>
        </label>
        <p className="hint">
          Leave this unticked if you only want us to contact you about this registration. See the{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>
      </div>

      <Honeypot prefix={idPrefix} />
      <SubmitError state={state} />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Sending…" : state.kind === "error" ? "Try again" : "Register interest"}
        </button>
      </div>
    </form>
  );
}
