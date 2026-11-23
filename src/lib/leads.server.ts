import "server-only";
import { randomBytes } from "node:crypto";
import { site } from "@/config/site";
import { hasLeadDestination } from "@/lib/readiness";
import { cleanAttribution, eatToIso, hasErrors, parseQuote, parseSourcing, type Attribution } from "@/lib/validation";

export type LeadKind = "quote" | "sourcing";

type ApiResult =
  | { status: "received"; reference: string }
  | { status: "preview"; message: string }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "error"; message: string; retryable: boolean };

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2_500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/* ---------- Rate limiting (per instance; see README for multi-instance) ---------- */
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function newReference(kind: LeadKind): string {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `TSK-${kind === "quote" ? "Q" : "S"}-${ymd}-${rand}`;
}

/** Structured operator log. Never include names, emails, phones or free text. */
function opsLog(event: string, fields: Record<string, unknown>) {
  console.log(JSON.stringify({ at: new Date().toISOString(), event, ...fields }));
}

async function deliverToDestination(record: Record<string, unknown>): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL!;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-lead-secret": process.env.LEAD_WEBHOOK_SECRET! },
      body: JSON.stringify(record),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      opsLog("lead_delivery_failed", { reference: record.reference, httpStatus: res.status });
      return false;
    }
    // The destination must explicitly confirm it stored the lead.
    const body = (await res.json().catch(() => null)) as { ok?: boolean; reference?: string } | null;
    const confirmed = body?.ok === true && body.reference === record.reference;
    if (!confirmed) opsLog("lead_delivery_unconfirmed", { reference: record.reference });
    return confirmed;
  } catch (err) {
    opsLog("lead_delivery_failed", { reference: record.reference, error: (err as Error).name });
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Best-effort staff notification. Failure is logged; the saved lead is kept. */
async function notifyStaff(kind: LeadKind, reference: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) {
    opsLog("lead_notification_skipped", { reference, reason: "not_configured" });
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `New ${kind === "quote" ? "tender-support quote request" : "sourcing interest"} ${reference}`,
        text: `A new ${kind} lead was saved with reference ${reference}. Open the lead tracker to review it.`,
      }),
    });
    if (!res.ok) opsLog("lead_notification_failed", { reference, httpStatus: res.status });
  } catch (err) {
    opsLog("lead_notification_failed", { reference, error: (err as Error).name });
  }
}

export async function handleLead(kind: LeadKind, req: Request): Promise<Response> {
  const json = (r: ApiResult, status: number) => Response.json(r, { status, headers: { "cache-control": "no-store" } });

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ status: "error", message: "Your request is too large.", retryable: false }, 413);

  let raw: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) throw new Error("too_large");
    raw = JSON.parse(text);
    if (!raw || typeof raw !== "object") throw new Error("not_object");
  } catch {
    return json({ status: "error", message: "We could not read your request. Please try again.", retryable: true }, 400);
  }

  // Spam controls: honeypot, minimum fill time, rate limit.
  if (typeof raw.website === "string" && raw.website !== "") {
    opsLog("lead_spam_blocked", { kind, reason: "honeypot" });
    return json({ status: "error", message: "We could not accept this request.", retryable: false }, 400);
  }
  const started = Number(raw.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS || Date.now() - started > 24 * 3600 * 1000) {
    opsLog("lead_spam_blocked", { kind, reason: "too_fast" });
    return json({ status: "error", message: "Please wait a moment and submit again.", retryable: true }, 429);
  }
  if (rateLimited(`${kind}:${clientIp(req)}`)) {
    opsLog("lead_rate_limited", { kind });
    return json({ status: "error", message: "Too many requests from this connection. Please try again in a few minutes.", retryable: true }, 429);
  }

  const parsed = kind === "quote" ? parseQuote(raw) : parseSourcing(raw);
  if (hasErrors(parsed.errors)) return json({ status: "invalid", errors: parsed.errors as Record<string, string> }, 422);

  if (!hasLeadDestination(process.env)) {
    if (site.productionMode) {
      opsLog("lead_destination_missing", { kind });
      return json({ status: "error", message: "Our form is temporarily unavailable. Please try again later.", retryable: true }, 503);
    }
    return json({ status: "preview", message: "Preview only — your request has not been sent." }, 200);
  }

  const reference = newReference(kind);
  const attribution: Attribution = cleanAttribution(raw.attribution);
  const record: Record<string, unknown> = {
    reference,
    kind,
    receivedAt: new Date().toISOString(),
    ...parsed.data,
    ...(kind === "quote" ? { deadlineUtc: eatToIso((parsed.data as { deadline: string }).deadline), deadlineTimezone: "EAT (UTC+3)" } : {}),
    attribution,
  };

  const saved = await deliverToDestination(record);
  if (!saved) {
    return json(
      { status: "error", message: "We could not save your request just now. Nothing was lost on your side: please try again in a minute.", retryable: true },
      502,
    );
  }
  opsLog(kind === "quote" ? "quote_request_received" : "sourcing_interest_received", { reference, attribution });
  await notifyStaff(kind, reference);
  return json({ status: "received", reference }, 201);
}
