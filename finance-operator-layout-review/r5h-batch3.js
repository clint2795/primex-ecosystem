// PrimeX Finance HQ R5H Batch 3 — protected shared reliability / conflict recovery guards.
// Loaded only on /finance-operator-layout-review/ after Batch 2.
(function primeXR5HBatch3(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(window.__PX_R5H_BATCH3__) return;
  window.__PX_R5H_BATCH3__=true;

  const originalClaimSharedOrderForEdit=window.claimSharedOrderForEdit;
  const originalLoadOrder=window.loadOrder;
  const originalRefreshCloudOrders=window.refreshCloudOrders;
  const originalReleaseCurrentSharedClaim=window.releaseCurrentSharedClaim;
  const remoteConflictSnapshots=new Map();
  let claimFailure=null;

  function clone(v){return JSON.parse(JSON.stringify(v))}
  function pendingSharedRecords(){
    return (orders||[]).filter(o=>o?.supabaseOrderId&&String(o.supabaseItemSyncStatus||'')!=='synced').map(clone);
  }
  function findRecord(id){return (orders||[]).find(o=>o.id===id)}
  function syncWarning(message){
    try{setOrderDbSyncStatus(message,'warn')}catch(_){showToast(message)}
  }

  // Distinguish a genuine active claim (empty RPC result) from auth/network/RPC failure.
  window.claimSharedOrderForEdit=async function(o){
    claimFailure=null;
    if(!o?.supabaseOrderId)return true;
    try{
      const auth=await requireSupabaseWriteUser('opening a shared record');
      const claim=await auth.client.rpc('claim_quote_order',{p_order_id:o.supabaseOrderId,p_lease_minutes:10});
      if(claim.error)throw new Error(claim.error.message);
      const row=(claim.data||[])[0];
      if(!row)return false; // The deployed RPC returns no row only when an active claim prevents acquisition.
      Object.assign(o,{cloudClaimedBy:row.claimed_by||'',cloudClaimExpiresAt:row.claim_expires_at||'',cloudRowVersion:Number(row.row_version||o.cloudRowVersion||1),cloudReadOnly:false});
      await writeFinanceAudit(auth.client,auth.user,'quotes_orders',o.supabaseOrderId,'claimed',{order_ref:o.id,expires_at:row.claim_expires_at});
      return true;
    }catch(err){
      claimFailure=err;
      throw err;
    }
  };

  // Infrastructure failure must never masquerade as “another operator is editing”.
  window.loadOrder=async function(id){
    try{
      return await originalLoadOrder.apply(this,arguments);
    }catch(err){
      const message='Could not check the shared edit lock. The record was not opened for editing. Retry when the shared connection is available.';
      console.error('Shared record open failed',err);
      syncWarning(message+(err?.message?' '+err.message:''));
      showToast('Shared edit check failed - record not opened');
      return false;
    }
  };

  function conflictControlsHost(){
    const status=document.getElementById('orderDbSyncStatus');
    if(!status)return null;
    let host=document.getElementById('r5hSharedConflictControls');
    if(host)return host;
    host=document.createElement('div');
    host.id='r5hSharedConflictControls';
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
    const host=conflictControlsHost();if(!host)return;
    host.classList.remove('hide');
    host.innerHTML='<strong>Shared version changed</strong><br><span class="tiny">This device has unsynced edits. Your local copy has been preserved; nothing was discarded.</span><div class="btnrow" style="margin-top:10px"><button class="btn" id="r5hKeepLocalConflict" type="button">Keep local copy</button><button class="btn warn" id="r5hLoadSharedConflict" type="button">Load shared version</button></div>';
    document.getElementById('r5hKeepLocalConflict').onclick=()=>{
      host.classList.add('hide');
      syncWarning('Local unsynced copy kept. Reconcile the changed shared record before retrying the online backup.');
    };
    document.getElementById('r5hLoadSharedConflict').onclick=()=>window.r5hLoadSharedConflict(local.id);
  }

  window.r5hLoadSharedConflict=async function(id){
    const remote=remoteConflictSnapshots.get(id);if(!remote){showToast('Shared recovery copy is no longer available - refresh again');return false}
    if(!confirm('Load the latest shared version of '+id+'?\n\nThis will discard the unsynced edits on this device for this record only.'))return false;
    const idx=orders.findIndex(o=>o.id===id);if(idx<0)return false;
    orders[idx]=clone(remote);
    saveLocal();recalcStock();renderAll();
    remoteConflictSnapshots.delete(id);clearConflictControls();
    await window.loadOrder(id);
    showToast('Latest shared version loaded');
    return true;
  };

  // Preserve unsynced edits to existing cloud-backed records across manual, realtime and focus refreshes.
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
      if(idx>=0)orders[idx]=clone(local);
      preserved++;
      if(changed){
        orders[idx].cloudConflictState='remote_changed';
        orders[idx].cloudConflictRemoteRowVersion=remoteVersion;
        orders[idx].cloudConflictDetectedAt=new Date().toISOString();
        remoteConflictSnapshots.set(local.id,clone(remote));
        conflicts++;
        if(current?.id===local.id)showConflictControls(orders[idx],remote);
      }
    }
    if(preserved){
      saveLocal();recalcStock();renderAll();
      if(conflicts){
        syncWarning('Shared Finance changed while this device has unsynced edits. Local edits were preserved; review the conflict before retrying.');
      }else if(!options?.silent){
        syncWarning('Shared Finance refreshed. Unsynced local edits were preserved for retry.');
      }
    }
    return ok;
  };

  // A failed unlock should be visible, but safe: the server lease still expires automatically.
  window.releaseCurrentSharedClaim=async function(){
    const id=current?.supabaseOrderId;
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

  // Keep the old functions available only for diagnostic comparison; all live protected calls use the guards above.
  window.__PX_R5H_BATCH3_ORIGINALS__={claimSharedOrderForEdit:originalClaimSharedOrderForEdit,releaseCurrentSharedClaim:originalReleaseCurrentSharedClaim};
})();
