import { site as defaultSite, isPaidSourcingConfirmed, type SiteConfig } from "../config/site.ts";

export interface ReadinessItem {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
}

export interface ReadinessResult {
  ready: boolean;
  items: ReadinessItem[];
}

type Env = Record<string, string | undefined>;

export function hasLeadDestination(env: Env): boolean {
  const url = env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  try {
    const u = new URL(url);
    const localTest = env.LEAD_WEBHOOK_ALLOW_LOCALHOST === "1" && ["localhost", "127.0.0.1"].includes(u.hostname);
    return (u.protocol === "https:" || localTest) && !!env.LEAD_WEBHOOK_SECRET;
  } catch {
    return false;
  }
}

/**
 * Production readiness. Every item must pass before productionMode may be true,
 * before noindex is removed, and before the site is published publicly.
 */
export function checkReadiness(c: SiteConfig = defaultSite, env: Env = {}): ReadinessResult {
  const contactCount = [c.contact.email, c.contact.phone, c.contact.whatsapp].filter(Boolean).length;
  const items: ReadinessItem[] = [
    { id: "name", label: "Business name confirmed", ok: c.nameIsConfirmed },
    { id: "legal-entity", label: "Legal entity confirmed", ok: !!c.legalEntity },
    { id: "domain", label: "Real domain configured", ok: !!c.domain },
    {
      id: "contact",
      label: "At least one confirmed contact method (email, phone or WhatsApp)",
      ok: contactCount > 0,
    },
    {
      id: "lead-destination",
      label: "Durable lead destination configured (LEAD_WEBHOOK_URL over https + LEAD_WEBHOOK_SECRET)",
      ok: hasLeadDestination(env),
    },
    { id: "privacy", label: "Privacy notice reviewed by owner", ok: c.legal.privacyReviewedByOwner },
    { id: "terms", label: "Service terms reviewed by owner", ok: c.legal.termsReviewedByOwner },
    {
      id: "availability",
      label: "Service availability confirmed as truthful",
      ok: c.serviceAvailabilityConfirmed,
    },
    {
      id: "sourcing",
      label: "Sourcing plans: coverage, fulfilment and subscription terms confirmed (or mode set back to 'interest')",
      ok: c.sourcing.mode === "interest" || isPaidSourcingConfirmed(c),
    },
    {
      id: "uploads",
      label: "File uploads disabled (private upload storage is not implemented in this build)",
      ok: !c.uploads.enabled,
    },
  ];
  return { ready: items.every((i) => i.ok), items };
}

/** Search engines may index only in production mode with every check passing. */
export function isIndexable(c: SiteConfig = defaultSite, env: Env = {}): boolean {
  return c.productionMode && checkReadiness(c, env).ready;
}
