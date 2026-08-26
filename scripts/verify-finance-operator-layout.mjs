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
const baselineSelectionFunction="function toggleRequestSelection(id,checked){if(checked)selectedRequestIds.add(id);else selectedRequestIds.delete(id);updateRequestSelectionTools()}";
const candidateSelectionFunction="function toggleRequestSelection(id,checked){if(checked)selectedRequestIds.add(id);else selectedRequestIds.delete(id);document.querySelectorAll('.request-card[data-request-id]').forEach(card=>{if(card.dataset.requestId===id)card.classList.toggle('request-selected',checked)});updateRequestSelectionTools()}";
const baselineStartGuide="'Use New Order for a direct sale, manual quote or historical record.'";
const candidateStartGuide="'Use New quote for an emailed enquiry. Use the Order tab for direct orders and existing order work.'";
const candidateSelectedCard=` \${selected?'request-selected':''}" data-request-id="\${htmlEscape(req.requestId)}"`;
function normaliseReviewMarker(source){return source.replaceAll('PX-ROUTE-R5G','PX-ROUTE-R5F').replace(candidateSelectionFunction,baselineSelectionFunction).replace(candidateStartGuide,baselineStartGuide).replace(candidateSelectedCard,'"')}

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
  'min-height:44px',
  'R5G mobile hierarchy correction',
  'route-fingerprint',
  'runtime-fingerprint',
  '.alert-row>button.secondary',
  '#viewBreadcrumb{display:none}',
  '#historyList .queue-row'
].forEach(token=>assert(candidate.includes(token),'Missing R5G operator-layout control: '+token));

assert(candidate.indexOf('stock-overview-title')<candidate.indexOf('stock-operations{order:5}'),'Stock overview ordering authority is missing');
assert(candidate.includes('<details class="stock-operations"><summary>Receive or adjust stock</summary>'),'Stock operations are not collapsed');
assert(!candidate.includes('PX-ROUTE-R5F COMBINED REVIEW'),'Old visible R5F review marker remains');
assert(candidate.includes('.wrap,.nav-inner{max-width:1180px}'),'Desktop workspace width was not increased');
assert(candidate.includes('.workflow-stage-tabs{display:grid;grid-template-columns:repeat(4'),'Workflow filters are not compact');
assert(candidate.includes('.alert-row{display:grid;grid-template-columns:minmax(0,1fr) auto'),'Mobile action jobs are not deliberately separated');
assert(candidate.includes('.workflow-record-access{border:1px solid #223143'),'Workflow records do not have distinct operator boundaries');
assert(candidate.includes('data-request-id="${htmlEscape(req.requestId)}"'),'Request cards do not expose deterministic selection identity');
assert(candidate.includes('request-selected'),'Selected requests do not receive visible state');
assert(candidate.includes('request-selection-tools{position:fixed'),'Mobile cleanup actions are not persistently surfaced');
assert(candidate.includes('id="newEmailQuoteStart">+ New quote</button>'),'Compact Start quote action is missing');
assert(!candidate.includes('id="newOrderStart">+ Direct order</button>'),'Duplicate Start order action remains');
assert(!candidate.includes('<strong>Quote / enquiry</strong>'),'Duplicate Quick action quote entry remains');

console.log('Finance operator layout verification passed');
