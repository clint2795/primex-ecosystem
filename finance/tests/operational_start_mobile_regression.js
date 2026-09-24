const fs=require('fs');
const path=require('path');
const assert=require('assert');

const finance=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');

assert(finance.includes('<section class="start-mission">'),'Mission Control must not regain an outer card');
assert(!finance.includes('<div id="startActionPrompts" class="card slim"'),'Next actions must not regain a nested card');
assert(!finance.includes('<div id="startStockAlerts" class="card slim"'),'Stock alerts must not regain a nested card');
assert(finance.indexOf('id="missionControlCards"')<finance.indexOf('id="startNextActionsSection"'),'Active intake/message/stock work must stay immediately below New Order');
assert(finance.includes("startWorkflowSummaryData(data).filter(item=>item.count>0)"),'Zero workflow stages must stay suppressed');
assert(finance.includes("].filter(x=>x[1]>0);"),'Zero request/message/stock rows must stay suppressed');
assert(finance.includes("No active quote or order work."),'Workflow needs one compact all-clear state');
assert(finance.includes("missionControlCards.classList.toggle('hide',!items.length)"),'Zero intake/message/stock rows must remain hidden');
for(const redundant of ["<strong>Order history</strong>","<strong>Request Inbox</strong>","<strong>Stock</strong>"]){
  const start=finance.indexOf('<main id="view-start"'),end=finance.indexOf('<main id="view-order"');
  assert(!finance.slice(start,end).includes(redundant),'Redundant mobile-navigation shortcut returned: '+redundant);
}
for(const token of [
  '#view-start .start-mission>.section-title{padding-left:12px;border-left:2px solid #557d9a}',
  '#view-start .start-mission .queue-card{display:grid',
  'border-left:2px solid #35536f',
  '#view-start .start-mission>.section-title>.btn{width:100%;min-height:46px',
  '#view-start .sysmap button{min-height:62px',
  '#view-start .btn{min-height:42px}',
  '#view-start .start-priority.is-clear',
  '#view-start .start-attention-row',
]) assert(finance.includes(token),'Missing operational Start/mobile invariant: '+token);

console.log('Operational Start/mobile flattening regression: PASS');
