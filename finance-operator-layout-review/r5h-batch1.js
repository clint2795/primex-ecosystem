// PrimeX Finance HQ R5H Batch 1 — protected operator-journey lifecycle guards.
// Loaded only on /finance-operator-layout-review/ after the main app has defined its functions.
(function primeXR5HBatch1(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(window.__PX_R5H_BATCH1__) return;
  window.__PX_R5H_BATCH1__=true;

  const originalQuickQuoteUpdate=window.quickQuoteUpdate;
  const originalVoidCurrentOrder=window.voidCurrentOrder;
  const originalVoidOrderById=window.voidOrderById;
  const originalRenderOrder=window.renderOrder;

  async function acceptQuoteFromList(id){
    await loadOrder(id);
    if(current.id!==id) return;
    if(val('orderType')!=='Quote / enquiry'){
      showToast('Open a quote/enquiry first');
      return;
    }
    markCurrentQuoteAccepted();
  }

  function syncCancelledRecord(id){
    const o=orders.find(x=>x.id===id);
    if(!o||normalStatus(o)!=='Cancelled') return;
    o.supabaseItemSyncStatus='local_only';
    saveLocal();
    renderAll();
    void autoSyncSavedQuoteOrder(o.id).then(()=>{
      recalcStock();
      saveLocal();
      renderAll();
    });
  }

  window.quickQuoteUpdate=function(id,field,value){
    if(field==='quoteStatus'&&value==='Customer replied / ready to convert'){
      void acceptQuoteFromList(id);
      return;
    }
    return originalQuickQuoteUpdate(id,field,value);
  };

  window.voidCurrentOrder=function(){
    if(val('orderType')==='Quote / enquiry'){
      const id=current.id;
      const reason=val('voidReason')||prompt('Reason for cancelling this quote?')||'';
      if(!confirm('Cancel quote '+id+'? It will leave active quote work and remain in History.')) return;
      set('voidReason',reason);
      set('quoteStatus','Cancelled');
      set('orderStatus','Cancelled');
      void saveOrderNow().then(ok=>{
        if(ok){
          showToast('Quote cancelled');
          showView('queues');
        }
      });
      return;
    }

    const id=current.id;
    const before=orders.find(x=>x.id===id)?.status;
    originalVoidCurrentOrder();
    const after=orders.find(x=>x.id===id)?.status;
    if(before!=='Cancelled'&&after==='Cancelled') syncCancelledRecord(id);
  };

  window.voidOrderById=function(id){
    const before=orders.find(x=>x.id===id)?.status;
    originalVoidOrderById(id);
    const after=orders.find(x=>x.id===id)?.status;
    if(before!=='Cancelled'&&after==='Cancelled') syncCancelledRecord(id);
  };

  window.renderOrder=function(){
    const result=originalRenderOrder.apply(this,arguments);
    const isQuote=val('orderType')==='Quote / enquiry';
    const voidButton=document.getElementById('voidOrder');
    const archiveButton=document.getElementById('archiveOrder');
    const danger=document.getElementById('dangerousActions');
    const summary=danger?.querySelector('summary');
    if(voidButton) voidButton.textContent=isQuote?'Cancel quote':'Cancel / void order';
    if(archiveButton&&isQuote) archiveButton.style.display='none';
    if(summary) summary.textContent=isQuote?'Cancel quote':'Cancel / archive options';
    return result;
  };

  // Re-render once so quote-aware dangerous actions are correct immediately.
  renderOrder();
})();

// R5H protected loaders — each later batch is loaded only after its dependency has finished.
(function primeXR5HProtectedLoaders(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(document.querySelector('script[data-px-r5h-batch2]')) return;
  const batch2=document.createElement('script');
  batch2.src='/finance-operator-layout-review/r5h-batch2.js?v=1';
  batch2.dataset.pxR5hBatch2='true';
  batch2.onload=()=>{
    if(document.querySelector('script[data-px-r5h-batch3]')) return;
    const batch3=document.createElement('script');
    batch3.src='/finance-operator-layout-review/r5h-batch3.js?v=1';
    batch3.dataset.pxR5hBatch3='true';
    batch3.onload=()=>{
      if(document.querySelector('script[data-px-r5h-batch4]')) return;
      const batch4=document.createElement('script');
      batch4.src='/finance-operator-layout-review/r5h-batch4.js?v=1';
      batch4.dataset.pxR5hBatch4='true';
      document.body.appendChild(batch4);
    };
    document.body.appendChild(batch3);
  };
  document.body.appendChild(batch2);
})();
