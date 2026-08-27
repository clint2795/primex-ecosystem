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
    #missionControlCards .queue-card.r5g-actionable,
    #queueCards .queue-card.r5g-actionable{
      border-color:#496a84;
      background:linear-gradient(180deg,#102033 0%,#0b151f 100%);
      box-shadow:inset 0 2px 0 rgba(110,168,216,.62),0 8px 20px rgba(0,0,0,.18);
    }
    #missionControlCards .queue-card.r5g-actionable .k,
    #queueCards .queue-card.r5g-actionable .k{color:#d9eaf7}
    #missionControlCards .queue-card.r5g-actionable .n,
    #queueCards .queue-card.r5g-actionable .n{color:#f6fbff}
    #missionControlCards .queue-card.r5g-actionable .s,
    #queueCards .queue-card.r5g-actionable .s{color:#a8bdcc}
    #missionControlCards .queue-card.r5g-actionable:hover,
    #queueCards .queue-card.r5g-actionable:hover{
      border-color:#6287a4;
      background:linear-gradient(180deg,#12253a 0%,#0c1723 100%);
    }

    /* Clear Start-page heading hierarchy without changing the layout language. */
    #view-start .section-title h2,
    #view-start .section-title h3,
    #view-start > .card > .subhead{
      color:#f1f7fc;
    }
    #view-start .section-title p{
      color:#9eb2c3;
    }
    #view-start .queue-card .k{
      color:#cbd9e5;
    }
    #view-start .queue-card:not(.r5g-actionable) .s{
      color:#8fa3b5;
    }

    /* Desktop: real work gets the width; shortcuts sit below it. */
    @media (min-width:761px){
      #view-start .start-secondary-grid{
        grid-template-columns:minmax(0,1fr);
        gap:10px;
      }
      #view-start .start-secondary-grid > section:nth-child(2){
        order:1;
      }
      #view-start .start-secondary-grid > section:nth-child(1){
        order:2;
      }
      #view-start .start-secondary-grid > section:nth-child(2) #startActionPrompts{
        width:100%;
      }
      #view-start .start-secondary-grid > section:nth-child(1) .sysmap{
        grid-template-columns:repeat(5,minmax(0,1fr));
      }
    }
  `;
  document.head.appendChild(style);

  function updateContainer(container){
    if(!container) return;
    container.querySelectorAll('.queue-card').forEach(card=>{
      const countEl=card.querySelector('.n');
      const isInformational=!!countEl?.dataset?.value;
      const count=Number(String(countEl?.textContent||'').replace(/[^0-9.-]/g,''));
      card.classList.toggle('r5g-actionable',!isInformational&&Number.isFinite(count)&&count>0);
    });
  }

  function start(){
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
