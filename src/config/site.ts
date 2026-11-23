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

export type Availability = "available" | "on-request" | "unavailable";

export interface SiteConfig {
  /** Descriptive working name. Not a confirmed registered brand. */
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
    mode: SourcingMode;
    /** Only used when mode === "paid" and every field is confirmed. */
    paid: {
      monthlyPrice: number | null;
      briefsIncludedPerMonth: number | null;
      coverage: string | null;
      fulfilmentConfirmed: boolean;
      commercialTermsConfirmed: boolean;
    };
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
  name: "Tender Support Kenya",
  nameIsConfirmed: false,
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
    mode: "interest",
    paid: {
      monthlyPrice: null,
      briefsIncludedPerMonth: null,
      coverage: null,
      fulfilmentConfirmed: false,
      commercialTermsConfirmed: false,
    },
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

export function isPaidSourcingConfirmed(c: SiteConfig = site): boolean {
  const p = c.sourcing.paid;
  return (
    c.sourcing.mode === "paid" &&
    p.monthlyPrice !== null &&
    p.briefsIncludedPerMonth !== null &&
    !!p.coverage &&
    p.fulfilmentConfirmed &&
    p.commercialTermsConfirmed
  );
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
