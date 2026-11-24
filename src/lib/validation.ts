/**
 * Shared, dependency-free validation for both forms. The browser uses it for
 * inline errors; the API routes run it again and trust only their own result.
 */

export const QUOTE_SERVICES = [
  { value: "preparation", label: "Tender preparation" },
  { value: "review", label: "Review of a bid I have prepared" },
  { value: "security", label: "Tender or performance security" },
  { value: "printing", label: "Printing, binding and packaging" },
  { value: "submission", label: "Delivery or submission assistance" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export type QuoteService = (typeof QUOTE_SERVICES)[number]["value"];
export type ContactMethod = (typeof CONTACT_METHODS)[number]["value"];

export interface QuoteInput {
  service: QuoteService | "";
  companyName: string;
  contactName: string;
  contactMethod: ContactMethod | "";
  email: string;
  phone: string;
  tenderReference: string;
  deadline: string; // "YYYY-MM-DDTHH:mm" interpreted as East Africa Time
  description: string;
  lotsOrCopies: string;
  privacyAcknowledged: boolean;
}

export const PLAN_CHOICES = ["starter", "growth", "pro", "unsure"] as const;
export const BILLING_CHOICES = ["monthly", "annual"] as const;

export interface SourcingInput {
  plan: (typeof PLAN_CHOICES)[number] | "";
  billing: (typeof BILLING_CHOICES)[number] | "";
  companyName: string;
  contactName: string;
  email: string;
  categories: string;
  serviceArea: string;
  capabilities: string;
  updatesConsent: boolean;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

export const LIMITS = {
  name: 120,
  reference: 300,
  description: 2000,
  categories: 300,
  serviceArea: 200,
  capabilities: 1500,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(v: string): boolean {
  return v.length <= 254 && EMAIL_RE.test(v);
}

/** Accepts Kenyan local (07.., 01..) and international (+254..., or other +country) formats. */
export function normalisePhone(v: string): string | null {
  const cleaned = v.replace(/[\s()-]/g, "");
  if (/^0[17]\d{8}$/.test(cleaned)) return "+254" + cleaned.slice(1);
  if (/^254[17]\d{8}$/.test(cleaned)) return "+" + cleaned;
  if (/^\+\d{8,15}$/.test(cleaned)) return cleaned;
  return null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function tooLong(v: string, max: number) {
  return v.length > max ? `Please keep this under ${max} characters.` : undefined;
}

export function parseQuote(raw: Record<string, unknown>): { data: QuoteInput; errors: Errors<QuoteInput> } {
  const data: QuoteInput = {
    service: str(raw.service) as QuoteInput["service"],
    companyName: str(raw.companyName),
    contactName: str(raw.contactName),
    contactMethod: str(raw.contactMethod) as QuoteInput["contactMethod"],
    email: str(raw.email),
    phone: str(raw.phone),
    tenderReference: str(raw.tenderReference),
    deadline: str(raw.deadline),
    description: str(raw.description),
    lotsOrCopies: str(raw.lotsOrCopies),
    privacyAcknowledged: raw.privacyAcknowledged === true || raw.privacyAcknowledged === "on",
  };
  const e: Errors<QuoteInput> = {};

  if (!QUOTE_SERVICES.some((s) => s.value === data.service)) e.service = "Choose the service you need, or “Not sure yet”.";
  if (!data.companyName) e.companyName = "Enter your company or business name.";
  else e.companyName = tooLong(data.companyName, LIMITS.name);
  if (!data.contactName) e.contactName = "Enter the name of the person we should contact.";
  else e.contactName = tooLong(data.contactName, LIMITS.name);

  if (!CONTACT_METHODS.some((m) => m.value === data.contactMethod)) e.contactMethod = "Choose how you would like us to contact you.";

  const emailOk = data.email ? isValidEmail(data.email) : false;
  const phoneOk = data.phone ? normalisePhone(data.phone) !== null : false;
  if (data.email && !emailOk) e.email = "Enter a valid email address, for example name@company.co.ke.";
  if (data.phone && !phoneOk) e.phone = "Enter a valid phone number, for example 0712 345 678 or +254 712 345 678.";
  if (!data.email && !data.phone) {
    e.email = data.contactMethod === "email" ? "Enter your email address." : "Give an email address or a phone number so we can reply.";
    e.phone =
      data.contactMethod === "whatsapp" ? "Enter your WhatsApp number." :
      data.contactMethod === "phone" ? "Enter your phone number." : "Give a phone number or an email address so we can reply.";
  }
  if (!e.contactMethod && !e.email && !e.phone) {
    if (data.contactMethod === "email" && !emailOk) e.email = "You chose email. Please add your email address.";
    if ((data.contactMethod === "phone" || data.contactMethod === "whatsapp") && !phoneOk)
      e.phone = "You chose phone or WhatsApp. Please add your number.";
  }
  if (phoneOk) data.phone = normalisePhone(data.phone)!;

  e.tenderReference = tooLong(data.tenderReference, LIMITS.reference);
  if (data.deadline && !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(data.deadline)) e.deadline = "Enter the deadline as a date and time.";
  if (!data.description) e.description = "Briefly describe the tender and the help you need.";
  else if (data.description.length < 15) e.description = "Please add a little more detail (at least 15 characters).";
  else e.description = tooLong(data.description, LIMITS.description);
  if (data.lotsOrCopies && !/^\d{1,3}$/.test(data.lotsOrCopies)) e.lotsOrCopies = "Enter a number, or leave blank.";
  if (!data.privacyAcknowledged) e.privacyAcknowledged = "Please confirm you have read the privacy notice.";

  return { data, errors: clean(e) };
}

export function parseSourcing(raw: Record<string, unknown>): { data: SourcingInput; errors: Errors<SourcingInput> } {
  const data: SourcingInput = {
    plan: str(raw.plan) as SourcingInput["plan"],
    billing: str(raw.billing) as SourcingInput["billing"],
    companyName: str(raw.companyName),
    contactName: str(raw.contactName),
    email: str(raw.email),
    categories: str(raw.categories),
    serviceArea: str(raw.serviceArea),
    capabilities: str(raw.capabilities),
    updatesConsent: raw.updatesConsent === true || raw.updatesConsent === "on",
  };
  const e: Errors<SourcingInput> = {};
  if (data.plan && !PLAN_CHOICES.includes(data.plan)) e.plan = "Choose a plan, or “Not sure”.";
  if (data.billing && !BILLING_CHOICES.includes(data.billing)) e.billing = "Choose monthly or annual billing.";
  if (!data.plan || data.plan === "unsure") data.billing = "";
  if (!data.companyName) e.companyName = "Enter your company or business name.";
  else e.companyName = tooLong(data.companyName, LIMITS.name);
  if (!data.contactName) e.contactName = "Enter your name.";
  else e.contactName = tooLong(data.contactName, LIMITS.name);
  if (!data.email) e.email = "Enter the email address for opportunity updates.";
  else if (!isValidEmail(data.email)) e.email = "Enter a valid email address, for example name@company.co.ke.";
  if (!data.categories) e.categories = "List at least one thing your business supplies.";
  else e.categories = tooLong(data.categories, LIMITS.categories);
  if (!data.serviceArea) e.serviceArea = "Tell us which counties or areas you can serve.";
  else e.serviceArea = tooLong(data.serviceArea, LIMITS.serviceArea);
  if (!data.capabilities) e.capabilities = "Briefly describe what your business can deliver.";
  else e.capabilities = tooLong(data.capabilities, LIMITS.capabilities);
  // updatesConsent is optional and never pre-selected.
  return { data, errors: clean(e) };
}

function clean<T>(e: Errors<T>): Errors<T> {
  for (const k of Object.keys(e) as (keyof T)[]) if (!e[k]) delete e[k];
  return e;
}

export function hasErrors(e: object): boolean {
  return Object.keys(e).length > 0;
}

/** Converts a "YYYY-MM-DDTHH:mm" East Africa Time value to ISO UTC. */
export function eatToIso(local: string): string | null {
  if (!local) return null;
  const withTime = local.includes("T") ? local : `${local}T17:00`;
  const d = new Date(`${withTime}:00+03:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "landing_path", "referrer_host"] as const;
export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

export function cleanAttribution(raw: unknown): Attribution {
  const out: Attribution = {};
  if (!raw || typeof raw !== "object") return out;
  for (const k of ATTRIBUTION_KEYS) {
    const v = (raw as Record<string, unknown>)[k];
    if (typeof v === "string" && v.length <= 100 && !v.includes("@")) out[k] = v.replace(/[^\w\-./ ]/g, "");
  }
  return out;
}
