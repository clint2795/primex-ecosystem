import fs from 'node:fs';
import vm from 'node:vm';

const baselinePath='finance-completion-review/index.html';
const candidatePath='finance-operator-layout-review/index.html';
const baseline=fs.readFileSync(baselinePath,'utf8');
const candidate=fs.readFileSync(candidatePath,'utf8');

function assert(ok,message){if(!ok)throw new Error(message)}
function inlineScript(source){
  return [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match=>match[1]).filter(value=>value.trim()).join('\n');
}
function normaliseReviewMarker(source){return source.replaceAll('PX-ROUTE-R5G','PX-ROUTE-R5F')}

const candidateScript=inlineScript(candidate);
new vm.Script(candidateScript,{filename:candidatePath});
assert(normaliseReviewMarker(candidateScript)===inlineScript(baseline),'R5G changed application logic outside the review marker');

[
  'PX-ROUTE-R5G OPERATOR LAYOUT',
  'PX-ROUTE-R5G JS OK',
  'R5G operator layout authority',
  'mission-control-layout',
  'start-secondary-grid',
  'stock-operations',
  'stock-overview-title',
  'font-size:16px',
  'padding-bottom:84px',
  'min-height:44px'
].forEach(token=>assert(candidate.includes(token),'Missing R5G operator-layout control: '+token));

assert(candidate.indexOf('stock-overview-title')<candidate.indexOf('stock-operations{order:6}'),'Stock overview ordering authority is missing');
assert(candidate.includes('<details class="stock-operations"><summary>Receive or adjust stock</summary>'),'Stock operations are not collapsed');
assert(!candidate.includes('PX-ROUTE-R5F COMBINED REVIEW'),'Old visible R5F review marker remains');
assert(candidate.includes('.wrap,.nav-inner{max-width:1180px}'),'Desktop workspace width was not increased');
assert(candidate.includes('.workflow-stage-tabs{display:grid;grid-template-columns:repeat(4'),'Workflow filters are not compact');

console.log('Finance operator layout verification passed');
