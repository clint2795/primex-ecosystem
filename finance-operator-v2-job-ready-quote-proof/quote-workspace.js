import {createQuoteDomainAdapter} from './quote-domain-adapter.js';
import {createIsolatedQuoteEnginePort} from './quote-engine-port.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=value=>'£'+Number(value||0).toFixed(2);
const qty=line=>Math.max(1,Math.floor(Number(line?.qty||1)));
const extended=line=>Number(line?.price||0)*(['product','structure'].includes(line?.kind)?qty(line):1);

function phase(state){
  if(!state?.isQuote)return state?.liveOrderSaved?'payment':'save-order';
  if(state.acceptedSnapshot)return 'convert';
  if(state.quoteStatus==='Quote sent / waiting customer')return 'accept';
  if(state.handoffEvidence)return 'record-sent';
  if(state.messagePrepared&&state.messageCurrent)return 'handoff';
  if(state.approvalCurrent)return 'message';
  if(!state.savedCurrent)return 'save-draft';
  return state.id?'approve':'start';
}

function actionMarkup(state){
  const current=phase(state);
  const actions={
    start:['Build isolated quote','Load the protected request fixture to begin the quote.','Start quote','request'],
    'save-draft':['Save authoritative draft','Persist this commercial revision before it can be approved.','Save draft','saveDraft'],
    approve:['Approve commercial position','Confirm the authoritative products, prices, availability and total.','Approve quote','approve'],
    message:['Prepare customer quote','Generate the customer message from this approved revision.','Prepare message','prepareMessage'],
    handoff:['Review deliberate handoff','Choose the channel used for the proof-only customer handoff.','Prepare WhatsApp','handoff:whatsapp'],
    'record-sent':['Record sent evidence','The handoff is prepared. Record only after the message has been reviewed.','Record as sent','recordSent'],
    accept:['Record customer acceptance','The quote is sent and waiting. Lock the accepted commercial snapshot.','Record acceptance','recordAcceptance'],
    convert:['Convert accepted quote','Create the linked proof-only live order from the locked snapshot.','Convert to order','convert'],
    'save-order':['Save linked live order','Complete the protected conversion before moving to Payment.','Save live order','saveConvertedOrder'],
    payment:['Quote work complete','The linked live order is saved. Payment is now the next Customer Job stage.','Open payment stage','complete']
  };
  const [title,copy,label,command]=actions[current];
  const secondary=current==='handoff'?'<button class="px-button quiet" data-handoff="email">Use email</button><button class="px-button quiet" data-handoff="copy">Copy only</button>':'';
  const primary=command==='complete'?'<button class="px-button primary" data-complete="true">'+label+'</button>':command.startsWith('handoff:')?'<button class="px-button primary" data-handoff="'+command.split(':')[1]+'">'+label+'</button>':'<button class="px-button primary" data-command="'+command+'">'+label+'</button>';
  return `<div class="action-copy"><div class="ledger-label">Next action</div><h3>${title}</h3><p>${copy}</p></div><div class="action-set">${secondary}${primary}</div>`;
}

export async function createQuoteWorkspace(root,{onState=()=>{},onComplete=()=>{}}={}){
  root.innerHTML=`<section class="quote-shell"><iframe class="engine-frame" title="Protected Finance authority" sandbox="allow-scripts allow-modals" aria-hidden="true" tabindex="-1"></iframe><div class="quote-head"><div><div class="quote-kicker">Commercial record</div><h2 data-title>New quote</h2><p data-subtitle>Protected Finance authority loading</p></div><div class="quote-total"><span>Quote total</span><strong data-head-total>£0.00</strong></div></div><div class="quote-ledger"><div class="ledger-head"><span>Product</span><span>Qty</span><span>Unit price</span><span>Line total</span></div><div data-lines></div></div><div class="quote-totals" data-totals></div><div class="quote-controls" data-controls></div><div class="workspace-notice" data-notice aria-live="polite">Starting protected quote fixture…</div><details class="message-evidence"><summary>Customer message evidence</summary><div class="message-copy" data-message>No message prepared.</div></details></section>`;
  const frame=root.querySelector('iframe'),title=root.querySelector('[data-title]'),subtitle=root.querySelector('[data-subtitle]'),headTotal=root.querySelector('[data-head-total]'),lines=root.querySelector('[data-lines]'),totals=root.querySelector('[data-totals]'),controls=root.querySelector('[data-controls]'),notice=root.querySelector('[data-notice]'),message=root.querySelector('[data-message]');
  const port=await createIsolatedQuoteEnginePort(frame),adapter=createQuoteDomainAdapter(port);
  const paint=()=>{
    const state=adapter.read()||{},quoteLines=Array.isArray(state.lines)?state.lines:[];
    title.textContent=state.id?`Quote ${state.id}`:'New quote';
    subtitle.textContent=`Revision ${state.quoteApproval?.revision||1} · ${state.authorityVersion||'Authority unavailable'} · ${state.tier||'standard'} pricing`;
    headTotal.textContent=money(state.total);
    lines.innerHTML=quoteLines.length?quoteLines.map(line=>`<div class="ledger-row"><div class="line-name"><strong>${esc(line.name||'Quote line')}</strong><small>${esc(line.pid||line.sid||line.priceSource||'Authoritative product')}</small></div><span class="line-number" data-label="Qty">${qty(line)}</span><span class="line-number" data-label="Unit">${money(line.price)}</span><span class="line-number line-total" data-label="Line">${money(extended(line))}</span></div>`).join(''):'<div class="ledger-empty">No product lines are present in this quote.</div>';
    const productTotal=quoteLines.reduce((sum,line)=>sum+extended(line),0),materials=Number(state.materialsCharge||0),postage=Number(state.postageCharge||0);
    totals.innerHTML=`<div class="total-row"><span>Products</span><strong>${money(productTotal)}</strong></div>${materials?`<div class="total-row"><span>Materials</span><strong>${money(materials)}</strong></div>`:''}<div class="total-row"><span>Postage</span><strong>${postage?money(postage):'Not charged'}</strong></div><div class="total-row grand"><span>Total</span><strong>${money(state.total)}</strong></div>`;
    controls.innerHTML=actionMarkup(state);
    message.textContent=state.confirmationMsg||'No customer message has been prepared for this revision.';
    if(state.sentEvidence){notice.textContent=state.isQuote?'Sent evidence is recorded against this quote.':'Source quote evidence remains linked to the live order.';notice.className='workspace-notice good'}
    else if(state.handoffEvidence){notice.textContent=`${state.handoffEvidence.channel} handoff prepared in this isolated proof. Nothing was sent.`;notice.className='workspace-notice attention'}
    else{notice.textContent='Protected proof · no shared writes, stock changes or customer contact.';notice.className='workspace-notice'}
    onState(state);
  };
  const run=async(label,operation)=>{notice.textContent=label+'…';notice.className='workspace-notice';root.querySelectorAll('button').forEach(button=>button.disabled=true);try{await operation();paint()}catch(error){notice.textContent=error.message;notice.className='workspace-notice attention'}finally{root.querySelectorAll('button').forEach(button=>button.disabled=false)}};
  root.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.complete){onComplete();return}if(button.dataset.handoff)run('Preparing proof-only handoff',()=>adapter.prepareHandoff(button.dataset.handoff));else if(button.dataset.command==='request')run('Opening isolated request',()=>adapter.newQuote('request'));else if(button.dataset.command)run('Applying '+button.textContent.trim(),()=>adapter[button.dataset.command]())});
  await adapter.newQuote('request');paint();
  return {adapter,refresh:async()=>{await port.refresh();paint()},destroy:()=>port.destroy()};
}
