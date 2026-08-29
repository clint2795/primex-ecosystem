#!/usr/bin/env node
'use strict';

const fs=require('fs');
const assert=require('assert');

const base=fs.readFileSync('finance-operator-layout-review/index.html','utf8');
const batch1=fs.readFileSync('finance-operator-layout-review/r5h-batch1.js','utf8');
const batch4=fs.readFileSync('finance-operator-layout-review/r5h-batch4.js','utf8');

assert.doesNotThrow(()=>new Function(batch4),'r5h-batch4.js must parse');
assert(batch4.includes("location.pathname.includes('/finance-operator-layout-review/')"),'Batch 4 must remain protected-route only');
assert(batch1.includes("/finance-operator-layout-review/r5h-batch4.js?v=1"),'Protected loader must include Batch 4');

// Long-edit lease truth.
assert(batch4.includes('const LEASE_MINUTES=10'),'Batch 4 must match the deployed ten-minute lease');
assert(batch4.includes('const LEASE_RENEW_MS=4*60*1000'),'Lease heartbeat must renew before expiry');
assert(batch4.includes("p_lease_minutes:LEASE_MINUTES"),'Heartbeat must renew through claim_quote_order');
assert(batch4.includes('if(!row){markLeaseLost(leaseRecordId);return false}'),'Lost lease must be detected explicitly');
assert(batch4.includes("current.cloudReadOnly=true"),'Lost lease must make the open record read-only');
assert(batch4.includes("document.addEventListener('visibilitychange'"),'Visible-tab return must re-check the lease');
assert(batch4.includes("window.addEventListener('focus'"),'Window focus must re-check the lease');

// Payment promise must have a recorded owner/date and completion state.
for(const token of ['paymentInstructionsStatus','paymentInstructionsDueAt','paymentInstructionsOwner','paymentInstructionsSentAt']){
  assert(batch4.includes(token),'Missing payment-instructions evidence field: '+token);
}
assert(batch4.includes('if(!paymentPromiseReady())return false'),'Payment request must be blocked without an owned future promise');
assert(batch4.includes("Payment instructions will be sent separately by '+formatPromiseDate(due)"),'Customer payment request must contain the recorded deadline');
assert(batch4.includes("title:'Payment instructions overdue'"),'Overdue payment instructions must surface as a priority action');
assert(batch4.includes('data-comm-key="paymentInstructionsFollowup"'),'Communication Centre must expose the promised payment-instructions task');
assert(batch4.includes('window.r5hMarkPaymentInstructionsSent'),'Payment instructions must have an explicit completion action');

// Post-handover text must not create an untracked optional tracking promise.
assert(batch4.includes('No tracking/reference is available at the time of this update.'),'No-tracking carrier update must state current fact only');
assert(batch4.includes("replace(/\\s*We[’']ll share tracking details if they become available"),'Batch 4 must strip the old future tracking promise');

// Existing multi-record / empty / overdue machinery must still exist in the accepted source.
assert(base.includes('function queueData()'),'Workflow must derive all active records into stage data');
assert(base.includes("No active quote or order work."),'Workflow must retain a clear all-empty state');
assert(base.includes("Customer update overdue"),'Existing dated customer promises must retain overdue alerts');
assert(base.includes('function sortActionAlerts(alerts)'),'Action alerts must retain deterministic priority sorting');
assert(base.includes('(severity[a.severity]??3)-(severity[b.severity]??3)'),'Severity must remain the first sort key');
assert(base.includes('(Number.isFinite(a.dueAt)?a.dueAt:Number.MAX_SAFE_INTEGER)'),'Due time must remain the next sort key');

console.log('R5H Batch 4 lease/message truth regression: PASS');
