import { test } from "node:test";
import assert from "node:assert/strict";
import { site } from "../src/config/site.ts";
import { checkReadiness, isIndexable } from "../src/lib/readiness.ts";

test("default config is preview mode and not ready", () => {
  assert.equal(site.productionMode, false);
  assert.equal(site.sourcing.mode, "interest");
  assert.equal(checkReadiness(site, {}).ready, false);
  assert.equal(isIndexable(site, {}), false);
});

test("fully confirmed config passes", () => {
  const ready = structuredClone(site);
  Object.assign(ready, { nameIsConfirmed: true, legalEntity: "Example Ltd", domain: "example.co.ke", serviceAvailabilityConfirmed: true, productionMode: true });
  ready.contact.email = "hello@example.co.ke";
  ready.legal.privacyReviewedByOwner = true;
  ready.legal.termsReviewedByOwner = true;
  const env = { LEAD_WEBHOOK_URL: "https://script.google.com/x", LEAD_WEBHOOK_SECRET: "s" };
  assert.equal(checkReadiness(ready, env).ready, true);
  assert.equal(isIndexable(ready, env), true);
  assert.equal(checkReadiness(ready, { LEAD_WEBHOOK_URL: "http://insecure" }).ready, false);
});

test("paid sourcing needs every term confirmed", () => {
  const c = structuredClone(site);
  c.sourcing.mode = "paid";
  assert.equal(checkReadiness(c, {}).items.find((i) => i.id === "sourcing")!.ok, false);
});

test("no private planning figures in public config", () => {
  const text = JSON.stringify(site);
  for (const s of ["25000", "40000", "50000", "100000"]) assert.ok(!text.includes(s), s);
});
