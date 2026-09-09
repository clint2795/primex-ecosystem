import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createQuoteDomainAdapter} from '../finance-operator-v2-job-ready-quote-proof/quote-domain-adapter.js';
const base=()=>({id:'Q-1',isQuote:true,readOnly:false,quoteStatus:'Quote to send',approvalCurrent:false,quoteApproval:null,acceptedSnapshot:null,commercialLock:null,convertedOrderId:'',messagePrepared:false,messageCurrent:false});
function harness(){
 let state=base(),saved=null;const calls=[];
 const port={read:()=>state,readSaved:()=>saved,list:()=>saved?[saved]:[],async command(name,payload){calls.push(name);switch(name){
 case 'newQuote':state=base();return true;
 case 'open':state={...state,id:payload};return true;
 case 'saveDraft':saved=structuredClone({...state,confirmation:saved?.confirmation||'No'});return true;
 case 'approve':state.quoteApproval={fingerprint:'fp1'};state.approvalCurrent=true;saved=structuredClone(state);return true;
 case 'prepareMessage':state.messagePrepared=true;state.messageCurrent=true;return true;
 case 'recordAcceptance':state.acceptedSnapshot={total:80,quoteRef:state.id};state.quoteStatus='Customer replied / ready to convert';return true;
 case 'convert':state={...state,id:'O-1',isQuote:false,sourceQuoteId:'Q-1',commercialLock:state.acceptedSnapshot};return true;
 case 'saveConvertedOrder':saved=structuredClone(state);return true;
 default:throw Error('Unexpected command '+name);
 }};
 return{adapter:createQuoteDomainAdapter(port),calls,set:s=>{state=s},get:()=>state,save:s=>{saved=s}};
}
test('draft saving delegates to authority and retains source identity',async()=>{const h=harness();await h.adapter.saveDraft();assert.deepEqual(h.calls,['saveDraft']);assert.equal(h.adapter.read().id,'Q-1')});
test('accepted or read-only records cannot be edited',async()=>{const h=harness();h.set({...base(),readOnly:true});await assert.rejects(()=>h.adapter.saveDraft(),/read-only/);h.set({...base(),acceptedSnapshot:{total:80}});await assert.rejects(()=>h.adapter.approve(),/locked/);assert.equal(h.calls.length,0)});
test('message preparation requires a saved matching approval',async()=>{const h=harness();await assert.rejects(()=>h.adapter.prepareMessage(),/Approve/);h.set({...base(),approvalCurrent:true,quoteApproval:{fingerprint:'new'}});h.save({...base(),quoteApproval:{fingerprint:'old'}});await assert.rejects(()=>h.adapter.prepareMessage(),/Save/);assert.equal(h.calls.length,0)});
test('customer acceptance requires saved sent evidence and current message',async()=>{const h=harness();const s={...base(),approvalCurrent:true,quoteApproval:{fingerprint:'fp1'},quoteStatus:'Quote sent / waiting customer',messageCurrent:true};h.set(s);h.save({...s,confirmation:'No'});await assert.rejects(()=>h.adapter.recordAcceptance(),/actual customer message/);h.save({...s,confirmation:'Yes'});h.set({...s,messageCurrent:false});await assert.rejects(()=>h.adapter.recordAcceptance(),/current/);h.set(s);await h.adapter.recordAcceptance();assert.equal(h.adapter.read().acceptedSnapshot.total,80);assert.deepEqual(h.calls,['recordAcceptance'])});
test('conversion preserves locked source and requires separate save',async()=>{const h=harness();h.set({...base(),acceptedSnapshot:{total:80,quoteRef:'Q-1'}});await h.adapter.convert();assert.equal(h.adapter.read().sourceQuoteId,'Q-1');assert.equal(h.calls.includes('saveConvertedOrder'),false);await h.adapter.saveConvertedOrder();assert.equal(h.adapter.list()[0].sourceQuoteId,'Q-1')});
test('a second conversion is blocked before reaching the engine',async()=>{const h=harness();h.set({...base(),acceptedSnapshot:{total:80},convertedOrderId:'O-1'});await assert.rejects(()=>h.adapter.convert(),/already converted/);assert.equal(h.calls.length,0)});
test('failed authority operation cannot be reported as a success',async()=>{const h=harness();h.set({...base(),approvalCurrent:true,quoteApproval:{fingerprint:'fp1'}});h.save({...base(),quoteApproval:{fingerprint:'fp1'}});await assert.rejects(()=>h.adapter.prepareMessage(),/did not confirm/);assert.equal(h.adapter.busy,false)});
test('the actual protected source retains its commercial and message guards',()=>{const html=fs.readFileSync('finance-operator-layout-review/index.html','utf8');const source=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n');new vm.Script(source);for(const fn of ['approveCurrentQuote','markCurrentQuoteAccepted','convertCurrentQuoteToLive','startSendQuoteWorkflow','saveOrderNow','claimSharedOrderForEdit'])assert.match(source,new RegExp('function\\s+'+fn+'\\s*\\('));assert.match(source,/acceptedSnapshot/);assert.match(source,/commercialFingerprint/);assert.match(source,/customerMessageDependencyFingerprint/);const adapter=fs.readFileSync('finance-operator-v2-job-ready-quote-proof/quote-domain-adapter.js','utf8');assert.doesNotMatch(adapter,/PRODUCT_RULES|priceTier\s*=|stock\s*\[|quickQuoteUpdate/)});
