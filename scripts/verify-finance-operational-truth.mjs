import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const finance = fs.readFileSync(path.join(root, "finance/index.html"), "utf8");

for (const required of [
  "PX-ROUTE-R5D JS OK",
  "function requestCurrentApprovedProduct",
  "Current product / price",
  "Older request - product not recognised",
  "Current approved price:",
  "requested '+htmlEscape(requested)+' · available '+htmlEscape(held)",
  "short '+htmlEscape(short)",
  "function isStockAffectingOrder(o){return !isBinned(o)",
  "Available now cannot be used: current stock does not cover the complete quote.",
  "Part ready cannot be used: none of the quoted stock is currently available.",
  "function requiredCustomerUpdateKey",
  "function requiredCustomerUpdateSent",
  "current.commStatus.stockDelayLastSentAt=new Date().toISOString()",
  "set('quoteAvailabilityNextUpdateAt','')",
  "function removeTestRequest",
  "Remove test request",
]) assert(finance.includes(required), `Operational-truth control missing: ${required}`);

assert(!/function isStockAffectingOrder[^\n]+supabaseItemSyncStatus/.test(finance), "Unsynced saved live orders are still excluded from local stock");
assert(!/packed or dispatching[^\n]+updateSent/.test(finance), "Later-stage customer alerts still trust the global update flag");
assert(/function activeRequestInboxItems\(\)\{return \(requestInbox\|\|\[\]\)\.filter\(req=>!isRequestBinned\(req\)&&!isObviousTestRequest\(req\)\)\}/.test(finance), "Test requests still enter active request totals");
assert(/function communicationStatusPayload\(\)[\s\S]*?return \{commStatus:comm,\.\.\.comm\};/.test(finance), "Stage communication state is not persisted");

for (const source of [...finance.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((script) => script.trim())) new vm.Script(source);

console.log("Finance operational-truth verification passed: known legacy products, test isolation, quantity-aware stock, local reservation, availability consistency and stage-specific follow-ups.");
