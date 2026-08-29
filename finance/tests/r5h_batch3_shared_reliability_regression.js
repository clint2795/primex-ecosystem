// PrimeX Finance HQ R5H Batch 3 focused regression.
// Run with: node finance/tests/r5h_batch3_shared_reliability_regression.js
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const root=path.resolve(__dirname,'../..');
const patch=fs.readFileSync(path.join(root,'finance-operator-layout-review/r5h-batch3.js'),'utf8');
const loader=fs.readFileSync(path.join(root,'finance-operator-layout-review/r5h-batch1.js'),'utf8');

function has(text){assert.ok(patch.includes(text),'Missing Batch 3 invariant: '+text)}

has("if(!location.pathname.includes('/finance-operator-layout-review/')) return;");
has("if(!row)return false; // The deployed RPC returns no row only when an active claim prevents acquisition.");
has("throw err;");
has("Shared edit check failed - record not opened");
has("pendingSharedRecords()");
has("String(o.supabaseItemSyncStatus||'')!=='synced'");
has("orders[idx]=clone(local)");
has("cloudConflictState='remote_changed'");
has("Your local copy has been preserved; nothing was discarded.");
has("Load shared version");
has("This will discard the unsynced edits on this device for this record only.");
has("Shared edit lock could not be released; it will expire automatically");

assert.ok(loader.includes("r5h-batch3.js?v=1"),'Batch 3 loader is missing');
assert.ok(loader.includes('batch2.onload'),'Batch 3 must load only after Batch 2');
assert.ok(!patch.includes("location.pathname.includes('/finance/')"),'Patch must not target live /finance/');

// Model the critical refresh invariant: pending local state wins over a refresh copy until explicit resolution.
const pending={id:'PX-TEST',supabaseOrderId:'cloud-1',supabaseItemSyncStatus:'local_only',cloudRowVersion:4,customer:'LOCAL EDIT'};
let orders=[{id:'PX-TEST',supabaseOrderId:'cloud-1',supabaseItemSyncStatus:'synced',cloudRowVersion:5,customer:'REMOTE EDIT'}];
const remote=orders.find(o=>o.supabaseOrderId===pending.supabaseOrderId);
const changed=Number(pending.cloudRowVersion)!==Number(remote.cloudRowVersion);
const idx=orders.findIndex(o=>o.id===remote.id);
orders[idx]=JSON.parse(JSON.stringify(pending));
if(changed){orders[idx].cloudConflictState='remote_changed';orders[idx].cloudConflictRemoteRowVersion=remote.cloudRowVersion}
assert.equal(orders[0].customer,'LOCAL EDIT','Unsynced local edit was not preserved');
assert.equal(orders[0].cloudConflictState,'remote_changed','Remote row-version change was not surfaced');
assert.equal(orders[0].cloudConflictRemoteRowVersion,5,'Remote row version was not retained for recovery evidence');

console.log('R5H Batch 3 shared reliability regression: PASS');
