const fs=require('fs');
const path=require('path');
const assert=require('assert');

const finance=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');

assert(finance.includes('<section class="start-mission">'),'Mission Control must not regain an outer card');
assert(!finance.includes('<div id="startActionPrompts" class="card slim"'),'Next actions must not regain a nested card');
assert(!finance.includes('<div id="startStockAlerts" class="card slim"'),'Stock alerts must not regain a nested card');
for(const token of [
  '#view-start .start-mission>.section-title{padding-left:12px;border-left:2px solid #557d9a}',
  '#view-start .start-mission .queue-card{display:grid',
  'border-left:2px solid #35536f',
  '#view-start .start-mission>.section-title>.btn{width:100%;min-height:46px',
  '#view-start .sysmap button{min-height:62px',
  '#view-start .btn{min-height:42px}',
]) assert(finance.includes(token),'Missing operational Start/mobile invariant: '+token);

console.log('Operational Start/mobile flattening regression: PASS');
