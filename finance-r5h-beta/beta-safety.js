// PrimeX Finance HQ R5H Beta safety boundary.
(function(){
  if(!window.__PX_R5H_BETA__) return;
  const EMAIL_KEY='beta_test_email', PHONE_KEY='beta_test_phone';

  function read(k){try{return localStorage.getItem(k)||''}catch(_){return ''}}
  function write(k,v){try{localStorage.setItem(k,String(v||'').trim())}catch(_){}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function ensureBanner(){
    if(document.getElementById('pxBetaBar'))return;
    const bar=document.createElement('section');
    bar.id='pxBetaBar';
    bar.style.cssText='position:sticky;top:0;z-index:9999;margin:0 0 14px;padding:10px 12px;border:1px solid #7d5d22;background:#171108;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.25)';
    bar.innerHTML='<div style="font-weight:800;letter-spacing:.04em">R5H BETA · TEST DATA ONLY</div>'+
      '<div style="font-size:12px;color:#d9c59c;margin-top:3px">Separate browser data. Shared Finance/cloud access is blocked. Customer communication can only open to the test recipient saved below.</div>'+
      '<details style="margin-top:8px"><summary style="cursor:pointer">Test recipient settings</summary>'+
      '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px">'+
      '<label style="font-size:12px">Test email<input id="pxBetaEmail" type="email" value="'+esc(read(EMAIL_KEY))+'" placeholder="Jade test email" style="width:100%;margin-top:4px"></label>'+
      '<label style="font-size:12px">Test WhatsApp/mobile<input id="pxBetaPhone" value="'+esc(read(PHONE_KEY))+'" placeholder="Jade mobile" style="width:100%;margin-top:4px"></label></div>'+
      '<button id="pxBetaSaveRecipient" class="btn" type="button" style="margin-top:8px">Save test recipient</button></details>';
    const wrap=document.querySelector('.wrap'); if(wrap)wrap.prepend(bar); else document.body.prepend(bar);
    document.getElementById('pxBetaSaveRecipient')?.addEventListener('click',()=>{
      write(EMAIL_KEY,document.getElementById('pxBetaEmail')?.value);
      write(PHONE_KEY,document.getElementById('pxBetaPhone')?.value);
      if(typeof showToast==='function')showToast('Beta test recipient saved');
    });
  }

  function betaEmail(){
    const v=String(read(EMAIL_KEY)).trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?v:'';
  }
  function betaPhone(){
    const raw=String(read(PHONE_KEY)).trim();
    return raw.replace(/[^0-9+]/g,'');
  }

  window.openEmailMessage=function(messageEl){
    const email=betaEmail(),message=String(messageEl?.value||'').trim();
    if(!email){showToast('Set the Beta test email first');document.getElementById('pxBetaEmail')?.focus();return}
    if(!message||!ensureCustomerMessageCurrent(messageEl))return;
    window.location.href='mailto:'+email+'?subject='+encodeURIComponent('[BETA TEST] '+customerEmailSubject())+'&body='+encodeURIComponent(message);
    showToast('Beta email opened for the approved test recipient');
  };
  window.openWhatsAppMessage=function(messageEl){
    const phone=betaPhone(),message=String(messageEl?.value||'').trim();
    if(!phone){showToast('Set the Beta test WhatsApp/mobile first');document.getElementById('pxBetaPhone')?.focus();return}
    if(!message||!ensureCustomerMessageCurrent(messageEl))return;
    window.open('https://wa.me/'+phone.replace(/^\+/,'')+'?text='+encodeURIComponent('[BETA TEST]\n\n'+message),'_blank','noopener');
    showToast('Beta WhatsApp opened for the approved test recipient');
  };

  // Cloud/shared controls are deliberately unavailable in Beta.
  window.automaticCloudRequestSync=async()=>false;
  window.refreshCloudRequests=async()=>{showToast('Beta safety: shared requests are disabled');return false};
  window.refreshCloudOrders=async()=>{showToast('Beta safety: shared Finance is disabled');return false};
  window.syncSavedQuoteOrderToDatabase=async()=>{setOrderDbSyncStatus?.('Beta test mode — shared online backup is disabled.','warn');return false};
  window.autoSyncSavedQuoteOrder=async()=>false;
  window.startFinanceRealtime=()=>{};
  window.supabaseLogin=async()=>{showToast('Beta safety: shared Finance login is disabled')};

  ensureBanner();
  try{
    const badge=document.getElementById('bootBadge');
    if(badge){badge.textContent='R5H BETA · TEST DATA';badge.style.color='#e3b85b'}
    const cloudBtn=document.getElementById('refreshCloudRequestsBtn');if(cloudBtn){cloudBtn.disabled=true;cloudBtn.textContent='Shared requests disabled in Beta'}
    const retry=document.getElementById('saveOrderToDatabase');if(retry){retry.disabled=true;retry.textContent='Online backup disabled in Beta'}
  }catch(_){}
})();