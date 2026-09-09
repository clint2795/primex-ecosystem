// R5H: domain orchestration only. The authoritative Finance engine owns all
// prices, totals, stock, persistence, messages, locks and transitions.
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const fail=message=>{throw new Error(message)};
export function createQuoteDomainAdapter(port){
  if(!port||typeof port.read!=='function'||typeof port.command!=='function')fail('A Finance authority port is required.');
  let busy=false;
  const read=()=>clone(port.read());
  const saved=id=>clone(port.readSaved(id));
  async function run(name,payload,check){
    if(busy)fail('Another quote operation is in progress.');
    busy=true;
    try{
      const before=read();
      const result=await port.command(name,payload);
      if(result===false)fail('Finance did not complete '+name+'.');
      const after=read();
      if(check&&!check(before,after,result))fail('Finance did not confirm '+name+'. Review the current record before retrying.');
      return after;
    }finally{busy=false}
  }
  function editable(){const s=read();if(s.readOnly)fail('This record is read-only.');if(s.acceptedSnapshot||s.commercialLock)fail('Accepted commercial details are locked.');return s}
  function approved(){const s=editable();if(!s.isQuote||!s.approvalCurrent)fail('Approve the current quote first.');return s}
  function savedApproved(){const s=approved(),o=saved(s.id);if(!o||!o.quoteApproval||o.quoteApproval.fingerprint!==s.quoteApproval?.fingerprint)fail('Save the current approved quote first.');return {s,o}}
  return Object.freeze({
    read,
    list:()=>clone(port.list()),
    async open(id){if(!id)fail('Select a quote.');return run('open',id,(_,s)=>s.id===id&&s.isQuote)},
    async newQuote(source='manual'){return run('newQuote',source,(_,s)=>s.isQuote&&!s.acceptedSnapshot)},
    async saveDraft(){const s=editable();if(!s.isQuote)fail('Open a quote first.');return run('saveDraft',null,(_,s,r)=>r!==false&&!!saved(s.id))},
    async approve(){const s=editable();if(!s.isQuote)fail('Open a quote first.');return run('approve',null,(_,s)=>s.approvalCurrent&&!!s.quoteApproval)},
    async prepareMessage(){savedApproved();return run('prepareMessage',null,(_,s)=>s.messagePrepared===true)},
    async recordAcceptance(){
      const {s,o}=savedApproved();
      if(s.quoteStatus!=='Quote sent / waiting customer'||o.quoteStatus!=='Quote sent / waiting customer'||o.confirmation!=='Yes')fail('Record the actual customer message as sent before acceptance.');
      if(!s.messageCurrent)fail('The saved customer message must be current.');
      return run('recordAcceptance',null,(_,s)=>!!s.acceptedSnapshot&&s.quoteStatus==='Customer replied / ready to convert');
    },
    async convert(){
      const s=read();if(!s.isQuote||!s.acceptedSnapshot)fail('A locked accepted quote is required.');
      if(s.convertedOrderId)fail('This quote is already converted.');
      const source=s.id;
      return run('convert',null,(_,s,r)=>s.isQuote===false&&s.sourceQuoteId===source&&!!s.commercialLock&&r!==false);
    },
    async saveConvertedOrder(){
      const s=read();if(s.isQuote||!s.sourceQuoteId||!s.commercialLock)fail('Open a converted live order first.');
      return run('saveConvertedOrder',null,(_,s,r)=>r!==false&&!!saved(s.id));
    },
    get busy(){return busy}
  });
}
