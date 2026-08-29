#!/usr/bin/env node
'use strict';

const fs=require('fs');
const assert=require('assert');

const base=fs.readFileSync('finance-operator-layout-review/index.html','utf8');
const batch2=fs.readFileSync('finance-operator-layout-review/r5h-batch2.js','utf8');
const batch4=fs.readFileSync('finance-operator-layout-review/r5h-batch4.js','utf8');

function between(text,start,end){const a=text.indexOf(start);assert(a>=0,'Missing section start: '+start);const b=text.indexOf(end,a+start.length);assert(b>a,'Missing section end after: '+start);return text.slice(a,b)}

const confirmation=between(base,'function generateConfirmation(){','function titleCaseLine');
const availability=between(base,'function quoteAvailabilityCustomerText(){','function communicationStatusDefaults');
const fulfilment=between(base,'function fulfilmentMessageBody(type,o){','function writeCustomerUpdate');
const payment=between(batch4,'window.generatePaymentRequest=function(){','window.setCommStatus=function');
const trackingOverride=between(batch2,'window.fulfilmentMessageBody=function(type,o){','function postHandoverCopy');

// Quote body: itemised commercial facts, truthful availability and one clear reply action.
for(const token of ['Your quote is below.','Products: ','Postage: ','Total: ','To proceed, reply CONFIRM.'])assert(confirmation.includes(token),'Quote body missing: '+token);
assert(confirmation.includes('quoteAvailabilityCustomerText()'),'Quote body must include the current availability output');
assert(!confirmation.includes('Availability, fulfilment, payment, and dispatch details are confirmed separately'),'Retired vague quote wording must not return');

// Final live-order body: agreed items, total, payment truth and fulfilment truth.
for(const token of ['Your order is confirmed:','Final items:','Order total:','Payment received','Payment is still outstanding','Delivery / collection:'])assert(confirmation.includes(token),'Order confirmation missing: '+token);

// Availability promises must carry the recorded deadline when timing is uncertain.
assert(availability.includes('We’ll update you again by '),'Uncertain availability must include the dated update promise');
assert(availability.includes("if(mode==='confirming'"),'Dispatch-date-confirming path missing');

// Payment request: no fake checkout link and the separate-instructions promise is now dated.
assert(payment.includes('Payment instructions will be sent separately by '),'Payment instructions deadline missing from customer body');
assert(payment.includes('No online checkout link is included in this message.'),'Payment body must not imply an online checkout');
assert(payment.includes('formatPromiseDate(due)'),'Payment promise must be generated from the recorded deadline');

// Fulfilment stage bodies remain distinct.
for(const token of ['Preparation Update','Packed Update','Ready for Collection','Ready for Dispatch','Availability Update'])assert(fulfilment.includes(token),'Fulfilment customer body missing stage: '+token);

// Final handover route truth for all supported routes.
for(const token of ['Collection Complete','Drop-off Complete','collected by Royal Mail','handed over for Royal Mail delivery','handed over to the courier'])assert(trackingOverride.includes(token),'Final handover wording missing: '+token);
assert(batch4.includes('No tracking/reference is available at the time of this update.'),'No-tracking handover must state a present fact rather than promise future tracking');

// Customer generator sections must not leak internal workflow/source strategy language.
for(const [name,section] of [['quote/order confirmation',confirmation],['payment request',payment],['fulfilment templates',fulfilment],['tracking overrides',trackingOverride]]){
  for(const forbidden of ['sourceRequestId','sourceRequestMeta','supplier planning','internal strategy'])assert(!section.includes(forbidden),name+' leaks internal token: '+forbidden);
}

// Immutable customer safety footer remains present in the shared generator path.
assert(base.includes("function customerMessageFooter(){return 'Research Use Only. Not for human or animal use. Not a medicine.'}"),'Customer RUO footer changed or missing');

console.log('R5H outbound customer body audit: PASS');
