import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const finance = fs.readFileSync(path.join(root, "finance/index.html"), "utf8");

for (const required of [
  "PX-ROUTE-R5C JS OK",
  'id="quoteAvailabilityNextUpdateAt"',
  "Set a future next-customer-update date and time.",
  "Customer update overdue",
  "Customer update due soon",
  "function appendAvailabilityAlerts",
  "function sortActionAlerts",
  "await loadOrder(id)",
  "async function convertQuoteToLive(id)",
  "function appendOnlineBackupAlert",
  "function persistWorkflowChange",
  "Saved on this device - online backup needs retrying');postSaveNudge(o);return true",
  'id="postageDecision"',
  "function postageDecisionIssues",
  "postageDecision:val('postageDecision')",
  "postageDecision:data.postageDecision||''",
  "Your request remains in progress while the dispatch date is finalised.",
  "We’ll provide the next update by ",
  'data-request-view="archived"',
  "async function archiveRequest",
  "async function restoreArchivedRequest",
  "async function updateSharedRequestStatus",
  ".in('request_status',['new','reviewing','quoted','closed'])",
  "update({request_status:status})",
  "status:row?.request_status||req.status||'new'",
  'id="newEmailQuoteStart"',
  'id="recEmail"',
  "function newEmailQuote",
  "set('orderSource','Early Access email')",
  "recipientEmail:val('recEmail').trim().toLowerCase()",
  "set('recEmail',o.recipientEmail||o.sourceRequestMeta?.email||'')",
  "function openEmailMessage",
  "window.location.href='mailto:'",
  "openEmail:'openEmailMessage(confirmationMsg)'",
]) assert(finance.includes(required), `Finance reliability control missing: ${required}`);

assert(!finance.includes("We’ll update you as soon as the timing is confirmed."), "Passive availability wording remains");
assert(!finance.includes("id:'requests-waiting'"), "Retired cloud-request alert leaked into the email-only checkpoint");
assert(!/function appendOnlineBackupAlert[^\n]+dueAt:1/.test(finance), "Backup warning still outranks dated customer work");
assert.equal((finance.match(/id="postageDecision"/g) || []).length, 1, "Postage decision control is duplicated");
assert(finance.indexOf('id="postageCheckSection"') < finance.indexOf('id="optionalDetailsSection"'), "Postage decision is hidden inside optional fulfilment");
assert(/generateFulfilment\(\\'stock-delay\\'\)&&setCommStatus/.test(finance), "A failed availability-message generation can still be marked generated");
assert(/async function convertQuoteToLive\(id\)[\s\S]*?await loadOrder\(id\);[\s\S]*?if\(current\.id!==id\)return;/.test(finance), "Quote conversion does not await the selected record");
assert(/function requestLifecycleGroup\(req\)[^\n]+status==='closed'\)return 'archived'/.test(finance), "Closed shared requests are not routed to Archived");
assert(/function renderRequestInboxActions\(req[^\n]+status==='closed'\)return `<button class="btn good" onclick="restoreArchivedRequest/.test(finance), "Archived requests do not provide a restore action");
assert(/function mergeCloudRequestIntoInbox[^\n]+\(localStatus==='closed'\|\|cloudStatus==='closed'\)\?req\.status/.test(finance), "Shared archive/restore state can be overridden by stale device state");
assert(!/async function archiveRequest[^\n]+\.delete\(/.test(finance), "Archiving deletes request records");
assert(/function newEmailQuote\(\)[\s\S]*?newQuote\(\);[\s\S]*?set\('orderSource','Early Access email'\);[\s\S]*?set\('quoteStatus','Quote to send'\)/.test(finance), "Email intake does not start as a quote ready for preparation");
assert(!/function startSendQuoteWorkflow\(\)[\s\S]*?if\(openInWhatsApp\)openWhatsAppMessage/.test(finance), "Send quote still launches WhatsApp automatically");
assert(/function openEmailMessage\(messageEl\)[\s\S]*?encodeURIComponent\(customerEmailSubject\(\)\)[\s\S]*?encodeURIComponent\(message\)/.test(finance), "Email handoff does not encode the quote subject and body");

for (const source of [...finance.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((script) => script.trim())) {
  new vm.Script(source);
}

const sortSource = finance.match(/function sortActionAlerts[^\n]+/)?.[0];
const backupSource = finance.match(/function appendOnlineBackupAlert[^\n]+/)?.[0];
assert(sortSource && backupSource, "Alert reliability functions were not found");
const alertContext = { orderLabel: (order) => order.id };
vm.createContext(alertContext);
vm.runInContext(`${sortSource};${backupSource};this.sortActionAlerts=sortActionAlerts;this.appendOnlineBackupAlert=appendOnlineBackupAlert`, alertContext);
const alerts = [
  { title: "Customer update due soon", severity: "warning", dueAt: 200 },
  { title: "Customer update overdue", severity: "critical", dueAt: 100 },
];
alertContext.appendOnlineBackupAlert(alerts, { id: "PX-LOCAL", supabaseItemSyncStatus: "local_only", supabaseOrderId: "" });
assert.deepEqual(Array.from(alertContext.sortActionAlerts(alerts), (row) => row.title), ["Customer update overdue", "Customer update due soon", "Retry online backup"]);

const postageSource = finance.match(/function postageDecisionIssues[^\n]+/)?.[0];
assert(postageSource, "Postage decision validator was not found");
const postageState = { decision: "", charge: 0 };
const postageContext = {
  val: () => postageState.decision,
  num: () => postageState.charge,
};
vm.createContext(postageContext);
vm.runInContext(`${postageSource};this.postageDecisionIssues=postageDecisionIssues`, postageContext);
assert.deepEqual(Array.from(postageContext.postageDecisionIssues()), ["Choose whether postage is charged."]);
postageState.decision = "charged";
assert.deepEqual(Array.from(postageContext.postageDecisionIssues()), ["Enter the postage charge."]);
postageState.charge = 5;
assert.equal(postageContext.postageDecisionIssues().length, 0);
postageState.decision = "none";
assert.deepEqual(Array.from(postageContext.postageDecisionIssues()), ["Set postage to £0 or change the postage decision."]);
postageState.charge = 0;
assert.equal(postageContext.postageDecisionIssues().length, 0);

console.log("Finance workflow reliability verification passed: dated follow-ups, alert priority, local-first backup, awaited record actions, explicit postage and JavaScript parsing.");
