import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const planner = read("planner/app.js");
const finance = read("finance/index.html");

const inbound = planner.match(/function requestText\(reference\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert(inbound, "Planner inbound request template is missing");
for (const required of ["Reference: ${reference}", "Name: ${form.name}", "Requested products:\\n${itemLines}", "Indicative total: £${total()}"]) {
  assert(inbound.includes(required), `Planner inbound request is missing ${required}`);
}
for (const customerOnly of ["Research Use Only", "Not for human", "Not for veterinary", "Availability, fulfilment and next steps"]) {
  assert(!inbound.includes(customerOnly), `Planner inbound request contains customer-only wording: ${customerOnly}`);
}

const confirmation = finance.match(/function generateConfirmation\(\)\{([\s\S]*?)\n\}\nfunction titleCaseLine/)?.[1] || "";
assert(confirmation, "Finance quote/order confirmation generator is missing");
assert.equal((confirmation.match(/Research Use Only\. Not for human or animal use\. Not a medicine\./g) || []).length, 2, "Quote and order confirmations must each contain one approved footer");

assert(finance.includes("function customerMessageFooter(){return 'Research Use Only. Not for human or animal use. Not a medicine.'}"), "Shared outbound customer footer is missing");
assert(finance.includes("function generateFulfilment(type)"), "Fulfilment message generator is missing");
assert(/\+'\\n\\n'\+customerMessageFooter\(\);writeCustomerUpdate\(msg,'Fresh '\+selected\+' message generated - send, then mark sent',selected\)/.test(finance), "Fulfilment messages do not use the approved outbound footer");
assert(finance.includes("function generatePaymentRequest()"), "Payment request generator is missing");
assert(finance.includes("Your order will move forward once payment arrangements are confirmed.\\n\\n'+customerMessageFooter()"), "Payment request does not use the approved outbound footer");

for (const type of ["preparation", "packed", "collection", "dispatch", "tracking", "stock-delay"]) {
  assert(finance.includes(`if(type==='${type}')`), `Finance customer message type is missing: ${type}`);
}

console.log("PrimeX message-direction checks passed.");
