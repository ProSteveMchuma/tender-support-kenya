"use client";
import { useCallback, useRef, useState } from "react";
import { getAttribution } from "@/lib/analytics";
import type { Errors } from "@/lib/validation";

export type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "preview" }
  | { kind: "received"; reference: string }
  | { kind: "error"; message: string; retryable: boolean };

/**
 * Sends a lead to the server and reports only what the server confirms.
 * A request counts as received only when the API answers 201 with a reference.
 */
export function useLeadSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const inFlight = useRef(false);
  const startedAt = useRef(Date.now());

  const submit = useCallback(
    async (payload: Record<string, unknown>): Promise<{ serverErrors?: Record<string, string> }> => {
      if (inFlight.current) return {};
      inFlight.current = true;
      setState({ kind: "submitting" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...payload, startedAt: startedAt.current, attribution: getAttribution() }),
        });
        const body = await res.json().catch(() => null);
        if (res.status === 201 && body?.status === "received" && typeof body.reference === "string") {
          setState({ kind: "received", reference: body.reference });
        } else if (body?.status === "preview") {
          setState({ kind: "preview" });
        } else if (res.status === 422 && body?.errors) {
          setState({ kind: "idle" });
          return { serverErrors: body.errors };
        } else {
          setState({
            kind: "error",
            message: body?.message ?? "Something went wrong and your request was not saved. Please try again.",
            retryable: body?.retryable ?? true,
          });
        }
      } catch {
        setState({
          kind: "error",
          message: "We could not reach the server, so your request was not sent. Check your connection and try again.",
          retryable: true,
        });
      } finally {
        inFlight.current = false;
      }
      return {};
    },
    [endpoint],
  );

  return { state, setState, submit };
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {hint && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby for an input, joining hint and error ids. */
export function describedBy(id: string, hasHint: boolean, error?: string) {
  const ids = [hasHint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return ids || undefined;
}

export function ErrorSummary({
  errors,
  labels,
  prefix,
  summaryRef,
}: {
  errors: Record<string, string | undefined>;
  labels: Record<string, string>;
  prefix: string;
  summaryRef: React.RefObject<HTMLDivElement | null>;
}) {
  const keys = Object.keys(errors).filter((k) => errors[k]);
  if (!keys.length) return null;
  return (
    <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
      <p>
        <strong>Please check {keys.length === 1 ? "one field" : `${keys.length} fields`}:</strong>
      </p>
      <ul>
        {keys.map((k) => (
          <li key={k}>
            <a href={`#${prefix}-${k}`}>{labels[k] ?? k}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Honeypot({ prefix }: { prefix: string }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor={`${prefix}-website`}>Leave this field empty</label>
      <input id={`${prefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ResultPanel({
  state,
  onReset,
  receivedText,
}: {
  state: SubmitState;
  onReset: () => void;
  receivedText: string;
}) {
  if (state.kind === "preview") {
    return (
      <div className="result result-preview" role="status" tabIndex={-1}>
        <p className="result-title">Preview only — your request has not been sent.</p>
        <p>
          This website is in preview mode. Your details were checked in the browser and by the form handler, but they
          were not stored or delivered to anyone.
        </p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onReset}>
          Back to the form
        </button>
      </div>
    );
  }
  if (state.kind === "received") {
    return (
      <div className="result result-ok" role="status" tabIndex={-1}>
        <p className="result-title">Request received.</p>
        <p>
          Your reference is <strong className="ref">{state.reference}</strong>. {receivedText}
        </p>
      </div>
    );
  }
  return null;
}

export function SubmitError({ state }: { state: SubmitState }) {
  if (state.kind !== "error") return null;
  return (
    <div className="submit-error" role="alert">
      <p>{state.message}</p>
      {state.retryable && <p className="small">Your answers are still in the form, so you can submit again.</p>}
    </div>
  );
}

export function focusFirstError(form: HTMLFormElement | null, _summary?: HTMLDivElement | null) {
  // Wait for React to render the error summary, then move focus to it.
  setTimeout(() => {
    const target = form?.querySelector<HTMLElement>(".error-summary") ?? form?.querySelector<HTMLElement>("[aria-invalid='true']");
    target?.focus();
  }, 30);
}

export function StepHeader({
  step,
  total,
  title,
  headingRef,
}: {
  step: number;
  total: number;
  title: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div className="stepper">
      <div className="stepper-bar" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-done={i < step ? "1" : "0"} />
        ))}
      </div>
      <p className="stepper-count">
        Step {step} of {total}
      </p>
      <h3 className="stepper-title" tabIndex={-1} ref={headingRef}>
        {title}
      </h3>
    </div>
  );
}

/** Returns only the errors for the given field names. */
export function pick<T>(errors: Errors<T>, keys: (keyof T)[]): Errors<T> {
  const out: Errors<T> = {};
  for (const k of keys) if (errors[k]) out[k] = errors[k];
  return out;
}
