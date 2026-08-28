// PrimeX Finance HQ v44B local Supabase config example.
// Copy this file to config.js locally and fill in only the public project URL and anon public key.
// Do not add a service role key, database password, JWT secret, connection string, or customer data here.
window.PRIMEX_SUPABASE_CONFIG = {
  url: 'https://lamibbavnjwaoiwpqpxj.supabase.co',
  publishableKey: 'sb_publishable_o2EgvL_LXvKDQ0qVd5zA1g_yygyMP0y'
};

// R5G protected-review visual helper only.
// Live /finance/ is deliberately excluded by the pathname guard below.
(function primeXR5GActionableCards(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;

  const style=document.createElement('style');
  style.id='px-r5g-actionable-card-style';
  style.textContent=`
    /* Outstanding work: crisp status cue, not a heavy glowing frame. */
    #missionControlCards .queue-card.r5g-actionable,
    #queueCards .queue-card.r5g-actionable{
      border:1px solid #3b6280;
      background:linear-gradient(180deg,#0a151f 0%,#071018 100%);
      box-shadow:inset 1.5px 0 0 #46b3ff,inset 0 1px 0 rgba(174,226,255,.40),0 7px 16px rgba(0,0,0,.18);
    }
    #missionControlCards .queue-card.r5g-actionable .k,
    #queueCards .queue-card.r5g-actionable .k{
      color:#e7f2fa;
      font-weight:600;
    }
    #missionControlCards .queue-card.r5g-actionable .n,
    #queueCards .queue-card.r5g-actionable .n{
      color:#f7fcff;
      font-weight:700;
    }
    #missionControlCards .queue-card.r5g-actionable .s,
    #queueCards .queue-card.r5g-actionable .s{color:#a9bdcc}
    #missionControlCards .queue-card.r5g-actionable:hover,
    #queueCards .queue-card.r5g-actionable:hover{
      border-color:#4f7c9e;
      background:linear-gradient(180deg,#0c1a27 0%,#09131d 100%);
      box-shadow:inset 1.5px 0 0 #62c0ff,inset 0 1px 0 rgba(196,237,255,.50),0 8px 18px rgba(0,0,0,.20);
    }

    /* Zero states step back so the eye does not have to read every card. */
    #missionControlCards .queue-card.r5g-passive,
    #queueCards .queue-card.r5g-passive{
      border-color:#1e2c3a;
      background:#080d13;
      box-shadow:none;
    }
    #missionControlCards .queue-card.r5g-passive .k,
    #queueCards .queue-card.r5g-passive .k{
      color:#899aa9;
      font-weight:540;
    }
    #missionControlCards .queue-card.r5g-passive .n,
    #queueCards .queue-card.r5g-passive .n{
      color:#9aa8b4;
      font-weight:620;
    }
    #missionControlCards .queue-card.r5g-passive .s,
    #queueCards .queue-card.r5g-passive .s{color:#748696}

    /* Informational value card remains readable but does not impersonate a task. */
    #queueCards .queue-card.r5g-info{
      border-color:#253748;
      background:#091018;
      box-shadow:none;
    }
    #queueCards .queue-card.r5g-info .k{color:#a9bac8;font-weight:560}
    #queueCards .queue-card.r5g-info .n{color:#dce8f1;font-weight:650}
    #queueCards .queue-card.r5g-info .s{color:#8fa2b2}

    /* Clear Start-page heading hierarchy without changing the layout language. */
    #view-start .section-title h2,
    #view-start .section-title h3,
    #view-start > .card > .subhead{color:#f1f7fc}
    #view-start .section-title p{color:#9eb2c3}

    /* Actual next-action jobs should be prominent by position/state, not excessive bold. */
    #view-start #startActionPrompts .alert-row{
      border-left:2px solid #46b3ff;
      background:#0b121b;
    }
    #view-start #startActionPrompts .alert-row > div:first-child strong{font-weight:600}
    #view-start #startActionPrompts .alert-row > div:first-child p{font-weight:430}

    /* Start-page action buttons: nearly black face, thin PrimeX edge, minimal fill. */
    #view-start #newEmailQuoteStart,
    #view-start #startActionPrompts .alert-row > button.secondary{
      border:1px solid #4b8eb8;
      background:#0a121a;
      color:#eef8ff;
      box-shadow:inset 0 1px 0 rgba(140,216,255,.19);
      font-weight:600;
    }
    #view-start #newEmailQuoteStart:hover,
    #view-start #startActionPrompts .alert-row > button.secondary:hover{
      border-color:#67b5e4;
      background:#0c1822;
      box-shadow:inset 0 1px 0 rgba(181,232,255,.31);
    }

    /* One operator priority order on every viewport: work before shortcuts. */
    #view-start .start-secondary-grid{
      display:grid;
      grid-template-columns:minmax(0,1fr);
      gap:10px;
    }
    #view-start .start-secondary-grid > section:nth-child(2){order:1}
    #view-start .start-secondary-grid > section:nth-child(1){order:2}
    #view-start .start-secondary-grid > section:nth-child(2) #startActionPrompts{width:100%}

    /* Desktop: shortcuts use the extra width once real work has been shown first. */
    @media (min-width:761px){
      #view-start .start-secondary-grid > section:nth-child(1) .sysmap{
        grid-template-columns:repeat(5,minmax(0,1fr));
      }
    }
  `;
  document.head.appendChild(style);

  function enforceStartPriorityOrder(){
    const grid=document.querySelector('#view-start .start-secondary-grid');
    if(!grid) return;
    const quick=grid.querySelector(':scope > section:nth-child(1)');
    const next=grid.querySelector(':scope > section:nth-child(2)');
    if(quick&&next&&grid.firstElementChild!==next) grid.insertBefore(next,quick);
  }

  function updateContainer(container){
    if(!container) return;
    container.querySelectorAll('.queue-card').forEach(card=>{
      const countEl=card.querySelector('.n');
      const isInformational=!!countEl?.dataset?.value;
      const count=Number(String(countEl?.textContent||'').replace(/[^0-9.-]/g,''));
      const actionable=!isInformational&&Number.isFinite(count)&&count>0;
      const passive=!isInformational&&Number.isFinite(count)&&count===0;
      card.classList.toggle('r5g-actionable',actionable);
      card.classList.toggle('r5g-passive',passive);
      card.classList.toggle('r5g-info',isInformational);
    });
  }

  function start(){
    enforceStartPriorityOrder();
    ['missionControlCards','queueCards'].forEach(id=>{
      const container=document.getElementById(id);
      if(!container) return;
      updateContainer(container);
      new MutationObserver(()=>updateContainer(container)).observe(container,{childList:true});
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
