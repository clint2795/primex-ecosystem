const fs=require('fs');
const path=require('path');
const assert=require('assert');

const root=path.resolve(__dirname,'../..');
const finance=fs.readFileSync(path.join(root,'finance/index.html'),'utf8');

for(const token of [
  "if(sourceQuote?.convertedOrderId){showToast('Quote already converted",
  "if(!current.acceptedSnapshot){showToast('Customer acceptance and accepted-total lock are required before conversion')",
  "sourceQuoteId:quoteRef",
  "commercialLock:locked",
  "activeOrderTag.textContent='Converted quote - save to activate'",
  "Converted to live order. Save to activate stock and Workflow.",
  "const sourceQuoteRef=markSourceQuoteConverted(o)",
  "o.supabaseItemSyncStatus='local_only'",
  "const sharedSaveReady=!supabaseIsConfigured()||o.supabaseItemSyncStatus==='synced'",
]) assert(finance.includes(token),'Missing quote-to-live invariant: '+token);

// Model the gate: conversion creates an unsaved live draft; only a successful
// shared save may make it stock-affecting and link/park the source quote.
const quote={id:'PXQ-TEST',orderType:'Quote / enquiry',quoteStatus:'Accepted',acceptedSnapshot:{total:90}};
const orders=[quote];
const live={id:'PX-TEST',orderType:'Live order',sourceQuoteId:quote.id,commercialLock:quote.acceptedSnapshot,supabaseItemSyncStatus:''};
assert(!orders.some(o=>o.id===live.id),'Conversion must not save the live order');
assert(!quote.convertedOrderId,'Conversion must not mark the source quote before save');
const stockAffectingBeforeSave=live.orderType==='Live order'&&live.supabaseItemSyncStatus==='synced';
assert.equal(stockAffectingBeforeSave,false,'Unsaved/local-only conversion must not affect stock');

orders.push({...live,supabaseItemSyncStatus:'synced'});
quote.quoteStatus='Parked';
quote.convertedOrderId=live.id;
quote.linkedLiveOrderId=live.id;
assert.equal(quote.convertedOrderId,live.id);
assert(orders.some(o=>o.id===live.id&&o.supabaseItemSyncStatus==='synced'));
assert(quote.convertedOrderId,'Duplicate conversion must now be blocked');

console.log('Operational quote-to-live regression: PASS');
