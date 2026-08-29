// PrimeX Finance HQ R5H — protected Order/Quote neatness + mobile viewport containment.
(function primeXR5HOrderNeatness(){
  if(!location.pathname.includes('/finance-operator-layout-review/')) return;
  if(window.__PX_R5H_ORDER_NEATNESS__) return;
  window.__PX_R5H_ORDER_NEATNESS__=true;

  const style=document.createElement('style');
  style.id='px-r5h-order-neatness-style';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    .wrap,.view,#view-order,#view-order>*{min-width:0;max-width:100%}
    #view-order .grid,#view-order .field,#view-order .card,#view-order details,#view-order section,#view-order .btnrow,#view-order .section-title{min-width:0;max-width:100%}
    #view-order input,#view-order select,#view-order textarea,#view-order button{min-width:0;max-width:100%}
    #view-order input[type="date"],#view-order input[type="datetime-local"]{width:100%;min-width:0;max-width:100%;-webkit-appearance:none}
    #view-order .order-page-title{margin:2px 0 8px;padding:0 2px}
    #view-order .order-page-title h2{font-size:23px;line-height:1.2;font-weight:760;letter-spacing:0}
    #view-order>.operator-guide.compact-order-guidance{margin:0 0 16px;padding:8px 11px;border-left:3px solid #5f8db0;background:#09131c;box-shadow:none}
    #view-order>.operator-guide.compact-order-guidance strong{font-size:14px;font-weight:680;letter-spacing:.01em}
    #view-order>section.card{margin:18px 0;padding:15px 14px;border:1px solid #26394b;border-top:1px solid #31506a;border-left:2px solid #4d7694;border-radius:8px;box-shadow:0 9px 22px rgba(0,0,0,.16)}
    #view-order>section.card>.section-title{margin-bottom:13px;padding-bottom:10px;border-bottom:1px solid #22384a;align-items:flex-end}
    #view-order>section.card>.section-title h2{font-size:19px;line-height:1.25;font-weight:720;letter-spacing:0;color:#eef6fc}
    #view-order .px-step-kicker{display:block;margin-bottom:4px;color:#7f9bb1;font-size:11px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}
    #view-order .px-section-title{display:block}
    #view-order .note:not(.good):not(.warn){border-left-width:2px;background:#09111a;box-shadow:none}
    #view-order #orderTypeNotice{margin-top:8px;padding:9px 10px;border:0;border-left:2px solid #324d64;background:#080d13;color:#b9c8d4;font-size:13px;line-height:1.45}
    #view-order #requestIntakeHelper,#view-order .payment-advanced{border-radius:7px}
    #view-order #requestIntakeHelper,#view-order>section.card>details.payment-advanced{border-color:#1f2d3d;background:#080d13}
    #view-order #requestIntakeHelper>summary,#view-order>section.card>details.payment-advanced>summary{font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:none;color:#9fb4c5}
    #view-order section.card.slim{margin:10px 0;padding:11px;border:1px solid #1c2b3a;border-radius:7px;background:#080d13;box-shadow:none}
    #view-order .flow-block,#view-order .structure-box{border-radius:7px;box-shadow:none}
    #view-order .flow-block{border-color:#203247;background:#091018}
    #view-order .subhead{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:none;color:#9fb4c5}
    #view-order .field label{font-size:11px;font-weight:650;letter-spacing:.08em}
    #view-order #optionalDetailsSection{border-left-color:#314d65;border-top-color:#24384c}
    #view-order #optionalDetailsSection>.optional-details-toggle>summary strong{font-size:17px;font-weight:700}
    #view-order .divider{background:#1e3040}
    @media(max-width:760px){
      .wrap{width:100%;max-width:100%;overflow-x:hidden}
      #view-order{width:100%;overflow-x:hidden}
      #view-order .grid.two,#view-order .grid.three,#view-order .grid.four{grid-template-columns:minmax(0,1fr)}
      #view-order>section.card{margin:14px 0;padding:13px 11px;border-left-width:2px}
      #view-order>section.card>.section-title{margin-bottom:11px;padding-bottom:9px}
      #view-order .order-page-title h2{font-size:21px}
      #view-order>section.card>.section-title h2{font-size:18px}
      #view-order .px-step-kicker{font-size:10px;margin-bottom:3px}
      #view-order #orderTypeNotice{font-size:13px;padding:8px 9px}
      #view-order .field input,#view-order .field select,#view-order .field textarea{width:100%;max-width:100%;min-width:0}
      #view-order .btnrow{width:100%}
      #view-order .btnrow>.btn{max-width:100%}
      #view-order details{width:100%;max-width:100%}
    }
  `;
  document.head.appendChild(style);

  function titleSection(section,step,total,title){
    const heading=section?.querySelector(':scope > .section-title h2');
    if(!heading)return;
    heading.innerHTML='<span class="px-step-kicker">Step '+step+' of '+total+'</span><span class="px-section-title">'+title+'</span>';
  }

  function applyOrderHierarchy(){
    const view=document.getElementById('view-order');if(!view)return;
    const pageTitle=view.querySelector('.order-page-title h2');
    if(pageTitle)pageTitle.textContent='Customer Request Form';

    const sections=[...view.querySelectorAll(':scope > section.card')];
    if(sections[0])titleSection(sections[0],1,5,'Customer Details');
    if(sections[1])titleSection(sections[1],2,5,'Requested Items');
    if(sections[2])titleSection(sections[2],3,5,'Order Summary');
    if(sections[3])titleSection(sections[3],4,5,'Payment & Save');
    if(sections[4])titleSection(sections[4],5,5,'Fulfilment & Messages');

    // Existing inner copy should support the hierarchy rather than compete with it.
    const customerNotice=document.getElementById('orderTypeNotice');
    if(customerNotice&&val('orderType')==='Quote / enquiry')customerNotice.textContent='Quote / enquiry only. Convert to a live order after the customer confirms.';
  }

  const originalRenderOrder=window.renderOrder;
  window.renderOrder=function(){
    const result=originalRenderOrder.apply(this,arguments);
    applyOrderHierarchy();
    return result;
  };

  applyOrderHierarchy();
})();
