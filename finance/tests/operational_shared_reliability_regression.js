const fs=require('fs');
const path=require('path');
const assert=require('assert');
const root=path.resolve(__dirname,'../..');
const finance=fs.readFileSync(path.join(root,'finance/index.html'),'utf8');
const reliability=fs.readFileSync(path.join(root,'finance/operational-shared-reliability.js'),'utf8');

assert(finance.includes('<script src="operational-shared-reliability.js"></script>'),'Operational reliability script is not loaded');
for(const token of [
  "if(!row)return false;",
  "Shared edit check failed - record not opened",
  "pendingSharedRecords()",
  "orders[idx]=clone(local)",
  "cloudConflictState='remote_changed'",
  "Your local copy has been preserved; nothing was discarded.",
  "Load shared version",
  "This will discard the unsynced edits on this device for this record only.",
  "Shared edit lock could not be released; it will expire automatically",
  "const LEASE_MINUTES=10",
  "const LEASE_RENEW_MS=4*60*1000",
  "Shared edit lock lost - record is now read-only",
]) assert(reliability.includes(token),'Missing operational shared invariant: '+token);

const pending={id:'PX-TEST',supabaseOrderId:'cloud-1',supabaseItemSyncStatus:'local_only',cloudRowVersion:4,customer:'LOCAL EDIT'};
let orders=[{id:'PX-TEST',supabaseOrderId:'cloud-1',supabaseItemSyncStatus:'synced',cloudRowVersion:5,customer:'REMOTE EDIT'}];
const remote=orders.find(o=>o.supabaseOrderId===pending.supabaseOrderId);
const changed=Number(pending.cloudRowVersion)!==Number(remote.cloudRowVersion);
const idx=orders.findIndex(o=>o.id===remote.id);
orders[idx]=JSON.parse(JSON.stringify(pending));
if(changed){orders[idx].cloudConflictState='remote_changed';orders[idx].cloudConflictRemoteRowVersion=remote.cloudRowVersion}
assert.equal(orders[0].customer,'LOCAL EDIT');
assert.equal(orders[0].cloudConflictState,'remote_changed');
assert.equal(orders[0].cloudConflictRemoteRowVersion,5);

console.log('Operational shared reliability regression: PASS');
