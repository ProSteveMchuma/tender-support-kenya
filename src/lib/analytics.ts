"use client";
/**
 * Privacy-conscious analytics. Events never carry names, emails, phone numbers,
 * tender references or document content: only an allow-listed set of props.
 *
 * Provider: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to send events to Plausible
 * (cookieless). With nothing configured, events are only dispatched as a
 * browser CustomEvent ("tsk:analytics") and logged in development.
 */
import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/validation";

export type AnalyticsEvent =
  | "preparation_cta_clicked"
  | "sourcing_interest_started"
  | "quote_request_received"
  | "sourcing_interest_received"
  | "whatsapp_clicked";

type Props = { location?: string; service?: string } & Attribution;
const ALLOWED = new Set<string>(["location", "service", ...ATTRIBUTION_KEYS]);

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const safe: Record<string, string> = {};
  for (const [k, v] of Object.entries({ ...getAttribution(), ...props })) {
    if (ALLOWED.has(k) && typeof v === "string" && v && !v.includes("@")) safe[k] = v.slice(0, 100);
  }
  window.dispatchEvent(new CustomEvent("tsk:analytics", { detail: { event, props: safe } }));
  window.plausible?.(event, { props: safe });
  if (process.env.NODE_ENV === "development") console.info("[analytics]", event, safe);
}

const KEY = "tsk_attribution";

/** Captures UTM parameters and landing context once per browser session. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const a: Attribution = { landing_path: window.location.pathname };
    for (const k of ATTRIBUTION_KEYS) {
      const v = params.get(k);
      if (v && k.startsWith("utm_")) a[k] = v.slice(0, 100);
    }
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname;
        if (host !== window.location.hostname) a.referrer_host = host;
      } catch {}
    }
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
