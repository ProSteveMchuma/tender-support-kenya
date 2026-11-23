"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { hasErrors, parseSourcing, type Errors, type SourcingInput } from "@/lib/validation";
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

const LABELS: Record<keyof SourcingInput, string> = {
  companyName: "Company name",
  contactName: "Your name",
  email: "Email for opportunity updates",
  categories: "What you supply",
  serviceArea: "Where you can deliver",
  capabilities: "What you can deliver",
  updatesConsent: "Updates consent",
};

const STEPS: { title: string; fields: (keyof SourcingInput)[] }[] = [
  { title: "Tell us about your business", fields: ["companyName", "categories", "serviceArea", "capabilities"] },
  { title: "Where should we reach you?", fields: ["contactName", "email", "updatesConsent"] },
];

const EMPTY: SourcingInput = {
  companyName: "",
  contactName: "",
  email: "",
  categories: "",
  serviceArea: "",
  capabilities: "",
  updatesConsent: false,
};

type TextKey = Exclude<keyof SourcingInput, "updatesConsent">;

export function SourcingForm({ idPrefix = "sourcing" }: { idPrefix?: string }) {
  const [values, setValues] = useState<SourcingInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<SourcingInput>>({});
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0);
  const started = useRef(false);
  const moved = useRef(false);
  const { state, setState, submit } = useLeadSubmit("/api/sourcing-interest");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const id = (k: keyof SourcingInput) => `${idPrefix}-${k}`;

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (state.kind === "received") track("sourcing_interest_received");
    if (state.kind === "received" || state.kind === "preview") resultRef.current?.querySelector<HTMLElement>("[role=status]")?.focus();
  }, [state.kind]);

  const stepErrors = (v: SourcingInput, s: number) =>
    pick(parseSourcing(v as unknown as Record<string, unknown>).errors, STEPS[s].fields);

  const set = <K extends keyof SourcingInput>(k: K, v: SourcingInput[K]) => {
    if (!started.current) {
      started.current = true;
      track("sourcing_interest_started", { location: "form" });
    }
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
      setErrors(pick(serverErrors as Errors<SourcingInput>, STEPS[target].fields));
      focusFirstError(formRef.current);
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
  const last = step === STEPS.length - 1;

  const text = (k: TextKey, o: { auto?: string; hint?: string; area?: boolean; max: number; type?: string; placeholder?: string }) => (
    <Field id={id(k)} label={LABELS[k]} error={err(k)} hint={o.hint}>
      {o.area ? (
        <textarea id={id(k)} rows={3} value={values[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)}
          aria-describedby={describedBy(id(k), !!o.hint, err(k))} maxLength={o.max} placeholder={o.placeholder} />
      ) : (
        <input id={id(k)} type={o.type ?? "text"} autoComplete={o.auto} value={values[k]} placeholder={o.placeholder}
          onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)}
          aria-describedby={describedBy(id(k), !!o.hint, err(k))} maxLength={o.max} />
      )}
    </Field>
  );

  return (
    <form ref={formRef} className="lead-form" noValidate onSubmit={onSubmit} data-lead-form aria-busy={busy}>
      <StepHeader step={step + 1} total={STEPS.length} title={STEPS[step].title} headingRef={headingRef} />
      <ErrorSummary errors={errors} labels={LABELS} prefix={idPrefix} summaryRef={summaryRef} />

      {step === 0 && (
        <>
          {text("companyName", { auto: "organization", max: 120 })}
          {text("categories", { max: 300, placeholder: "e.g. office furniture, ICT equipment, cleaning" })}
          {text("serviceArea", { max: 200, placeholder: "e.g. Nairobi and Kiambu, or nationwide" })}
          {text("capabilities", {
            area: true,
            max: 1500,
            hint: "A short description of what you can deliver and at what scale. No certificates or CVs needed.",
          })}
        </>
      )}

      {step === 1 && (
        <>
          {text("contactName", { auto: "name", max: 120 })}
          {text("email", { auto: "email", type: "email", max: 254, placeholder: "name@company.co.ke" })}
          <div className="field checkbox">
            <label className="check">
              <input type="checkbox" id={id("updatesConsent")} checked={values.updatesConsent}
                onChange={(e) => set("updatesConsent", e.target.checked)} />
              <span>Send me tender-sourcing updates by email. I can withdraw this at any time. (Optional)</span>
            </label>
          </div>
          <p className="form-fine">
            Registering interest is free. It does not start a subscription or charge you. See the{" "}
            <Link href="/privacy">privacy notice</Link>.
          </p>
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
          {busy ? "Sending…" : last ? (state.kind === "error" ? "Try again" : "Register interest") : "Continue"}
        </button>
      </div>
    </form>
  );
}
