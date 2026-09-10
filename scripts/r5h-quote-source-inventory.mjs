import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const file='finance-operator-layout-review/index.html';
const html=fs.readFileSync(file,'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
const source=scripts.join('\n');
new vm.Script(source,{filename:file});
const functions=[...source.matchAll(/(?:^|\n)\s*(?:async\s+)?function\s+([\w$]+)\s*\(/g)].map(m=>m[1]);
const names=['newQuote','newEmailQuote','loadOrder','saveOrderNow','approveCurrentQuote','startSendQuoteWorkflow','markCurrentQuoteAccepted','convertCurrentQuoteToLive','customerMessageIsCurrent','ensureCustomerMessageCurrent','customerMessageDependencyFingerprint','orderPayload','markCommunicationSent','markConfirmationSent','setCommStatus','commercialSnapshotData','quoteApprovalIssues','currentSupabaseWriteUser','showView'];
console.log('Source:',file,'Script bytes:',source.length);
console.log('Relevant functions:',JSON.stringify(functions.filter(n=>/quote|accept|convert|commercial|message|saveOrder|loadOrder|stock/i.test(n))));
for(const name of names){
 const re=new RegExp('(?:^|\\n)\\s*(?:async\\s+)?function\\s+'+name+'\\s*\\(');
 const match=re.exec(source);if(!match)continue;
 const start=match.index;const opening=source.indexOf('{',start);if(opening<0)continue;
 let depth=0,end=opening,inString=null,escaped=false,comment=null;
 for(let i=opening;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(comment==='line'){if(c==='\n')comment=null;continue;}
  if(comment==='block'){if(c==='*'&&n==='/'){comment=null;i++;}continue;}
  if(inString){if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}if(c===inString)inString=null;continue;}
  if(c==='/'&&n==='/'){comment='line';i++;continue;}if(c==='/'&&n==='*'){comment='block';i++;continue;}
  if(c==='"'||c==="'"||c==='`'){inString=c;continue;}
  if(c==='{')depth++;if(c==='}'&&--depth===0){end=i+1;break;}
 }
 console.log('\n### '+name+'\n'+source.slice(start,end).slice(0,18000));
}
assert(source.includes('COMMERCIAL_AUTHORITY_VERSION'));
console.log('\nInventory complete; no application state executed or changed.');
