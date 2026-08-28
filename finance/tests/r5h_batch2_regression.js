#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const assert=require('assert');

const root=path.resolve(__dirname,'../..');
const batch2Path=path.join(root,'finance-operator-layout-review','r5h-batch2.js');
const batch1Path=path.join(root,'finance-operator-layout-review','r5h-batch1.js');
const batch2=fs.readFileSync(batch2Path,'utf8');
const batch1=fs.readFileSync(batch1Path,'utf8');

// Syntax must parse as a classic browser script.
assert.doesNotThrow(()=>new Function(batch2),'r5h-batch2.js must parse');

// Protected-review containment / loader.
assert(batch2.includes("location.pathname.includes('/finance-operator-layout-review/')"),'Batch 2 must remain route-guarded');
assert(batch1.includes("/finance-operator-layout-review/r5h-batch2.js?v=1"),'Batch 1 must load Batch 2 on the protected route');

// Payment reconciliation evidence.
for(const token of ['paymentReceivedAmount','paymentReceivedAt','paymentReference','paymentRecordedBy']){
  assert(batch2.includes(token),'Missing payment evidence field: '+token);
}
assert(batch2.includes("payload.payment==='Part paid'&&total>0&&amount>=total"),'Part-paid guard missing');
assert(batch2.includes("payload.payment==='Paid'&&total>0&&amount<total"),'Paid-under-total guard missing');
assert(batch2.includes("releaseApprovedBy=op.label"),'Unpaid release must record the authenticated operator');
assert(batch2.includes('releaseOverrideReason'),'Unpaid release reason must be recorded');
assert(!batch2.includes("releaseApprovedBy=o.releaseApprovedBy||'Manual override'"),'Batch 2 must not self-authorise as Manual override');

// Final handover truth.
assert(batch2.includes("return 'trackingUpdateStatus'"),'Post-handover required update must use the final handover/tracking status');
assert(batch2.includes("PrimeX BioLabs - Collection Complete"),'Customer collection completion wording missing');
assert(batch2.includes("Your order has been collected."),'Customer collection must not be described as dispatch');
assert(batch2.includes("PrimeX BioLabs - Drop-off Complete"),'Local drop-off completion wording missing');
assert(batch2.includes("Your order has been delivered by local drop-off."),'Local drop-off must not be described as carrier dispatch');
assert(batch2.includes("if(!requiredCustomerUpdateSent(o))"),'Mark complete must be gated by required customer communication');

// Sent-state persistence and cross-operator History truth.
assert(batch2.includes("persistCurrentCommunicationSoon('Customer communication status saved')"),'Communication sent state must persist automatically');
assert(batch2.includes("syncExistingCloudOrder(id,'Order bin state saved in shared Finance')"),'Order bin must sync when cloud-backed');
assert(batch2.includes("syncExistingCloudOrder(id,'Order restore saved in shared Finance')"),'Order restore must sync when cloud-backed');

console.log('R5H Batch 2 regression guard: PASS');
