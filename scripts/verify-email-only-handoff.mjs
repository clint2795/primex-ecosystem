import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("planner/index.html");
const app = read("planner/app.js");

assert(html.includes('id="emailRequest"'), "Email request action is missing");
assert(!html.includes('id="submitRequest"'), "Cloud submit action remains visible");
assert(html.includes("Your email app will open with the details ready — press Send to submit it."), "Pre-send explanation is missing");
assert(html.includes('id="copyRequest" class="fallback-action" type="button" hidden'), "Copy fallback must be hidden initially");
assert(html.includes("Email didn’t open? Copy request instead"), "Copy fallback wording is missing");

assert(app.includes('const EMAIL = "orders@primexbiolabs.co.uk"'), "Approved PrimeX inbox is missing");
assert(app.includes("window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`"), "mailto handoff is missing");
assert(app.includes("PrimeX has not received your request until you press Send"), "Post-open warning is missing");
assert(app.includes("Paste it into an email to ${EMAIL} and press Send"), "Copy fallback does not direct the customer to email");
assert(app.includes('$("#copyRequest").hidden = false'), "Email action does not reveal the fallback");
assert(app.includes('$("#copyRequest").hidden = true'), "Edited requests do not reset the fallback");

for (const required of [
  "Reference: ${reference}",
  "Name: ${form.name}",
  "Preferred reply: ${form.method}",
  'Email: ${form.email || "Not provided"}',
  'WhatsApp: ${form.whatsapp || "Not provided"}',
  "Fulfilment preference: ${form.delivery}",
  "Requested products:\\n${itemLines}",
  "Indicative total: £${total()}",
  'Notes / questions:\\n${form.notes || "None"}',
]) assert(app.includes(required), `Email request is missing: ${required}`);

const requestTextBody = app.match(/function requestText\(reference\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert(requestTextBody, "Inbound request template was not found");
assert(!/Research Use Only|Not for human|Not for veterinary|Availability, fulfilment and next steps/.test(requestTextBody), "Customer-facing footer leaked into the inbound request email");

assert(!app.includes("REQUEST_INTAKE_URL"), "Cloud intake endpoint remains in Planner");
assert(!app.includes("submitCloudRequest"), "Cloud intake function remains in Planner");
assert(!app.includes("/functions/v1/submit-request"), "Planner can still address the cloud intake function");

console.log("Email-only Early Access handoff checks passed.");
