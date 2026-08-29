#!/usr/bin/env node
'use strict';

const fs=require('fs');
const assert=require('assert');

const neat=fs.readFileSync('finance-operator-layout-review/r5h-order-neatness.js','utf8');
const loader=fs.readFileSync('finance-operator-layout-review/r5h-batch1.js','utf8');

assert.doesNotThrow(()=>new Function(neat),'Order neatness script must parse');
assert(neat.includes("location.pathname.includes('/finance-operator-layout-review/')"),'Order neatness must remain protected-route only');
assert(loader.includes("/finance-operator-layout-review/r5h-order-neatness.js?v=1"),'Protected loader must include Order neatness after R5H Batch 4');

// Viewport containment: the whole app must never slide sideways on mobile.
assert(neat.includes('html,body{max-width:100%;overflow-x:hidden}'),'Root horizontal containment missing');
assert(neat.includes('.wrap,.view,#view-order,#view-order>*{min-width:0;max-width:100%}'),'Order/root min-width containment missing');
assert(neat.includes('#view-order input,#view-order select,#view-order textarea,#view-order button{min-width:0;max-width:100%}'),'Order controls must be width constrained');
assert(neat.includes('input[type="date"],#view-order input[type="datetime-local"]{width:100%;min-width:0;max-width:100%'),'iOS date controls must be constrained');
assert(neat.includes('#view-order{width:100%;overflow-x:hidden}'),'Mobile Order view must not horizontally scroll');

// Human hierarchy / naming.
assert(neat.includes("pageTitle.textContent='Customer Request Form'"),'Page title must be Customer Request Form');
assert(neat.includes("titleSection(sections[0],1,5,'Customer Details')"),'Step 1 must be Customer Details');
assert(neat.includes("titleSection(sections[1],2,5,'Requested Items')"),'Step 2 must be Requested Items');
assert(neat.includes("titleSection(sections[2],3,5,'Order Summary')"),'Step 3 must be Order Summary');
assert(neat.includes("titleSection(sections[3],4,5,'Payment & Save')"),'Step 4 must be Payment & Save');
assert(neat.includes("titleSection(sections[4],5,5,'Fulfilment & Messages')"),'Step 5 must be Fulfilment & Messages');
assert(neat.includes('px-step-kicker'),'Step marker style missing');

// Passive explanatory copy must be reduced rather than presented as another heavy job card.
assert(neat.includes("Quote / enquiry only. Convert to a live order after the customer confirms."),'Quote helper copy should be concise');
assert(neat.includes('#view-order #orderTypeNotice{margin-top:8px;padding:9px 10px;border:0;border-left:2px solid'),'Order-type helper must be visually quieter than a section card');

console.log('R5H Order neatness/mobile containment regression: PASS');
