# TenderPro (working preview)

Lead-generation and service-intake website for a Kenyan tender-support business: tender sourcing (interest registration), separately quoted tender preparation, tender security support (bid bonds and guarantees, facilitated with the client's chosen issuer), and optional printing and submission support.

The trading name is **TenderPro** (confirmed by Steve, 23 Nov 2026). The legal entity is still unconfirmed, so the footer shows the trading name only. The site ships in **preview mode**: noindex everywhere, a visible preview notice, and forms that say "Preview only — your request has not been sent." until a real lead destination is configured.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, no UI framework
- Content pages are statically generated; the two form endpoints are server route handlers
- Self-hosted fonts via `next/font` (Newsreader + Public Sans); no third-party scripts by default
- Hosts on Vercel or any Node 22 host

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build
npm test             # validation + readiness unit tests (Node's built-in test runner)
npm run lint         # TypeScript type check
npm run readiness    # production-readiness checklist; exits non-zero until all pass
npm run mock-webhook # local fake lead destination for testing the "received" path
```

Testing the full form path locally:

```bash
MOCK_MODE=ok npm run mock-webhook &     # or MOCK_MODE=fail / unconfirmed
LEAD_WEBHOOK_URL=http://127.0.0.1:3200/ LEAD_WEBHOOK_SECRET=test-secret LEAD_WEBHOOK_ALLOW_LOCALHOST=1 npm run dev
```

## Where things live

| Path | Purpose |
| --- | --- |
| `src/config/site.ts` | **The one config file**: name, founder line, contacts, domain, pricing, service availability, sourcing mode, uploads, legal review flags, `productionMode` |
| `src/config/content.ts` | Customer-facing copy (hero, services, steps, FAQs, sample brief, nav) |
| `src/lib/readiness.ts` | Production-readiness checks and `isIndexable()` |
| `src/lib/validation.ts` | Shared form validation (browser and server) |
| `src/lib/leads.server.ts` | Server-only intake: spam controls, rate limit, delivery, notification, references |
| `src/lib/analytics.ts` | Privacy-safe analytics events and UTM capture |
| `src/app/api/quote`, `src/app/api/sourcing-interest` | Form endpoints |
| `docs/lead-webhook.gs` | Example lead destination (Google Sheet via Apps Script) |

## Environment variables

All server-only unless prefixed `NEXT_PUBLIC_`. See `.env.example`. Static pages read these at build time, so **redeploy after changing them**.

| Variable | Required for launch | Purpose |
| --- | --- | --- |
| `LEAD_WEBHOOK_URL` | Yes | HTTPS endpoint that durably stores a lead and replies `{"ok": true, "reference": "<same reference>"}` |
| `LEAD_WEBHOOK_SECRET` | Yes | Shared secret sent as the `x-lead-secret` header |
| `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_NOTIFY_FROM` | No | Staff notification email after a lead is saved |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Cookieless analytics; only loads once the site is indexable |
| `LEAD_WEBHOOK_ALLOW_LOCALHOST` | Never in production | Lets local tests use an `http://localhost` webhook |

## Integration status

| Area | Status now | What remains |
| --- | --- | --- |
| Pages (home + 7) | **Works.** Static, one H1 each, unique titles and descriptions | Owner copy review, including the security facts below |
| Quote form | **Works** as a 3-step flow (service, tender details, contact) with per-step validation, browser and server. In preview it returns "Preview only — your request has not been sent." | Set `LEAD_WEBHOOK_URL` + secret |
| Sourcing-interest form | **Works** as a 2-step flow, same rules as above. Consent box is optional and unticked; states no subscription or charge | Same; add an unsubscribe route when update emails are actually sent |
| Lead storage | **Not connected.** Code path tested against a mock: shows success only after the destination confirms the reference; failure shows a retry message and is logged | Deploy `docs/lead-webhook.gs` (or any store that meets the contract) |
| Staff notification email | **Not connected.** Failures are logged; the saved lead is kept | Resend account and verified sender domain |
| Spam controls | **Works:** honeypot, minimum fill time, 5 requests per 10 minutes per IP per form, 20 KB body limit | Rate limit is per server instance. For heavy abuse, add Vercel Firewall rules or a shared store (e.g. Upstash) |
| File uploads | **Disabled and hidden.** Forms explain documents are collected securely after first contact | Needs private storage, content-type sniffing, size limit, signed short-lived URLs and staff-only access before enabling. Not built |
| WhatsApp click-to-chat | **Live** on +254 719 584 549 (hero, mobile action bar, contact page, request form, footer). Neutral prefilled text, no tender details. `whatsapp_clicked` event fires on click. +254 715 947 213 is stored as `contact.whatsappAlternate` and not shown | Swap the two values in `src/config/site.ts` to change the main number |
| Phone / email links | **Hidden** (not configured) | Add real values in `site.contact` |
| Analytics events | **Works** as browser `CustomEvent("tsk:analytics")`; `quote_request_received` / `sourcing_interest_received` fire only after a server-confirmed 201, and the server logs them too. No names, emails, phones or tender details | Optional Plausible domain |
| SEO | **Preview:** `noindex` meta, `X-Robots-Tag` header, robots.txt disallows all, empty sitemap, no canonicals, no structured data | All switch on automatically with a domain + `productionMode: true` + passing readiness |
| Sourcing plans | **Live in preview.** Starter KSh 2,500, Growth KSh 6,500 (recommended), Pro KSh 15,000 a month; annual = 10 months' price (2 months free). Shown on the home page pricing section and `/tender-sourcing#plans` with a monthly/annual switch, a two-question plan finder, a comparison table and a WhatsApp link per plan. "Choose plan" pre-fills the sourcing form; nothing is charged online | Confirm coverage, fulfilment and subscription terms (see below), then the readiness check passes |
| Online payment / checkout | **Not built** (by design). Plans are invoiced after you confirm details | None for launch |
| Payments | **Not built** (by design). Quotes and invoices are handled offline | None for launch |
| Privacy notice / terms | **Drafts**, flagged "Draft for owner review" | Owner (ideally with legal advice) reviews, then set the `legal.*Reviewed` flags |

## Owner configuration checklist

1. ~~Business name~~ **TenderPro, confirmed.** The legal entity is a different name (confirmed by Steve). Still to do: give its exact registered name and set `legalEntity` in `src/config/site.ts`. Check whether "TenderPro" needs registering as a business name, or whether it is already registered by someone else.
2. Add at least one real contact method (`email`, `phone`, `whatsapp`) and optional `hours`. Leave unknown ones `null`.
3. Decide the domain, add it to Vercel, and set `domain` (bare, e.g. `example.co.ke`).
4. Set up the lead destination (e.g. `docs/lead-webhook.gs` into your lead tracker sheet) and add `LEAD_WEBHOOK_URL` and `LEAD_WEBHOOK_SECRET` in Vercel. Submit a test lead and confirm it arrives with its reference.
5. Decide tax wording; set `pricing.taxStatement` (or leave `null` to keep "clarified in your quotation").
6. Confirm each service in `services` is genuinely offered (set submission assistance to `"unavailable"` if not), then set `serviceAvailabilityConfirmed: true`.
7. Review and edit `/privacy` and `/terms`, especially the 12-month inquiry retention period, then set `legal.privacyReviewedByOwner`, `legal.termsReviewedByOwner` and `legal.lastUpdated`.
8. Run `npm run readiness` with the production env vars. When every line passes, set `productionMode: true` and redeploy. The build refuses to complete if `productionMode` is true while checks fail.
9. Only then point the public domain at the deployment.

## Tender security support: facts for the owner to confirm

The `/tender-security-support` page describes the service as **facilitation only**: reading the requirement, preparing the application and prescribed form wording, dealing with the client's chosen issuer on their behalf (confirmed by the owner), with written authority, and checking the issued document against the tender. It says plainly that the business does not issue, guarantee or finance securities, that issuer fees are paid by the client, and that the support is quoted separately. It names no banks or insurers. Status of each point:

1. ~~Liaising with issuers on a client's behalf~~ **Confirmed by Steve (23 Nov 2026).** The page now says you deal with the issuer on the client's behalf "with your written authority". Still to do: prepare the short client authority letter you will use, and check whether each issuer needs its own mandate form.
2. **Issuer types (decided 23 Nov 2026, owner asked Claude to choose):** named generically as "banks, insurance companies or other institutions the tender permits". No firms are named.
3. **Tender Securing Declaration (decided 23 Nov 2026):** explained in general terms as a signed undertaking some tenders ask for instead of a security, with "whether one applies depends on the tender's own instructions". No rule about procurement methods or AGPO groups is stated. Add one only after checking the current regulations.
4. ~~Post-award support~~ **Confirmed by Steve (23 Nov 2026):** keep the "After award" section covering performance securities, advance payment guarantees and extensions.
5. **Lead times (decided 23 Nov 2026):** no fixed times published. The page says processing times vary by issuer and to start as early as possible.

Set `services.securities` to `"unavailable"` in `src/config/site.ts` to hide the page content if you pause this service. The nav, card and form option should then also be removed from `src/config/content.ts` and `src/lib/validation.ts`.

## Sourcing plans

Approved by Steve on 24 Nov 2026. Edit `sourcing.plans` in `src/config/site.ts`; every price, card, comparison row and form option is generated from it.

| | Starter | Growth (recommended) | Pro |
| --- | --- | --- | --- |
| Monthly | KSh 2,500 | KSh 6,500 | KSh 15,000 |
| Annual (2 months free) | KSh 25,000 | KSh 65,000 | KSh 150,000 |
| Categories | Up to 3 | Up to 8 | No limit (categories and counties) |
| Matches | Weekly digest, WhatsApp or email | Alerts within 24 hours of publication | Alerts within 24 hours |
| Fit note on each match | Yes | Yes | Yes |
| Full requirements briefs | None | 4 a month | 12 a month |
| Extras | | 10% off preparation | 15% off preparation, monthly bid calendar, compliance-document expiry reminders, priority turnaround |

How it's shown: a monthly/annual switch, a two-question "which plan fits me" finder that highlights a card, Growth as the dark "Recommended" card, a WhatsApp link per plan with neutral text, a collapsible comparison table, and plain fine print. Choosing a plan opens the sourcing form with that plan and billing pre-selected. The form saves `plan` and `billing` with the lead.

What the site does **not** say: no win rates, client counts or "pays for itself" claims. "No limit" applies to categories and counties only. Briefs are capped per plan.

Still to confirm before launch (the readiness check fails until these are set in `src/config/site.ts`):

1. `sourcing.coverage`: which official sources you monitor and how often. The "within 24 hours" promise depends on it.
2. `sourcing.fulfilmentConfirmed`: you can deliver every plan's promises at the volume you expect. That covers 24-hour alerts, 4 or 12 briefs a month, bid calendars and compliance reminders.
3. `sourcing.commercialTermsConfirmed`: billing date, renewal, cancellation, refunds, and what happens to unused briefs. Add these to `/terms`.
4. Tax treatment on subscriptions (`pricing.taxStatement`).

## Private figures

Internal fee bands, typical fees, workload, budgets and the proposed sourcing test price are **not** in this codebase. The only public price is the "from KSh 15,000" entry point. If an internal tool ever needs private figures, keep them in server-only environment variables, never in `src/config` (which is bundled into the browser). A unit test fails if common private figures appear in the public config.

## Future: internal AI assistance (not implemented)

A later internal-only tool could help staff draft requirements briefs or evidence maps from a tender document. If built: keep it behind staff authentication, never expose it to customers, keep each client's documents isolated, log which outputs were AI-assisted, and keep **expert review as the release step** before anything reaches a client. Customer-facing copy already says: "We use AI tools to assist internal preparation, with expert review before delivery."
