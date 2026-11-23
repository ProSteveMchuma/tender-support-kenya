/**
 * Example lead destination: a Google Apps Script web app that appends each lead
 * to a private Google Sheet (for example, the existing internal lead tracker).
 *
 * Setup:
 * 1. Create a Sheet with tabs "quote" and "sourcing". Extensions > Apps Script.
 * 2. Paste this file. Project Settings > Script properties: LEAD_WEBHOOK_SECRET = <long random value>.
 * 3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *    (The shared secret, not the URL, protects it.)
 * 4. Put the web app URL in LEAD_WEBHOOK_URL and the same secret in LEAD_WEBHOOK_SECRET on Vercel.
 *
 * Apps Script web apps cannot read request headers, so the site also needs the
 * secret in the body. This is handled by sending it as the x-lead-secret header AND
 * checking it here via the "secret" query parameter: set LEAD_WEBHOOK_URL to
 *   https://script.google.com/macros/s/<id>/exec?secret=<same secret>
 */
function doPost(e) {
  var expected = PropertiesService.getScriptProperties().getProperty("LEAD_WEBHOOK_SECRET");
  if (!expected || e.parameter.secret !== expected) {
    return json({ ok: false, error: "unauthorised" });
  }
  var lead = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActive().getSheetByName(lead.kind === "quote" ? "quote" : "sourcing");
  var cols = lead.kind === "quote"
    ? ["reference", "receivedAt", "service", "companyName", "contactName", "contactMethod", "email", "phone", "tenderReference", "deadline", "deadlineUtc", "lotsOrCopies", "description"]
    : ["reference", "receivedAt", "companyName", "contactName", "email", "categories", "serviceArea", "capabilities", "updatesConsent"];
  if (sheet.getLastRow() === 0) sheet.appendRow(cols.concat(["attribution", "status"]));
  sheet.appendRow(cols.map(function (c) { return lead[c] === undefined ? "" : lead[c]; })
    .concat([JSON.stringify(lead.attribution || {}), "new"]));
  return json({ ok: true, reference: lead.reference });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
