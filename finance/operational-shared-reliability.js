// PrimeX Finance operational candidate — shared edit safety and lease continuity.
(function primeXOperationalSharedReliability(){
  if(window.__PX_OPERATIONAL_SHARED_RELIABILITY__)return;
  window.__PX_OPERATIONAL_SHARED_RELIABILITY__=true;

  const originalClaimSharedOrderForEdit=window.claimSharedOrderForEdit;
  const originalLoadOrder=window.loadOrder;
  const originalRefreshCloudOrders=window.refreshCloudOrders;
  const originalReleaseCurrentSharedClaim=window.releaseCurrentSharedClaim;
  const originalNewOrder=window.newOrder;
  const remoteConflictSnapshots=new Map();
  const LEASE_MINUTES=10;
  const LEASE_RENEW_MS=4*60*1000;
  let leaseTimer=null;
  let leaseRecordId='';
  let leaseRenewing=false;

  function clone(value){return JSON.parse(JSON.stringify(value))}
  function pendingSharedRecords(){
    return (orders||[]).filter(o=>o?.supabaseOrderId&&String(o.supabaseItemSyncStatus||'')!=='synced').map(clone);
  }
  function syncWarning(message){
    try{setOrderDbSyncStatus(message,'warn')}catch(_){showToast(message)}
  }
  function conflictControlsHost(){
    const status=document.getElementById('orderDbSyncStatus');
    if(!status)return null;
    let host=document.getElementById('operationalSharedConflictControls');
    if(host)return host;
    host=document.createElement('div');
    host.id='operationalSharedConflictControls';
    host.className='note warn hide';
    host.style.marginTop='10px';
    status.insertAdjacentElement('afterend',host);
    return host;
  }
  function clearConflictControls(){
    const host=conflictControlsHost();
    if(host){host.classList.add('hide');host.innerHTML=''}
  }
  function showConflictControls(local,remote){
    remoteConflictSnapshots.set(local.id,clone(remote));
    const host=conflictControlsHost();
    if(!host)return;
    host.classList.remove('hide');
    host.innerHTML='<strong>Shared version changed</strong><br><span class="tiny">This device has unsynced edits. Your local copy has been preserved; nothing was discarded.</span><div class="btnrow" style="margin-top:10px"><button class="btn" id="operationalKeepLocalConflict" type="button">Keep local copy</button><button class="btn warn" id="operationalLoadSharedConflict" type="button">Load shared version</button></div>';
    document.getElementById('operationalKeepLocalConflict').onclick=()=>{
      host.classList.add('hide');
      syncWarning('Local unsynced copy kept. Reconcile the changed shared record before retrying the online backup.');
    };
    document.getElementById('operationalLoadSharedConflict').onclick=()=>window.loadOperationalSharedConflict(local.id);
  }

  window.loadOperationalSharedConflict=async function(id){
    const remote=remoteConflictSnapshots.get(id);
    if(!remote){showToast('Shared recovery copy is no longer available - refresh again');return false}
    if(!confirm('Load the latest shared version of '+id+'?\n\nThis will discard the unsynced edits on this device for this record only.'))return false;
    const idx=orders.findIndex(o=>o.id===id);
    if(idx<0)return false;
    orders[idx]=clone(remote);
    saveLocal();recalcStock();renderAll();
    remoteConflictSnapshots.delete(id);clearConflictControls();
    await window.loadOrder(id);
    showToast('Latest shared version loaded');
    return true;
  };

  // Empty claim data is the genuine active-operator case. Infrastructure errors remain errors.
  window.claimSharedOrderForEdit=async function(o){
    if(!o?.supabaseOrderId)return true;
    const auth=await requireSupabaseWriteUser('opening a shared record');
    const claim=await auth.client.rpc('claim_quote_order',{p_order_id:o.supabaseOrderId,p_lease_minutes:LEASE_MINUTES});
    if(claim.error)throw new Error(claim.error.message);
    const row=(claim.data||[])[0];
    if(!row)return false;
    Object.assign(o,{cloudClaimedBy:row.claimed_by||'',cloudClaimExpiresAt:row.claim_expires_at||'',cloudRowVersion:Number(row.row_version||o.cloudRowVersion||1),cloudReadOnly:false});
    await writeFinanceAudit(auth.client,auth.user,'quotes_orders',o.supabaseOrderId,'claimed',{order_ref:o.id,expires_at:row.claim_expires_at});
    return true;
  };

  window.loadOrder=async function(id){
    try{
      const result=await originalLoadOrder.apply(this,arguments);
      if(current?.id===id&&current.supabaseOrderId&&!current.cloudReadOnly)startLeaseHeartbeat(id);
      else stopLeaseHeartbeat();
      return result;
    }catch(err){
      stopLeaseHeartbeat();
      console.error('Shared record open failed',err);
      syncWarning('Could not check the shared edit lock. The record was not opened for editing. Retry when the shared connection is available.'+(err?.message?' '+err.message:''));
      showToast('Shared edit check failed - record not opened');
      return false;
    }
  };

  window.refreshCloudOrders=async function(options={}){
    const pending=pendingSharedRecords();
    const ok=await originalRefreshCloudOrders.apply(this,arguments);
    if(!ok||!pending.length)return ok;
    let preserved=0,conflicts=0;
    for(const local of pending){
      const remote=(orders||[]).find(o=>(local.supabaseOrderId&&o.supabaseOrderId===local.supabaseOrderId)||o.id===local.id);
      if(!remote)continue;
      const localVersion=Number(local.cloudRowVersion||0),remoteVersion=Number(remote.cloudRowVersion||0);
      const changed=!!localVersion&&!!remoteVersion&&localVersion!==remoteVersion;
      const idx=orders.findIndex(o=>o.id===remote.id);
      if(idx<0)continue;
      orders[idx]=clone(local);preserved++;
      if(changed){
        orders[idx].cloudConflictState='remote_changed';
        orders[idx].cloudConflictRemoteRowVersion=remoteVersion;
        orders[idx].cloudConflictDetectedAt=new Date().toISOString();
        remoteConflictSnapshots.set(local.id,clone(remote));conflicts++;
        if(current?.id===local.id)showConflictControls(orders[idx],remote);
      }
    }
    if(preserved){
      saveLocal();recalcStock();renderAll();
      if(conflicts)syncWarning('Shared Finance changed while this device has unsynced edits. Local edits were preserved; review the conflict before retrying.');
      else if(!options?.silent)syncWarning('Shared Finance refreshed. Unsynced local edits were preserved for retry.');
    }
    return ok;
  };

  window.releaseCurrentSharedClaim=async function(){
    const id=current?.supabaseOrderId;
    stopLeaseHeartbeat();
    if(!id||current.cloudReadOnly)return;
    try{
      const auth=await currentSupabaseWriteUser();
      if(!auth)return;
      const released=await auth.client.rpc('release_quote_order_claim',{p_order_id:id});
      if(released.error)throw new Error(released.error.message);
    }catch(err){
      console.warn('Shared record claim release failed',err);
      showToast('Shared edit lock could not be released; it will expire automatically');
    }
  };

  window.newOrder=function(){stopLeaseHeartbeat();return originalNewOrder.apply(this,arguments)};

  function saveLeaseMetadata(id,row){
    const values={cloudClaimedBy:row.claimed_by||'',cloudClaimExpiresAt:row.claim_expires_at||'',cloudRowVersion:Number(row.row_version||1),cloudReadOnly:false};
    const order=orders.find(o=>o.id===id);if(order)Object.assign(order,values);
    if(current?.id===id)Object.assign(current,values);
    saveLocal();
  }
  function markLeaseLost(id){
    stopLeaseHeartbeat();
    const order=orders.find(o=>o.id===id);if(order)order.cloudReadOnly=true;
    if(current?.id===id){current.cloudReadOnly=true;renderOrder();activeOrderTag.textContent='Read-only · '+id}
    saveLocal();
    syncWarning('Shared edit lock expired and is now owned elsewhere. Local unsynced changes are preserved; reopen the latest shared record before continuing.');
    showToast('Shared edit lock lost - record is now read-only');
  }
  async function renewLease(){
    if(leaseRenewing||!leaseRecordId||current?.id!==leaseRecordId||!current?.supabaseOrderId||current?.cloudReadOnly)return false;
    leaseRenewing=true;
    try{
      const auth=await currentSupabaseWriteUser();
      if(!auth){syncWarning('Could not renew the shared edit lock because Finance is logged out. Local work remains on this device; reconnect before relying on shared save.');return false}
      const claim=await auth.client.rpc('claim_quote_order',{p_order_id:current.supabaseOrderId,p_lease_minutes:LEASE_MINUTES});
      if(claim.error)throw new Error(claim.error.message);
      const row=(claim.data||[])[0];
      if(!row){markLeaseLost(leaseRecordId);return false}
      saveLeaseMetadata(leaseRecordId,row);return true;
    }catch(err){
      console.warn('Shared edit-lock renewal failed',err);
      syncWarning('Shared edit lock could not be renewed. Local work is preserved; retry the shared connection before a long edit continues. '+(err?.message||''));
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

  window.__PX_OPERATIONAL_SHARED_RELIABILITY_TEST__={pendingSharedRecords,LEASE_MINUTES,LEASE_RENEW_MS};
  window.__PX_OPERATIONAL_SHARED_RELIABILITY_ORIGINALS__={claimSharedOrderForEdit:originalClaimSharedOrderForEdit,releaseCurrentSharedClaim:originalReleaseCurrentSharedClaim};
})();
