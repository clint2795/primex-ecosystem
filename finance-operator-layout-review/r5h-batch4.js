// PrimeX Finance HQ R5H Batch 4 — protected lease heartbeat and customer-promise truth.
(function primeXR5HBatch4(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(window.__PX_R5H_BATCH4__) return;
  window.__PX_R5H_BATCH4__=true;

  const originalLoadOrder=window.loadOrder;
  const originalNewOrder=window.newOrder;
  const originalSetCommStatus=window.setCommStatus;
  const originalOrderPayload=window.orderPayload;
  const originalGeneratePaymentRequest=window.generatePaymentRequest;
  const originalCustomerMessageDependencyFingerprint=window.customerMessageDependencyFingerprint;
  const originalFulfilmentMessageBody=window.fulfilmentMessageBody;
  const originalDeriveActionAlerts=window.deriveActionAlerts;
  const originalRenderCommunicationCentre=window.renderCommunicationCentre;

  const LEASE_MINUTES=10;
  const LEASE_RENEW_MS=4*60*1000;
  let leaseTimer=null;
  let leaseRecordId='';
  let leaseRenewing=false;

  function field(id){return document.getElementById(id)}
  function fieldValue(id){return String(field(id)?.value||'').trim()}
  function setField(id,value){const el=field(id);if(el)el.value=value??''}
  function activeOperator(){
    try{
      const p=supabaseAuthState?.profile;
      if(!p||p.active!==true)return null;
      const label=String(p.display_name||supabaseAuthState?.user?.email||'').trim();
      return label?{label,role:String(p.role||'').trim()}:null;
    }catch(_){return null}
  }
  function localInputFromIso(value){const d=value?new Date(value):null;if(!d||Number.isNaN(d.getTime()))return '';const pad=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
  function isoFromLocalInput(value){const d=value?new Date(value):null;return d&&!Number.isNaN(d.getTime())?d.toISOString():''}
  function futureDate(value){const d=value?new Date(value):null;return d&&!Number.isNaN(d.getTime())&&d.getTime()>Date.now()?d:null}
  function formatPromiseDate(value){const d=value instanceof Date?value:new Date(value);if(!d||Number.isNaN(d.getTime()))return '';return new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hour12:false}).format(d).replace(',', ' at')}

  function ensurePaymentInstructionFields(){
    if(field('paymentInstructionsDueAt'))return;
    const evidence=field('r5hBatch2Evidence');
    if(!evidence)return;
    const block=document.createElement('div');
    block.id='r5hBatch4PaymentInstructions';
    block.className='grid two full';
    block.style.marginTop='10px';
    block.innerHTML=`
      <div class="field"><label>Payment instructions</label><select id="paymentInstructionsStatus"><option value="not_sent">Not sent</option><option value="sent">Sent</option></select><span class="tiny">Tracks the separate bank/payment instructions promised in the customer payment request.</span></div>
      <div class="field"><label>Instructions due by</label><input id="paymentInstructionsDueAt" type="datetime-local"><span class="tiny">Required before the payment-request message can be marked sent.</span></div>
      <div class="field"><label>Instructions owner</label><input id="paymentInstructionsOwner" readonly placeholder="Finance login"></div>
      <div class="field"><label>Instructions sent at</label><input id="paymentInstructionsSentAt" readonly placeholder="Not sent"></div>`;
    evidence.appendChild(block);
    field('paymentInstructionsDueAt')?.addEventListener('change',()=>{
      if(fieldValue('paymentInstructionsDueAt')){
        const op=activeOperator();
        if(op&&!fieldValue('paymentInstructionsOwner'))setField('paymentInstructionsOwner',op.label);
      }
      markCustomerUpdateStale();
    });
    field('paymentInstructionsStatus')?.addEventListener('change',()=>{
      if(fieldValue('paymentInstructionsStatus')==='sent')void window.r5hMarkPaymentInstructionsSent();
    });
  }

  function populatePaymentInstructions(o={}){
    ensurePaymentInstructionFields();
    setField('paymentInstructionsStatus',o.paymentInstructionsStatus||'not_sent');
    setField('paymentInstructionsDueAt',localInputFromIso(o.paymentInstructionsDueAt||''));
    setField('paymentInstructionsOwner',o.paymentInstructionsOwner||'');
    setField('paymentInstructionsSentAt',o.paymentInstructionsSentAt?new Date(o.paymentInstructionsSentAt).toLocaleString():'');
  }

  function paymentInstructionPayload(base){
    ensurePaymentInstructionFields();
    base.paymentInstructionsStatus=fieldValue('paymentInstructionsStatus')||'not_sent';
    base.paymentInstructionsDueAt=isoFromLocalInput(fieldValue('paymentInstructionsDueAt'));
    base.paymentInstructionsOwner=fieldValue('paymentInstructionsOwner');
    base.paymentInstructionsSentAt=base.paymentInstructionsStatus==='sent'?(orders.find(x=>x.id===base.id)?.paymentInstructionsSentAt||current.paymentInstructionsSentAt||''):'';
    return base;
  }

  window.orderPayload=function(){return paymentInstructionPayload(originalOrderPayload.apply(this,arguments))};

  window.loadOrder=async function(id){
    const result=await originalLoadOrder.apply(this,arguments);
    if(current?.id===id){
      const o=orders.find(x=>x.id===id)||{};
      populatePaymentInstructions(o);
      if(current.supabaseOrderId&&!current.cloudReadOnly)startLeaseHeartbeat(id);
      else stopLeaseHeartbeat();
    }
    return result;
  };
  window.newOrder=function(){stopLeaseHeartbeat();const result=originalNewOrder.apply(this,arguments);populatePaymentInstructions({});return result};

  function saveLeaseMetadata(id,row){
    const values={cloudClaimedBy:row.claimed_by||'',cloudClaimExpiresAt:row.claim_expires_at||'',cloudRowVersion:Number(row.row_version||1),cloudReadOnly:false};
    const o=orders.find(x=>x.id===id);if(o)Object.assign(o,values);
    if(current?.id===id)Object.assign(current,values);
    saveLocal();
  }
  function markLeaseLost(id){
    stopLeaseHeartbeat();
    const o=orders.find(x=>x.id===id);if(o)o.cloudReadOnly=true;
    if(current?.id===id){current.cloudReadOnly=true;renderOrder();activeOrderTag.textContent='Read-only · '+id}
    saveLocal();
    setOrderDbSyncStatus('Shared edit lock expired and is now owned elsewhere. Local unsynced changes are preserved; reopen the latest shared record before continuing.','warn');
    showToast('Shared edit lock lost - record is now read-only');
  }
  async function renewLease(){
    if(leaseRenewing||!leaseRecordId||current?.id!==leaseRecordId||!current?.supabaseOrderId||current?.cloudReadOnly)return false;
    leaseRenewing=true;
    try{
      const auth=await currentSupabaseWriteUser();
      if(!auth){setOrderDbSyncStatus('Could not renew the shared edit lock because Finance is logged out. Local work remains on this device; reconnect before relying on shared save.','warn');return false}
      const claim=await auth.client.rpc('claim_quote_order',{p_order_id:current.supabaseOrderId,p_lease_minutes:LEASE_MINUTES});
      if(claim.error)throw new Error(claim.error.message);
      const row=(claim.data||[])[0];
      if(!row){markLeaseLost(leaseRecordId);return false}
      saveLeaseMetadata(leaseRecordId,row);
      return true;
    }catch(err){
      console.warn('Shared edit-lock renewal failed',err);
      setOrderDbSyncStatus('Shared edit lock could not be renewed. Local work is preserved; retry the shared connection before a long edit continues. '+(err?.message||''),'warn');
      return false;
    }finally{leaseRenewing=false}
  }
  function startLeaseHeartbeat(id){
    stopLeaseHeartbeat();leaseRecordId=id;
    leaseTimer=setInterval(()=>{if(document.visibilityState==='visible')void renewLease()},LEASE_RENEW_MS);
  }
  function stopLeaseHeartbeat(){if(leaseTimer)clearInterval(leaseTimer);leaseTimer=null;leaseRecordId=''}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&leaseRecordId)void renewLease()});
  window.addEventListener('focus',()=>{if(leaseRecordId)void renewLease()});

  function paymentPromiseReady(){
    ensurePaymentInstructionFields();
    const due=futureDate(fieldValue('paymentInstructionsDueAt'));
    let owner=fieldValue('paymentInstructionsOwner');
    if(!owner){const op=activeOperator();if(op){owner=op.label;setField('paymentInstructionsOwner',owner)}}
    if(!due){showToast('Set a future deadline for sending the separate payment instructions');field('paymentInstructionsDueAt')?.focus();return false}
    if(!owner){showToast('Finance login required to own the payment-instructions follow-up');return false}
    return true;
  }

  window.customerMessageDependencyFingerprint=function(kind){
    const base=originalCustomerMessageDependencyFingerprint.apply(this,arguments);
    if(kind!=='fulfilment')return base;
    return base+'|paymentInstructionsDueAt='+fieldValue('paymentInstructionsDueAt')+'|paymentInstructionsOwner='+fieldValue('paymentInstructionsOwner');
  };

  window.generatePaymentRequest=function(){
    const o=window.orderPayload();
    if(o.orderType!=='Live order'){showToast('Payment requests can only be generated for a live order');return false}
    if(!o.lines.length){showToast('Add at least one final line before requesting payment');return false}
    if(isPaymentCleared(o)){showToast('Payment is already cleared - no request generated');return false}
    if(!paymentPromiseReady())return false;
    if(!confirm('Confirm the operator has agreed the final order contents with the customer. Generate the payment request now?')){showToast('Payment request cancelled - final contents were not confirmed');return false}
    const due=futureDate(fieldValue('paymentInstructionsDueAt'));
    const msg='PrimeX BioLabs - Payment Request\n\n'+customerMessageGreeting(o)+'Your final order contents are confirmed:\n\n'+customerSafeLineItems(o)+'\n\nOrder total: '+money(o.total)+'\nOrder reference: '+customerSafeReference(o)+'\n\nPayment instructions will be sent separately by '+formatPromiseDate(due)+'. No online checkout link is included in this message. Please wait for those instructions before paying. Your order will move forward once payment arrangements are confirmed.\n\n'+customerMessageFooter();
    writeCustomerUpdate(msg,'Payment request ready. Send it, then complete the dated payment-instructions task and mark both actions sent.','payment-request');
    setCommStatus('paymentMessageStatus','generated');
    return true;
  };

  window.setCommStatus=function(key,status){
    if(key==='paymentMessageStatus'&&['sent','alreadySent'].includes(status)&&!paymentPromiseReady())return false;
    return originalSetCommStatus.apply(this,arguments);
  };

  window.r5hMarkPaymentInstructionsSent=async function(){
    ensurePaymentInstructionFields();
    const op=activeOperator();
    if(!op){showToast('Finance login required to record payment instructions sent');setField('paymentInstructionsStatus','not_sent');return false}
    setField('paymentInstructionsStatus','sent');
    setField('paymentInstructionsOwner',op.label);
    const sentAt=new Date().toISOString();
    current.paymentInstructionsSentAt=sentAt;
    setField('paymentInstructionsSentAt',new Date(sentAt).toLocaleString());
    const snapshot=window.orderPayload();snapshot.paymentInstructionsSentAt=sentAt;
    const idx=orders.findIndex(x=>x.id===snapshot.id);
    if(idx<0){showToast('Save the order before recording payment instructions sent');return false}
    orders[idx]=snapshot;
    persistWorkflowChange(snapshot,'Payment instructions marked sent');
    return true;
  };

  function paymentInstructionAlert(o){
    if(!isActiveOrderType(o)||isBinned(o)||isPaymentCleared(o))return null;
    const comm=o.commStatus||{};
    if(!['sent','alreadySent'].includes(comm.paymentMessageStatus||o.paymentMessageStatus||''))return null;
    if(o.paymentInstructionsStatus==='sent')return null;
    const due=o.paymentInstructionsDueAt?new Date(o.paymentInstructionsDueAt):null;
    if(!due||Number.isNaN(due.getTime()))return {id:'payment-instructions-'+o.id,sourceId:o.id,sourceType:'order',severity:'critical',category:'Payment',title:'Set payment-instructions deadline',message:orderLabel(o)+' promised separate payment instructions but has no recorded deadline.',actionTarget:'order',task:'payment',status:'open',dueAt:0};
    const overdue=due.getTime()<=Date.now(),soon=due.getTime()<=Date.now()+86400000;
    return {id:'payment-instructions-'+o.id,sourceId:o.id,sourceType:'order',severity:overdue?'critical':(soon?'warning':'info'),category:'Payment',title:overdue?'Payment instructions overdue':'Send payment instructions',message:orderLabel(o)+' payment instructions are owned by '+(o.paymentInstructionsOwner||'unassigned')+' and due '+formatPromiseDate(due)+'.',actionTarget:'order',task:'payment',status:'open',dueAt:due.getTime()};
  }
  window.deriveActionAlerts=function(){
    const alerts=originalDeriveActionAlerts.apply(this,arguments);
    const existing=new Set(alerts.map(a=>a.id));
    dashboardOrders().filter(isOpenWork).forEach(o=>{const alert=paymentInstructionAlert(o);if(alert&&!existing.has(alert.id))alerts.push(alert)});
    return sortActionAlerts(alerts);
  };

  window.fulfilmentMessageBody=function(type,o){
    const result=originalFulfilmentMessageBody.apply(this,arguments);
    if(type!=='tracking'||!Array.isArray(result))return result;
    const tracking=String(o?.tracking||o?.trackingRef||'').trim();
    if(tracking)return result;
    const method=String(o?.fulfilment||'');
    if(['Royal Mail collection','Royal Mail postage','Courier collection'].includes(method)){
      return [result[0],String(result[1]||'').replace(/\s*We[’']ll share tracking details if they become available\.?/i,'')+'\n\nNo tracking/reference is available at the time of this update.'];
    }
    return result;
  };

  function injectPaymentInstructionTask(){
    ensurePaymentInstructionFields();
    const o=window.orderPayload();
    const comm=o.commStatus||{};
    if(isPaymentCleared(o)||!['sent','alreadySent'].includes(comm.paymentMessageStatus||o.paymentMessageStatus||'')||o.paymentInstructionsStatus==='sent')return;
    const list=document.getElementById('communicationRows');if(!list||list.querySelector('[data-comm-key="paymentInstructionsFollowup"]'))return;
    const due=o.paymentInstructionsDueAt?formatPromiseDate(o.paymentInstructionsDueAt):'deadline required';
    const row=document.createElement('div');row.className='comm-row action-ready';row.dataset.commKey='paymentInstructionsFollowup';
    row.innerHTML='<div class="comm-main"><strong>Send payment instructions</strong><p>Separate payment instructions were promised to the customer. Owner: '+htmlEscape(o.paymentInstructionsOwner||'unassigned')+' · Due: '+htmlEscape(due)+'</p><div class="comm-guidance"><strong>Purpose:</strong> Complete the payment route promised in the payment-request message.<br><strong>Send when:</strong> Before the recorded deadline.</div></div><span class="badge badge-neutral">Needs sending</span><div class="comm-actions"><button class="btn good" type="button" id="r5hMarkPaymentInstructionsSent">Mark instructions sent</button></div>';
    list.appendChild(row);
    row.querySelector('#r5hMarkPaymentInstructionsSent').onclick=()=>void window.r5hMarkPaymentInstructionsSent();
  }
  window.renderCommunicationCentre=function(){const result=originalRenderCommunicationCentre.apply(this,arguments);injectPaymentInstructionTask();return result};

  ensurePaymentInstructionFields();
  try{populatePaymentInstructions(orders.find(x=>x.id===current?.id)||{})}catch(_){}
})();
