const SOURCE_URL='../finance-operator-layout-review/index.html';
const SOURCE_MARKER='PX-ROUTE-R5G';
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function isolationBootstrap(){return String.raw`<script>
const __pxMemory=new Map();
const localStorage=Object.freeze({get length(){return __pxMemory.size},key:i=>[...__pxMemory.keys()][i]??null,getItem:k=>__pxMemory.has(String(k))?__pxMemory.get(String(k)):null,setItem:(k,v)=>__pxMemory.set(String(k),String(v)),removeItem:k=>__pxMemory.delete(String(k)),clear:()=>__pxMemory.clear()});
window.PX_FINANCE_CONFIG={};
</script>`}

function bridgeScript(){return String.raw`<script>
(()=>{
  let handoffEvidence=null;
  const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
  const saved=id=>typeof savedOrderById==='function'?clone(savedOrderById(id)):null;
  const list=()=>typeof dashboardOrders==='function'?clone(dashboardOrders()):[];
  const messageFingerprint=()=>customerMessageDependencyFingerprint('confirmation');
  const read=()=>{
    const payload=orderPayload(),savedRecord=saved(payload.id),sourceRecord=payload.sourceQuoteId?saved(payload.sourceQuoteId):null;
    const isQuote=val('orderType')==='Quote / enquiry',liveOrderSaved=!isQuote&&!!payload.sourceQuoteId&&savedRecord?.sourceQuoteId===payload.sourceQuoteId&&sourceRecord?.convertedOrderId===payload.id;
    return clone({...payload,isQuote,liveOrderSaved,readOnly:!!current.cloudReadOnly,approvalCurrent:quoteApprovalCurrent(),messagePrepared:!!String(confirmationMsg?.value||'').trim(),messageCurrent:customerMessageIsCurrent(confirmationMsg),messageFingerprint:messageFingerprint(),handoffEvidence,convertedOrderId:savedRecord?.convertedOrderId||'',sentEvidence:(savedRecord?.confirmation==='Yes'||sourceRecord?.confirmation==='Yes'),sourceQuoteStatus:sourceRecord?.quoteStatus||'',sourceQuoteAcceptedSnapshot:sourceRecord?.acceptedSnapshot||null,authorityVersion:COMMERCIAL_AUTHORITY_VERSION,isolated:true});
  };
  const packet=()=>({state:read(),list:list()});
  const waitFor=async predicate=>{for(let i=0;i<160;i++){const value=predicate();if(value)return value;await new Promise(r=>setTimeout(r,25))}throw new Error('Authoritative saved state was not confirmed in time.')};
  const command=async(name,payload)=>{
    if(name==='newQuote'){
      handoffEvidence=null;
      if(payload==='request'){const before=new Set(requestInbox.map(r=>r.requestId));createLocalTestRequest();const req=requestInbox.find(r=>!before.has(r.requestId));if(!req)throw new Error('The Finance request fixture was not created.');convertRequestToQuote(req.requestId)}
      else if(payload==='email')newEmailQuote();else newQuote();
      showView('order');return packet();
    }
    if(name==='open'){await loadOrder(payload);return packet()}
    if(name==='saveDraft'){const ok=await saveOrderNow();if(!ok)throw new Error('Finance rejected the draft save.');await waitFor(()=>saved(current.id));return packet()}
    if(name==='approve'){approveCurrentQuote();await waitFor(()=>{const o=saved(current.id);return quoteApprovalCurrent()&&o?.quoteApproval?.fingerprint===current.quoteApproval?.fingerprint});return packet()}
    if(name==='prepareMessage'){startSendQuoteWorkflow();await waitFor(()=>customerMessageIsCurrent(confirmationMsg));handoffEvidence=null;return packet()}
    if(name==='prepareHandoff'){
      if(!customerMessageIsCurrent(confirmationMsg))throw new Error('The customer message is stale.');
      const channel=String(payload||'');
      const contact=channel==='email'?cleanCustomerEmail(val('recEmail')):channel==='whatsapp'?cleanWhatsAppPhone(val('recPhone')):'clipboard review';
      if(!contact)throw new Error('Add the customer '+(channel==='email'?'email':'WhatsApp number')+' before handoff.');
      handoffEvidence={channel,preparedAt:new Date().toISOString(),fingerprint:messageFingerprint(),body:String(confirmationMsg.value),recipient:contact,proofOnly:true};
      return packet();
    }
    if(name==='recordSent'){if(!handoffEvidence||handoffEvidence.fingerprint!==messageFingerprint())throw new Error('The prepared handoff is missing or stale.');markConfirmationSentNow();await waitFor(()=>{const o=saved(current.id);return o?.confirmation==='Yes'&&o?.quoteStatus==='Quote sent / waiting customer'});return packet()}
    if(name==='recordAcceptance'){markCurrentQuoteAccepted();await waitFor(()=>{const o=saved(current.id);return o?.acceptedSnapshot&&o?.quoteStatus==='Customer replied / ready to convert'});return packet()}
    if(name==='convert'){
      const original=window.confirm;window.confirm=()=>true;try{convertCurrentQuoteToLive()}finally{window.confirm=original}
      return packet();
    }
    if(name==='saveConvertedOrder'){const source=current.sourceQuoteId,live=current.id,ok=await saveOrderNow();if(!ok)throw new Error('Finance rejected the live-order save.');await waitFor(()=>saved(live)?.sourceQuoteId===source&&saved(source)?.convertedOrderId===live);return packet()}
    throw new Error('Unsupported Finance command: '+name);
  };
  addEventListener('message',async event=>{if(event.source!==parent||event.data?.scope!=='px-r5h-quote')return;const {id,type,payload}=event.data;try{const value=type==='read'?packet():type==='readSaved'?saved(payload):type==='list'?list():await command(type,payload);parent.postMessage({scope:'px-r5h-quote-result',id,value},'*')}catch(error){parent.postMessage({scope:'px-r5h-quote-result',id,error:error?.message||String(error)},'*')}});
  parent.postMessage({scope:'px-r5h-quote-ready',marker:'PX-ROUTE-R5G'},'*');
})();
</script>`}

function prepareSource(html){
  if(!html.includes(SOURCE_MARKER)||!html.includes('function approveCurrentQuote(')||!html.includes('function saveOrderNow('))throw new Error('The protected Finance Quote authority did not match the required R5G source.');
  let source=html.replace(/<script\s+src=["'][^"']+["'][^>]*><\/script>/gi,'').replace(/<link[^>]+fonts\.googleapis[^>]*>/gi,'');
  source=source.replace('renderAll();startAutomaticCloudRequestSync()}','renderAll();/* isolated proof: shared sync disabled */}');
  source=source.replace('</head>',`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'">${isolationBootstrap()}</head>`);
  source=source.replace('</body>',`<style>.topbar,.nav,.bottom-nav,#viewHelpModal{display:none!important}.wrap{max-width:none!important;padding:0!important}.view{display:none!important}#view-order{display:block!important;margin:0!important;padding:12px!important}.card{box-shadow:none!important}#openConfirmationEmail,#openConfirmationWhatsApp{display:none!important}</style>${bridgeScript()}</body>`);
  return source;
}

export async function createIsolatedQuoteEnginePort(iframe,{sourceUrl=SOURCE_URL}={}){
  if(!iframe)throw new Error('A Quote engine frame is required.');
  const response=await fetch(sourceUrl,{cache:'no-store'});if(!response.ok)throw new Error('Could not load the protected Finance source ('+response.status+').');
  const source=prepareSource(await response.text());
  let sequence=0,state=null,records=[],readyResolve;
  const pending=new Map(),ready=new Promise(resolve=>{readyResolve=resolve});
  const onMessage=event=>{
    if(event.source!==iframe.contentWindow)return;
    if(event.data?.scope==='px-r5h-quote-ready'){readyResolve();return}
    if(event.data?.scope!=='px-r5h-quote-result')return;
    const request=pending.get(event.data.id);if(!request)return;pending.delete(event.data.id);event.data.error?request.reject(new Error(event.data.error)):request.resolve(event.data.value);
  };
  addEventListener('message',onMessage);iframe.srcdoc=source;
  await Promise.race([ready,(async()=>{await wait(8000);throw new Error('The isolated Finance engine did not start.')})()]);
  const rpc=(type,payload)=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});iframe.contentWindow.postMessage({scope:'px-r5h-quote',id,type,payload},'*');setTimeout(()=>{if(pending.delete(id))reject(new Error('Finance '+type+' timed out.'))},10000)});
  const absorb=value=>{if(value?.state){state=value.state;records=value.list||records}return value};
  absorb(await rpc('read'));
  return Object.freeze({read:()=>clone(state),readSaved:id=>clone(records.find(record=>record.id===id)||null),list:()=>clone(records),async refresh(){return absorb(await rpc('read')).state},async command(name,payload){if(name==='convert'&&!confirm('Convert the locked accepted quote into a proof-only live order? Stock changes remain inside this isolated workspace.'))return false;const value=await rpc(name,payload);if(value===false)return false;absorb(value);return true},destroy(){removeEventListener('message',onMessage);iframe.srcdoc=''}});
}
