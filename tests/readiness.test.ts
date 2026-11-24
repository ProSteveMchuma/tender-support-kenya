import { test } from "node:test";
import assert from "node:assert/strict";
import { site } from "../src/config/site.ts";
import { checkReadiness, isIndexable } from "../src/lib/readiness.ts";

test("default config is preview mode and not ready", () => {
  assert.equal(site.productionMode, false);
  assert.equal(checkReadiness(site, {}).items.find((i) => i.id === "sourcing")!.ok, false, "plans need fulfilment and terms confirmed");
  assert.equal(checkReadiness(site, {}).ready, false);
  assert.equal(isIndexable(site, {}), false);
});

test("fully confirmed config passes", () => {
  const ready = structuredClone(site);
  Object.assign(ready, { nameIsConfirmed: true, legalEntity: "Example Ltd", domain: "example.co.ke", serviceAvailabilityConfirmed: true, productionMode: true });
  ready.contact.email = "hello@example.co.ke";
  ready.legal.privacyReviewedByOwner = true;
  ready.legal.termsReviewedByOwner = true;
  ready.sourcing.coverage = "Public tenders from official Kenyan sources";
  ready.sourcing.fulfilmentConfirmed = true;
  ready.sourcing.commercialTermsConfirmed = true;
  const env = { LEAD_WEBHOOK_URL: "https://script.google.com/x", LEAD_WEBHOOK_SECRET: "s" };
  assert.equal(checkReadiness(ready, env).ready, true);
  assert.equal(isIndexable(ready, env), true);
  assert.equal(checkReadiness(ready, { LEAD_WEBHOOK_URL: "http://insecure" }).ready, false);
});

test("paid sourcing needs every term confirmed; interest mode passes", () => {
  const c = structuredClone(site);
  c.sourcing.mode = "paid";
  c.sourcing.coverage = "x";
  c.sourcing.fulfilmentConfirmed = true;
  assert.equal(checkReadiness(c, {}).items.find((i) => i.id === "sourcing")!.ok, false);
  c.sourcing.mode = "interest";
  assert.equal(checkReadiness(c, {}).items.find((i) => i.id === "sourcing")!.ok, true);
});

test("approved plan prices and annual = 10 months", async () => {
  const { annualPrice } = await import("../src/config/site.ts");
  assert.deepEqual(site.sourcing.plans.map((p) => p.monthlyPrice), [2500, 6500, 15000]);
  assert.deepEqual(site.sourcing.plans.map((p) => annualPrice(p)), [25000, 65000, 150000]);
  assert.equal(site.sourcing.plans.find((p) => p.recommended)!.id, "growth");
});

test("no private planning figures in public config", () => {
  const text = JSON.stringify(site);
  for (const s of ["25000", "40000", "50000", "100000", ":1000,"]) assert.ok(!text.includes(s), s);
});
