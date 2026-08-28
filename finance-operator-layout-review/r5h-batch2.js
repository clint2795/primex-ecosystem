// PrimeX Finance HQ R5H Batch 2 — protected operator truth, payment evidence and handover guards.
// Loaded only on /finance-operator-layout-review/ after Batch 1 and the main app have defined their functions.
(function primeXR5HBatch2(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(window.__PX_R5H_BATCH2__) return;
  window.__PX_R5H_BATCH2__=true;

  const originalOrderPayload=window.orderPayload;
  const originalLoadOrder=window.loadOrder;
  const originalNewOrder=window.newOrder;
  const originalMarkPaid=window.markPaid;
  const originalPrepOrder=window.prepOrder;
  const originalReleaseOrder=window.releaseOrder;
  const originalMarkDeliveredComplete=window.markDeliveredComplete;
  const originalSetCommStatus=window.setCommStatus;
  const originalMarkConfirmationSentNow=window.markConfirmationSentNow;
  const originalMarkCustomerUpdateSentNow=window.markCustomerUpdateSentNow;
  const originalRequiredCustomerUpdateKey=window.requiredCustomerUpdateKey;
  const originalFulfilmentMessageBody=window.fulfilmentMessageBody;
  const originalRenderCommunicationCentre=window.renderCommunicationCentre;
  const originalMoveOrderToBin=window.moveOrderToBin;
  const originalRestoreOrderFromBin=window.restoreOrderFromBin;
  const originalSaveOrderNow=window.saveOrderNow;

  let communicationSaveTimer=null;

  function field(id){return document.getElementById(id)}
  function fieldValue(id){return String(field(id)?.value||'').trim()}
  function setField(id,value){const el=field(id);if(el)el.value=value??''}
  function nowLocalInputValue(){
    const d=new Date(),pad=n=>String(n).padStart(2,'0');
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
  }
  function isoFromLocalInput(value){const d=value?new Date(value):null;return d&&!Number.isNaN(d.getTime())?d.toISOString():''}
  function localInputFromIso(value){const d=value?new Date(value):null;if(!d||Number.isNaN(d.getTime()))return '';const pad=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
  function activeOperator(){
    try{
      const p=typeof supabaseAuthState!=='undefined'?supabaseAuthState.profile:null;
      if(!p||p.active!==true)return null;
      const label=String(p.display_name||'').trim()||String(supabaseAuthState.user?.email||'').trim();
      return label?{label,role:String(p.role||'').trim()}:null;
    }catch(_){return null}
  }
  async function requireActiveOperator(action){
    let op=activeOperator();
    if(!op&&typeof refreshSupabaseAuthStatus==='function'){
      try{await refreshSupabaseAuthStatus()}catch(_){}
      op=activeOperator();
    }
    if(!op){showToast('Finance login required before '+action);return null}
    return op;
  }
  function currentTotal(){
    try{return Number(originalOrderPayload().total||0)}catch(_){return 0}
  }

  function ensureBatch2Fields(){
    const approvedBy=field('releaseApprovedBy');
    const advanced=approvedBy?.closest('details');
    if(approvedBy)approvedBy.readOnly=true;
    if(!advanced||field('paymentReceivedAmount'))return;
    const block=document.createElement('div');
    block.id='r5hBatch2Evidence';
    block.className='grid two';
    block.style.marginTop='10px';
    block.innerHTML=`
      <div class="field"><label>Amount received</label><input id="paymentReceivedAmount" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00"><span class="tiny">Required when payment is recorded as Paid or Part paid.</span></div>
      <div class="field"><label>Payment received at</label><input id="paymentReceivedAt" type="datetime-local"></div>
      <div class="field"><label>Payment reference</label><input id="paymentReference" placeholder="Bank / transfer / cash reference if available"></div>
      <div class="field"><label>Recorded by</label><input id="paymentRecordedBy" readonly placeholder="Finance login"></div>
      <div class="field full"><label>Payment reconciliation note</label><input id="paymentReconciliationNote" placeholder="Optional reconciliation note"></div>
      <div class="field full"><label>Unpaid release reason</label><input id="releaseOverrideReason" placeholder="Required if an unpaid order is moved forward"></div>`;
    advanced.appendChild(block);

    field('paymentStatus')?.addEventListener('change',()=>{
      const status=fieldValue('paymentStatus');
      const op=activeOperator();
      if(status==='Paid'){
        if(!fieldValue('paymentReceivedAmount'))setField('paymentReceivedAmount',currentTotal().toFixed(2));
        if(!fieldValue('paymentReceivedAt'))setField('paymentReceivedAt',nowLocalInputValue());
        if(!fieldValue('paymentRecordedBy')&&op)setField('paymentRecordedBy',op.label);
      }else if(status==='Part paid'){
        if(!fieldValue('paymentReceivedAt'))setField('paymentReceivedAt',nowLocalInputValue());
        if(!fieldValue('paymentRecordedBy')&&op)setField('paymentRecordedBy',op.label);
        field('paymentReceivedAmount')?.focus();
      }
    });
  }

  function populateEvidence(o={}){
    ensureBatch2Fields();
    setField('paymentReceivedAmount',o.paymentReceivedAmount??'');
    setField('paymentReceivedAt',localInputFromIso(o.paymentReceivedAt||''));
    setField('paymentReference',o.paymentReference||'');
    setField('paymentRecordedBy',o.paymentRecordedBy||'');
    setField('paymentReconciliationNote',o.paymentReconciliationNote||'');
    setField('releaseOverrideReason',o.releaseOverrideReason||'');
  }
  function clearEvidence(){populateEvidence({})}

  function addEvidenceToPayload(base){
    ensureBatch2Fields();
    base.paymentReceivedAmount=fieldValue('paymentReceivedAmount')===''?null:Number(fieldValue('paymentReceivedAmount'));
    base.paymentReceivedAt=isoFromLocalInput(fieldValue('paymentReceivedAt'));
    base.paymentReference=fieldValue('paymentReference');
    base.paymentRecordedBy=fieldValue('paymentRecordedBy');
    base.paymentReconciliationNote=fieldValue('paymentReconciliationNote');
    base.releaseOverrideReason=fieldValue('releaseOverrideReason');
    return base;
  }

  window.orderPayload=function(){return addEvidenceToPayload(originalOrderPayload.apply(this,arguments))};

  window.loadOrder=async function(id){
    await originalLoadOrder.apply(this,arguments);
    if(current?.id===id){const o=orders.find(x=>x.id===id)||{};populateEvidence(o)}
  };
  window.newOrder=function(){const result=originalNewOrder.apply(this,arguments);clearEvidence();return result};

  function validatePaymentEvidence(payload){
    if(!['Paid','Part paid'].includes(String(payload.payment||'')))return true;
    const amount=Number(payload.paymentReceivedAmount||0),total=Number(payload.total||0);
    if(!(amount>0)){showToast('Enter the amount actually received before recording payment');field('paymentReceivedAmount')?.focus();return false}
    if(payload.payment==='Part paid'&&total>0&&amount>=total){showToast('Part paid must be less than the order total');field('paymentReceivedAmount')?.focus();return false}
    if(payload.payment==='Paid'&&total>0&&amount<total){showToast('Received amount is below the order total - use Part paid or correct the amount');field('paymentReceivedAmount')?.focus();return false}
    if(!payload.paymentReceivedAt){showToast('Record when payment was received');field('paymentReceivedAt')?.focus();return false}
    if(!payload.paymentRecordedBy){showToast('Finance login required to record payment');return false}
    return true;
  }

  window.saveOrderNow=async function(){
    ensureBatch2Fields();
    let payload=window.orderPayload();
    if(['Paid','Part paid'].includes(String(payload.payment||''))&&!payload.paymentRecordedBy){
      const op=await requireActiveOperator('recording payment');if(!op)return false;
      setField('paymentRecordedBy',op.label);payload=window.orderPayload();
    }
    if(payload.releaseOverride==='Yes'){
      const op=await requireActiveOperator('saving an unpaid release override');if(!op)return false;
      setField('releaseApprovedBy',op.label);payload=window.orderPayload();
    }
    if(!validatePaymentEvidence(payload))return false;
    if(payload.releaseOverride==='Yes'&&(!payload.releaseApprovedBy||!payload.releaseOverrideReason)){
      showToast('Unpaid release needs an accountable approver and reason');
      if(!payload.releaseOverrideReason)field('releaseOverrideReason')?.focus();
      return false;
    }
    return originalSaveOrderNow.apply(this,arguments);
  };
  const saveButton=field('saveOrder');
  if(saveButton)saveButton.onclick=()=>window.saveOrderNow();

  async function collectPaymentEvidence(o,status='Paid'){
    const op=await requireActiveOperator('recording payment');if(!op)return null;
    const total=Number(o.total||0);
    const amountRaw=prompt(status==='Part paid'?'Amount received so far?':'Amount received?',total>0?total.toFixed(2):'');
    if(amountRaw===null)return null;
    const amount=Number(String(amountRaw).replace(/[^0-9.-]/g,''));
    if(!(amount>0)){showToast('Payment was not changed - enter a valid amount');return null}
    if(status==='Part paid'&&total>0&&amount>=total){showToast('Part paid must be less than the order total');return null}
    if(status==='Paid'&&total>0&&amount<total){showToast('Received amount is below the order total - record it as Part paid');return null}
    const reference=prompt('Payment reference (optional):',String(o.paymentReference||''));
    if(reference===null)return null;
    return {paymentReceivedAmount:amount,paymentReceivedAt:new Date().toISOString(),paymentReference:String(reference||'').trim(),paymentRecordedBy:op.label,paymentReconciliationNote:o.paymentReconciliationNote||''};
  }

  window.markPaid=async function(id){
    const o=orders.find(x=>x.id===id);if(!o)return;
    const evidence=await collectPaymentEvidence(o,'Paid');if(!evidence)return;
    Object.assign(o,evidence);
    return originalMarkPaid(id);
  };

  async function collectUnpaidOverride(o,action){
    const op=await requireActiveOperator(action);if(!op)return false;
    const existing=String(o.releaseOverrideReason||'').trim();
    const reason=prompt('Reason for moving this unpaid order forward?',existing);
    if(reason===null)return false;
    if(!String(reason).trim()){showToast('A reason is required for unpaid release');return false}
    o.releaseOverride='Yes';
    o.releaseApprovedBy=op.label;
    o.releaseOverrideReason=String(reason).trim();
    return true;
  }

  window.prepOrder=async function(id){
    const o=orders.find(x=>x.id===id);if(!o)return;
    if(!isPaymentCleared(o)&&!(o.releaseOverride==='Yes'&&o.releaseApprovedBy&&o.releaseOverrideReason)){
      if(!await collectUnpaidOverride(o,'moving an unpaid order to preparation'))return;
    }
    return originalPrepOrder(id);
  };

  window.releaseOrder=async function(id){
    const o=orders.find(x=>x.id===id);if(!o)return;
    if(!isPaymentCleared(o)&&!(o.releaseOverride==='Yes'&&o.releaseApprovedBy&&o.releaseOverrideReason)){
      if(!await collectUnpaidOverride(o,'releasing an unpaid order'))return;
    }
    // The original release function sees the explicit override and does not self-authorise as "Manual override".
    return originalReleaseOrder(id);
  };

  window.requiredCustomerUpdateKey=function(o={}){
    const st=normalStatus(o);
    if(['Dispatched / awaiting delivery confirmation','Sent / collected'].includes(st))return 'trackingUpdateStatus';
    return originalRequiredCustomerUpdateKey(o);
  };

  window.fulfilmentMessageBody=function(type,o){
    if(type!=='tracking')return originalFulfilmentMessageBody(type,o);
    const method=String(o?.fulfilment||'');
    const tracking=String(o?.tracking||o?.trackingRef||'').trim();
    if(method==='Customer collection')return ['PrimeX BioLabs - Collection Complete','Your order has been collected.'];
    if(method==='Local drop-off')return ['PrimeX BioLabs - Drop-off Complete','Your order has been delivered by local drop-off.'];
    if(method==='Royal Mail collection')return ['PrimeX BioLabs - Dispatched Update','Your order has been collected by Royal Mail and is now in the delivery network.'+(tracking?'\n\nTracking / reference: '+tracking:' We’ll share tracking details if they become available.')];
    if(method==='Royal Mail postage')return ['PrimeX BioLabs - Dispatched Update','Your order has been handed over for Royal Mail delivery.'+(tracking?'\n\nTracking / reference: '+tracking:' We’ll share tracking details if they become available.')];
    if(method==='Courier collection')return ['PrimeX BioLabs - Dispatched Update','Your order has been handed over to the courier.'+(tracking?'\n\nTracking / reference: '+tracking:' We’ll share tracking details if they become available.')];
    return originalFulfilmentMessageBody(type,o);
  };

  function postHandoverCopy(o){
    const method=String(o.fulfilment||'');
    if(method==='Customer collection')return {title:'Send collection-complete update',message:'Confirm that the customer collection has been completed.'};
    if(method==='Local drop-off')return {title:'Send drop-off-complete update',message:'Confirm that the local drop-off has been completed.'};
    return {title:'Send dispatched / tracking update',message:String(o.tracking||'').trim()?'Send the customer their dispatch confirmation and tracking/reference details.':'Confirm dispatch now; tracking can follow separately if it becomes available.'};
  }

  function patchPostHandoverCommunication(){
    const o=window.orderPayload();
    const st=normalStatus(o);
    if(!['Dispatched / awaiting delivery confirmation','Sent / collected'].includes(st))return;
    const row=document.querySelector('[data-comm-key="trackingUpdateStatus"]');if(!row)return;
    const copy=postHandoverCopy(o),main=row.querySelector('.comm-main');
    const title=main?.querySelector('strong'),paragraph=main?.querySelector('p');
    if(title)title.textContent=copy.title;if(paragraph)paragraph.textContent=copy.message;
    const savedStatus=(current.commStatus||{}).trackingUpdateStatus||'notSent';
    const badge=row.querySelector('.badge');if(badge)badge.textContent=commStatusLabel(savedStatus==='notReady'?'notSent':savedStatus);
    if(['sent','alreadySent'].includes(savedStatus))return;
    row.classList.remove('status-only');row.classList.add('action-ready');
    if(row.querySelector('.comm-actions'))return;
    const actions=document.createElement('div');actions.className='comm-actions';
    actions.innerHTML='<button class="btn primary" type="button">Generate update</button>'+
      (savedStatus==='generated'?'<button class="btn" type="button">Copy</button><button class="btn" type="button">Open WhatsApp</button><button class="btn good" type="button">Mark as sent</button>':'');
    const buttons=actions.querySelectorAll('button');
    buttons[0].onclick=()=>{generateFulfilment('tracking');setCommStatus('trackingUpdateStatus','generated')};
    if(savedStatus==='generated'){
      buttons[1].onclick=()=>copyCustomerUpdate();
      buttons[2].onclick=()=>openWhatsAppMessage(fulfilmentMsg);
      buttons[3].onclick=()=>{markCustomerUpdateSentNow();setCommStatus('trackingUpdateStatus','sent')};
    }
    row.appendChild(actions);
  }

  window.renderCommunicationCentre=function(){
    const result=originalRenderCommunicationCentre.apply(this,arguments);
    patchPostHandoverCommunication();
    return result;
  };

  function persistCurrentCommunicationSoon(label){
    clearTimeout(communicationSaveTimer);
    communicationSaveTimer=setTimeout(()=>{
      const snapshot=window.orderPayload();
      const idx=orders.findIndex(x=>x.id===snapshot.id);
      if(idx<0){void window.saveOrderNow();return}
      orders[idx]=snapshot;
      persistWorkflowChange(snapshot,label||'Customer communication saved');
    },0);
  }

  window.setCommStatus=function(key,status){
    const result=originalSetCommStatus.apply(this,arguments);
    if(status==='sent'||status==='alreadySent')persistCurrentCommunicationSoon('Customer communication status saved');
    return result;
  };
  window.markConfirmationSentNow=function(){
    const result=originalMarkConfirmationSentNow.apply(this,arguments);
    if(val('orderType')!=='Quote / enquiry'&&val('confirmationSent')==='Yes')persistCurrentCommunicationSoon('Order confirmation status saved');
    return result;
  };
  window.markCustomerUpdateSentNow=function(){
    const result=originalMarkCustomerUpdateSentNow.apply(this,arguments);
    if(val('updateSent')==='Yes')persistCurrentCommunicationSoon('Customer update status saved');
    return result;
  };

  window.markDeliveredComplete=function(id){
    const o=orders.find(x=>x.id===id);if(!o)return;
    if(!requiredCustomerUpdateSent(o)){
      const needed=postHandoverCopy(o).title;
      showToast('Complete blocked - '+needed.toLowerCase()+' first');
      void openOrderTask(id,'tracking');
      return;
    }
    return originalMarkDeliveredComplete(id);
  };

  function syncExistingCloudOrder(id,message){
    const o=orders.find(x=>x.id===id);if(!o?.supabaseOrderId)return;
    o.supabaseItemSyncStatus='local_only';saveLocal();renderAll();
    void autoSyncSavedQuoteOrder(id).then(ok=>{
      recalcStock();saveLocal();renderAll();
      showToast(ok?message:message+' locally - online backup needs retrying');
    });
  }
  window.moveOrderToBin=function(id){
    const before=!!orders.find(x=>x.id===id)?.binned;
    const result=originalMoveOrderToBin.apply(this,arguments);
    const after=!!orders.find(x=>x.id===id)?.binned;
    if(!before&&after)syncExistingCloudOrder(id,'Order bin state saved in shared Finance');
    return result;
  };
  window.restoreOrderFromBin=function(id){
    const before=!!orders.find(x=>x.id===id)?.binned;
    const result=originalRestoreOrderFromBin.apply(this,arguments);
    const after=!!orders.find(x=>x.id===id)?.binned;
    if(before&&!after)syncExistingCloudOrder(id,'Order restore saved in shared Finance');
    return result;
  };

  ensureBatch2Fields();
  try{populateEvidence(orders.find(x=>x.id===current?.id)||{})}catch(_){}
  try{renderCommunicationCentre()}catch(_){}
})();
