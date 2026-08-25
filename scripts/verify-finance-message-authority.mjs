import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const finance = fs.readFileSync(path.join(root, "finance/index.html"), "utf8");

for (const required of [
  "PX-ROUTE-R5D JS OK",
  "const CUSTOMER_MESSAGE_TEMPLATE_VERSION='PX-MSG-R5C-1'",
  'id="quoteExpectedDispatch"',
  "Enter the expected dispatch timing for the customer.",
  "Expected dispatch: ",
  "PrimeX BioLabs \\u2014 Quote",
  "Thank you for your request. Your quote is below.",
  "To proceed, reply CONFIRM.",
  "Payment instructions will be sent after confirmation.",
  "confirmationMsgMeta:current.confirmationMsgMeta||null",
  "fulfilmentMsgMeta:current.fulfilmentMsgMeta||null",
  "function customerMessageDependencyFingerprint",
  "function ensureCustomerMessageCurrent",
  "Regenerate required",
  "if(!ensureCustomerMessageCurrent(confirmationMsg))return",
  "if(!ensureCustomerMessageCurrent(fulfilmentMsg))return",
  "row.status!=='stale'",
  "current.fulfilmentMsgMeta?.messageType!==messageType",
]) assert(finance.includes(required), `Message-authority control missing: ${required}`);

for (const retired of [
  "PrimeX BioLabs - Quote / Availability Check",
  "Estimated total:",
  "Availability, fulfilment, payment, and dispatch details are confirmed separately before anything is finalised.",
]) assert(!finance.includes(retired), `Retired customer wording remains: ${retired}`);

assert(/copyConfirmation\.onclick=\(\)=>\{if\(!ensureCustomerMessageCurrent\(confirmationMsg\)\)return;/.test(finance), "Copy confirmation bypasses the authority check");
assert(/function copyCustomerUpdate\(\)\{if\(!ensureCustomerMessageCurrent\(fulfilmentMsg\)\)return;/.test(finance), "Copy customer update bypasses the authority check");
assert(/function openEmailMessage\(messageEl\)[\s\S]*?ensureCustomerMessageCurrent\(messageEl\)/.test(finance), "Email handoff bypasses the authority check");
assert(/function openWhatsAppMessage\(messageEl\)[\s\S]*?ensureCustomerMessageCurrent\(messageEl\)/.test(finance), "WhatsApp handoff bypasses the authority check");
assert(/function markConfirmationSentNow\(\)[\s\S]*?ensureCustomerMessageCurrent\(confirmationMsg\)/.test(finance), "Confirmation can be marked sent while stale");
assert(/function markCustomerUpdateSentNow\(\)[\s\S]*?ensureCustomerMessageCurrent\(fulfilmentMsg\)/.test(finance), "Customer update can be marked sent while stale");
assert(/function convertCurrentQuoteToLive\(\)[\s\S]*?confirmationMsgMeta:null,fulfilmentMsgMeta:null[\s\S]*?set\('confirmationMsg',''\);[\s\S]*?set\('fulfilmentMsg',''\);/.test(finance), "Quote conversion carries an old customer message into the live order");

for (const source of [...finance.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((script) => script.trim())) {
  new vm.Script(source);
}

console.log("Finance message-authority verification passed: complete quote wording, explicit dispatch timing, versioned dependencies and stale-message send/copy blocks.");
