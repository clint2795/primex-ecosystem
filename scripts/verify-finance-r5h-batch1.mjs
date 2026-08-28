import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(condition,message){if(!condition)throw new Error(message)}

const candidate=read('finance-operator-layout-review/index.html');
const patch=read('finance-operator-layout-review/r5h-batch1.js');
const config=read('finance/config.js');

// Accepted source must still contain the real commercial-lock and sync machinery this patch reuses.
[
  'function markCurrentQuoteAccepted()',
  'current.acceptedSnapshot={...accepted',
  "recordCommercialAudit('accepted-total-lock'",
  'function convertCurrentQuoteToLive()',
  "if(!current.acceptedSnapshot){showToast('Customer acceptance and accepted-total lock are required before conversion')",
  'function autoSyncSavedQuoteOrder(orderId)',
  'function persistWorkflowChange(o,message)'
].forEach(token=>assert(candidate.includes(token),'Accepted R5G source missing required R5H dependency: '+token));

// Batch 1 must be isolated to the protected review route.
assert(patch.includes("if(!location.pathname.includes('/finance-operator-layout-review/')) return;"),'R5H patch route guard missing');
assert(config.includes("if(!location.pathname.includes('/finance-operator-layout-review/')) return;"),'R5H loader route guard missing');
assert(config.includes("/finance-operator-layout-review/r5h-batch1.js?v=1"),'R5H patch loader missing');

// Workflow/History acceptance shortcut must be intercepted and routed through the real accepted-total lock path.
assert(patch.includes("field==='quoteStatus'&&value==='Customer replied / ready to convert'"),'Quote-acceptance shortcut interception missing');
assert(patch.includes('markCurrentQuoteAccepted();'),'Proper accepted-total lock path is not used');

// Quote cancellation must update quote lifecycle truth and persist through the normal save/online-backup path.
assert(patch.includes("set('quoteStatus','Cancelled')"),'Quote cancellation does not set quote status');
assert(patch.includes("set('orderStatus','Cancelled')"),'Quote cancellation does not align order status');
assert(patch.includes('saveOrderNow().then'),'Quote cancellation does not use the normal persisted save path');
assert(patch.includes("voidButton.textContent=isQuote?'Cancel quote':'Cancel / void order'"),'Quote-aware cancel label missing');
assert(patch.includes("archiveButton&&isQuote")&&patch.includes("archiveButton.style.display='none'"),'Normal Mark complete control is not suppressed for quotes');

// Live cancellation from both the open order and Workflow must attempt shared online backup.
assert(patch.includes('function syncCancelledRecord(id)'),'Shared cancellation sync helper missing');
assert(patch.includes("o.supabaseItemSyncStatus='local_only'"),'Cancelled record is not marked for retryable online backup');
assert(patch.includes('autoSyncSavedQuoteOrder(o.id)'),'Cancelled record does not attempt online backup');
assert(patch.includes('window.voidCurrentOrder=function()'),'Open-order cancellation guard missing');
assert(patch.includes('window.voidOrderById=function(id)'),'Workflow cancellation guard missing');

console.log('R5H Batch 1 regression OK');
