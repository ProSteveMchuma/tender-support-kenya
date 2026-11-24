/**
 * Single source of truth for business identity, contact details, pricing,
 * service availability and publication state.
 *
 * Rules:
 * - Leave a value as `null` until the owner confirms it. Unconfigured contact
 *   methods are hidden automatically; nothing is invented.
 * - This file is bundled into browser code. Never put private fee ranges,
 *   workload figures, budgets or secrets here. Secrets belong in server-only
 *   environment variables (see README).
 * - `productionMode` stays false until `npm run readiness` passes.
 */

export type SourcingMode = "interest" | "paid";

export type PlanId = "starter" | "growth" | "pro";

export interface SourcingPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  /** Max categories matched; null = no set limit on categories (not on analysis). */
  categories: number | null;
  briefsPerMonth: number;
  alerts: "weekly-digest" | "within-24h";
  preparationDiscountPct: number;
  complianceReminders: boolean;
  bidCalendar: boolean;
  priorityTurnaround: boolean;
  recommended?: boolean;
}

export type Availability = "available" | "on-request" | "unavailable";

export interface SiteConfig {
  /** Trading name confirmed by the owner. Legal entity is separate (see legalEntity). */
  name: string;
  nameIsConfirmed: boolean;
  shortDescription: string;
  founderLine: string;
  legalEntity: string | null;
  logoPath: string | null;
  /** Bare domain, e.g. "example.co.ke". Canonicals and sitemap need it. */
  domain: string | null;
  contact: {
    email: string | null;
    /** E.164 without spaces, e.g. "+2547XXXXXXXX". */
    phone: string | null;
    /** Digits only with country code, e.g. "2547XXXXXXXX". Used for click-to-chat. */
    whatsapp: string | null;
    /** Second WhatsApp number held in reserve; not shown on the site. */
    whatsappAlternate: string | null;
    registeredAddress: string | null;
    /** e.g. "Monday to Friday, 8 am to 5 pm EAT". */
    hours: string | null;
  };
  pricing: {
    currency: "KSh";
    /** Public entry point for a straightforward, agreed preparation scope. */
    preparationFrom: number;
    /**
     * How tax is presented. `null` means the owner has not confirmed tax
     * treatment, so the site only says taxes will be clarified in the quotation.
     */
    taxStatement: string | null;
  };
  services: {
    preparation: Availability;
    review: Availability;
    /** Facilitating tender/bid securities and post-award securities with the client's chosen issuer. */
    securities: Availability;
    printing: Availability;
    submissionAssistance: Availability;
  };
  sourcing: {
    /**
     * "interest": prices hidden, interest registration only.
     * "paid": published plans with sign-up by request. Nothing is paid online;
     * the owner confirms scope and sends an invoice.
     */
    mode: SourcingMode;
    plans: SourcingPlan[];
    /** Annual billing = this many months charged for 12 months of service. */
    annualMonthsCharged: number;
    /** Sources/areas monitored, as the owner describes them. null until confirmed. */
    coverage: string | null;
    /** Owner confirms the team can deliver every plan's promises (alerts, briefs, reminders). */
    fulfilmentConfirmed: boolean;
    /** Owner confirms subscription terms: billing, renewal, cancellation, refunds. */
    commercialTermsConfirmed: boolean;
  };
  uploads: {
    /** Upload controls only show when this is true AND private storage is configured server-side. */
    enabled: boolean;
    maxFileMb: number;
    acceptedTypes: { ext: string; mime: string }[];
  };
  legal: {
    privacyReviewedByOwner: boolean;
    termsReviewedByOwner: boolean;
    lastUpdated: string | null;
  };
  /** Owner has confirmed every service shown as available is genuinely offered. */
  serviceAvailabilityConfirmed: boolean;
  /** false = preview: noindex, preview notice, demo-safe forms. */
  productionMode: boolean;
}

export const site: SiteConfig = {
  name: "TenderPro",
  nameIsConfirmed: true,
  shortDescription:
    "Tender sourcing, expert-reviewed tender preparation and optional printing support for Kenyan businesses.",
  founderLine: "Led by Steve Kaleke, tender preparation specialist.",
  legalEntity: null,
  logoPath: null,
  domain: null,
  contact: {
    email: null,
    phone: null,
    whatsapp: "254719584549",
    whatsappAlternate: "254715947213",
    registeredAddress: null,
    hours: null,
  },
  pricing: {
    currency: "KSh",
    preparationFrom: 15000,
    taxStatement: null,
  },
  services: {
    preparation: "available",
    review: "available",
    securities: "available",
    printing: "available",
    submissionAssistance: "on-request",
  },
  sourcing: {
    mode: "paid",
    // Prices and inclusions approved by the owner on 24 Nov 2026.
    plans: [
      { id: "starter", name: "Starter", monthlyPrice: 2500, categories: 3, briefsPerMonth: 0, alerts: "weekly-digest", preparationDiscountPct: 0, complianceReminders: false, bidCalendar: false, priorityTurnaround: false },
      { id: "growth", name: "Growth", monthlyPrice: 6500, categories: 8, briefsPerMonth: 4, alerts: "within-24h", preparationDiscountPct: 10, complianceReminders: false, bidCalendar: false, priorityTurnaround: false, recommended: true },
      { id: "pro", name: "Pro", monthlyPrice: 15000, categories: null, briefsPerMonth: 12, alerts: "within-24h", preparationDiscountPct: 15, complianceReminders: true, bidCalendar: true, priorityTurnaround: true },
    ],
    annualMonthsCharged: 10,
    coverage: null,
    fulfilmentConfirmed: false,
    commercialTermsConfirmed: false,
  },
  uploads: {
    enabled: false,
    maxFileMb: 10,
    acceptedTypes: [
      { ext: "pdf", mime: "application/pdf" },
      { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    ],
  },
  legal: {
    privacyReviewedByOwner: false,
    termsReviewedByOwner: false,
    lastUpdated: null,
  },
  serviceAvailabilityConfirmed: false,
  productionMode: false,
};

export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

/** Paid sourcing may go live only when every operational term is confirmed. */
export function isPaidSourcingConfirmed(c: SiteConfig = site): boolean {
  const s = c.sourcing;
  return s.mode === "paid" && s.plans.length > 0 && !!s.coverage && s.fulfilmentConfirmed && s.commercialTermsConfirmed;
}

/** Whether to show published plans and prices on the site. */
export function showPlans(c: SiteConfig = site): boolean {
  return c.sourcing.mode === "paid" && c.sourcing.plans.length > 0;
}

export function annualPrice(plan: SourcingPlan, c: SiteConfig = site): number {
  return plan.monthlyPrice * c.sourcing.annualMonthsCharged;
}

/** "+254 715 947 213" style display for a configured WhatsApp number. */
export function whatsappDisplay(c: SiteConfig = site): string | null {
  const n = c.contact.whatsapp;
  if (!n || !/^254\d{9}$/.test(n)) return n ? `+${n}` : null;
  return `+254 ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
}

export function whatsappLink(c: SiteConfig = site): string | null {
  if (!c.contact.whatsapp || !/^\d{10,15}$/.test(c.contact.whatsapp)) return null;
  // Neutral prefilled text: never include tender details or personal data.
  const text = encodeURIComponent("Hello, I would like to ask about tender support.");
  return `https://wa.me/${c.contact.whatsapp}?text=${text}`;
}
