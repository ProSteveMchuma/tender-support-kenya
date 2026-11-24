import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanAttribution, eatToIso, normalisePhone, parseQuote, parseSourcing } from "../src/lib/validation.ts";

const validQuote = {
  service: "preparation",
  companyName: "Example Supplies Ltd",
  contactName: "Jane",
  contactMethod: "phone",
  phone: "0712 345 678",
  description: "Help with a supply tender, please.",
  privacyAcknowledged: true,
};

test("quote: valid with phone only", () => {
  const { errors, data } = parseQuote(validQuote);
  assert.deepEqual(errors, {});
  assert.equal(data.phone, "+254712345678");
});

test("quote: requires email or phone", () => {
  const { errors } = parseQuote({ ...validQuote, phone: "" });
  assert.ok(errors.email && errors.phone);
});

test("quote: chosen method must have matching detail", () => {
  const { errors } = parseQuote({ ...validQuote, contactMethod: "email" });
  assert.ok(errors.email);
});

test("quote: rejects invalid email, unknown service, missing privacy ack", () => {
  const { errors } = parseQuote({ ...validQuote, email: "nope", service: "hack", privacyAcknowledged: false });
  assert.ok(errors.email && errors.service && errors.privacyAcknowledged);
});

test("sourcing: consent is optional and never defaulted", () => {
  const { errors, data } = parseSourcing({
    companyName: "A", contactName: "B", email: "b@a.co.ke", categories: "furniture", serviceArea: "Nairobi", capabilities: "We supply chairs",
  });
  assert.deepEqual(errors, {});
  assert.equal(data.updatesConsent, false);
});

test("phone normalisation", () => {
  assert.equal(normalisePhone("0112345678"), "+254112345678");
  assert.equal(normalisePhone("254712345678"), "+254712345678");
  assert.equal(normalisePhone("12345"), null);
});

test("deadline is East Africa Time", () => {
  assert.equal(eatToIso("2026-12-10T10:00"), "2026-12-10T07:00:00.000Z");
});

test("attribution drops anything that looks like an email", () => {
  assert.deepEqual(cleanAttribution({ utm_source: "google", utm_campaign: "a@b.com", name: "Jane" }), { utm_source: "google" });
});

test("quote: tender security is a valid service", () => {
  const { errors } = parseQuote({ ...validQuote, service: "security" });
  assert.deepEqual(errors, {});
});

test("quote: method-specific message when the chosen detail is missing", () => {
  const { errors } = parseQuote({ ...validQuote, contactMethod: "whatsapp", phone: "" });
  assert.equal(errors.phone, "Enter your WhatsApp number.");
});

test("sourcing: plan and billing are optional and validated", () => {
  const base = { companyName: "A", contactName: "B", email: "b@a.co.ke", categories: "x", serviceArea: "y", capabilities: "We supply chairs" };
  assert.deepEqual(parseSourcing({ ...base, plan: "growth", billing: "annual" }).errors, {});
  assert.ok(parseSourcing({ ...base, plan: "gold" }).errors.plan);
  assert.equal(parseSourcing({ ...base, plan: "unsure", billing: "annual" }).data.billing, "");
});
