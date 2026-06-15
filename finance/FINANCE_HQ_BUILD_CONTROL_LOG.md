# PrimeX Finance HQ Build Control Log

## v42.8Y
- Version: v42.8Y
- Purpose: Morning stabilisation audit + version metadata alignment.
- Files changed:
  - C:\Users\Clint\OneDrive\Documents\PrimeX Ecosystem\finance\index.html
  - C:\Users\Clint\OneDrive\Documents\PrimeX Ecosystem\finance\FINANCE_HQ_BUILD_CONTROL_LOG.md
- What was checked:
  - Active file path, title, boot badge text, key quote/enquiry/repeat/backup strings.
  - Duplicate function declarations by static scan.
  - Malformed `syncFulfilmentPaymentWarningfunction` reference.
  - JavaScript syntax/static parse.
  - Presence of quote/enquiry, convert quote to live order, repeat order, backup, save/update, and stock remove/damaged flows.
- What was not changed:
  - Pricing logic.
  - Stock deduction logic.
  - Retatrutide kit logic.
  - BAC/support charge logic.
  - Quote/enquiry exclusion logic.
  - Repeat order logic.
  - UI design or workflow features.
- Risks / manual browser tests still required:
  - Browser/mobile testing not performed in this patch.
  - Manual test still required for new order, quote conversion, repeat order, backup, save/update, and stock adjustment flows.
  - Existing source still contains mojibake in the old title source before this metadata alignment; broader encoding cleanup was not part of this stabilisation scope.

## v42.8Z
- Version: v42.8Z
- Purpose: Manual Use Readiness Audit.
- Files changed:
  - C:\Users\Clint\OneDrive\Documents\PrimeX Ecosystem\finance\FINANCE_HQ_BUILD_CONTROL_LOG.md
- Checklist added: v42.8Z manual browser test checklist for startup, live orders, Reta kit multiplier, quote/enquiry, repeat order, stock, backup, and queue/workflow checks.

### v42.8Z Manual Browser Test Checklist

#### A. Startup
- Open Finance HQ.
- Confirm Start screen loads without white/blank page.
- Confirm boot badge is visible.
- Confirm queue cards appear immediately.

#### B. New live order
- Click + New Order.
- Add fake customer/contact.
- Add Retatrutide 20mg.
- Test internal/close, existing/private, and planner/standard tier.
- Confirm visible unit price changes.
- Save order.
- Confirm queue count changes.

#### C. Reta kit multiplier
- Create Retatrutide 20mg qty 4.
- Confirm fulfilment/materials show:
  - 4 x Retatrutide 20mg vials
  - 4 x 3ml BAC waters
  - 4 x U100 syringe 10-packs
  - 64 alcohol wipes
  - 4 x magnetic boxes
  - 4 x inserts
  - 4 x inlay cards

#### D. Quote/enquiry
- Create Quote / enquiry order.
- Save it.
- Confirm it does not deduct stock.
- Confirm it does not appear as a live fulfilment job.
- Convert quote to live order.
- Save converted order.
- Confirm it now behaves as a live order.

#### E. Repeat order
- Open existing saved fake order.
- Use Repeat order.
- Confirm new order gets fresh ref/date/status.
- Confirm it does not deduct stock until saved.

#### F. Stock checks
- Confirm saved live order deducts stock.
- Confirm test/past/quote order does not wrongly deduct stock.
- Confirm stock remove/damaged adjustment works.

#### G. Backup
- Click Backup now.
- Confirm export/download happens.
- Confirm app does not crash.

#### H. Queue/workflow
- Awaiting payment shows unpaid orders.
- To pack / fulfil shows paid/ready/assembled orders.
- Ready send / collect shows packed orders.
- Hold/issue shows issue orders.
- Payment warning appears where relevant.

### What was not changed
- App file/version/title/badge remained at v42.8Y because this patch only adds the manual readiness checklist to the build log.
- Pricing logic was not changed.
- Stock deduction logic was not changed.
- Retatrutide kit logic was not changed.
- BAC/support charge logic was not changed.
- Quote/enquiry exclusion logic was not changed.
- Repeat order logic was not changed.
- UI was not redesigned.
- Planner/request/website connections were not added.
- Old/backup folders were not touched.

### Manual tests still requiring user/browser confirmation
- Full startup render on desktop and mobile.
- New live order creation and queue count changes.
- Reta kit qty 4 fulfilment/material display.
- Quote save, stock exclusion, conversion, and live-order behaviour.
- Repeat order fresh ref/date/status and stock timing.
- Stock remove/damaged adjustment.
- Backup export/download.
- Queue/workflow lane behaviour and payment warnings.

### Risks
- Browser/mobile testing has not been performed.
- Static inspection found residual mojibake in some app strings; this was not changed because v42.8Z scope is build-log checklist only.
- Manual testing is required before relying on the app for live use.


## v42.9A Daily Action Alerts + Communication Centre

Version: v42.9A
Purpose: Add a lightweight daily-use action layer before Clint/Jade browser testing.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What was added:
- Sticky Action Banner scaffold for important unresolved operational alerts.
- Start screen Action Alerts card backed by derived order/stock alerts.
- Bottom Communication Centre scaffold with lifecycle rows for order confirmation, payment message, fulfilment update, dispatch/collection update, and tracking/sent update.
- Safe communication status fields on saved orders with defaults for old orders.
- Lightweight post-save and stage nudges for confirmation, payment, fulfilment, postage/label, and tracking checks.

What was not changed:
- Pricing logic.
- Stock deduction formulas.
- Retatrutide kit logic.
- BAC/support charge logic.
- Quote/enquiry exclusion logic.
- Repeat order logic.
- Planner, website, Request Hub, CRM, backend, WhatsApp/email/SMS/Royal Mail APIs, and real label printing.

Checks performed:
- JavaScript syntax check required after patch.
- Duplicate function declaration scan required after patch.
- Malformed concatenated function-name scan required after patch.
- Protected flow string scan required after patch.

Known risks / manual browser tests still required:
- Browser/mobile rendering has not been verified in this entry.
- Communication Centre rows are a scaffold and intentionally park unsupported payment/courier-specific message behaviours.
- Clint/Jade should manually test Start alerts, order save nudges, confirmation generation/copy/mark-sent, fulfilment update generation/copy/mark-sent, quote conversion, repeat order, stock adjustment, and backup export.


## v42.9B Stabilisation Privacy Encoding Fix

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What was fixed:
- Corrected mojibake currency and separator text so pound signs and symbols render correctly.
- Added public GitHub Pages prototype guard so saved browser orders are not loaded by default on public Pages.
- Added visible prototype data warning and Clear test data / Reset local data action.
- Guarded missing-view navigation to avoid null classList errors from stale/invalid view targets.

What was not changed:
- Pricing logic.
- Stock deduction logic.
- Retatrutide kit logic.
- BAC/support charge logic.
- Quote/enquiry exclusion logic.
- Repeat order logic.
- Planner, website, Request Hub, APIs, backend, CRM, and label printing.

Privacy / data warning:
- Real/private customer or order data should not be entered into a public/shared GitHub Pages browser session.
- Public Pages now starts with no saved orders unless opened with an explicit allowLocalData query override.
- Clear local saved data before Jade/shared testing.

Manual browser tests needed:
- Open GitHub Pages with a cache-busted v42.9B URL and confirm badge shows v42.9B JS OK.
- Confirm currency shows £, not Â£.
- Confirm no real saved customer/order appears on public Pages by default.
- Confirm Clear test data / Reset local data clears local browser state.
- Confirm Quote / enquiry, Convert quote to live order, Repeat order, Backup now, Action Alerts, and Communication Centre still appear.


## v42.9C Privacy Guard Communication Cleanup

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Privacy guard fix:
- Hardened hosted/public mode detection beyond github.io.
- Hosted public pages now ignore and remove px_orders_v21 unless opened with allowLocalData=1.
- Start dashboard, queue cards, Action Alerts, Messages to send, Open order value, Dispatch handover, and Order History render from a public-safe empty order list in hosted prototype mode.

Communication cleanup:
- Communication Centre remains the main visible workflow.
- Old message status/generate/copy/mark controls are preserved behind Advanced message controls.
- Communication Centre buttons now use PrimeX button classes and calmer disabled states.

What was not changed:
- Pricing logic.
- Stock deduction logic.
- Retatrutide kit logic.
- BAC/support charge logic.
- Quote/enquiry exclusion logic.
- Repeat order logic.
- Planner, website, Request Hub, APIs, backend, CRM, and label printing.

Remaining manual tests needed:
- Open public GitHub Pages without allowLocalData and confirm no saved real order appears anywhere on Start, queues, history, alerts, messages, value card, or dispatch handover.
- Confirm Clear test data / Reset local data removes saved order storage.
- Confirm message flow text renders with arrows correctly.
- Confirm Communication Centre rows are readable and old message controls are hidden behind Advanced message controls.
- Confirm protected flows still work before Jade testing.


## v42.9D Alert Colour Tone Polish

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Styling selectors changed:
- .note.warn
- #prototypeDataWarning
- #clearLocalDataBtn
- .btn.warn
- .action-alert-banner
- .alert-row.warning
- .alert-row.critical
- .stock-card-controls .stock-action-panel.danger-lite
- .security

What changed:
- Replaced harsh red/brown warning treatment with premium dark amber glass styling.
- Kept warnings serious but calmer with muted amber borders, dark backgrounds, and thin amber rails.
- Made the Clear test data / Reset local data control a subdued amber warning action.
- Kept disabled Communication Centre buttons muted.

What was not changed:
- Pricing logic.
- Stock deduction logic.
- Retatrutide kit logic.
- BAC/support charge logic.
- Quote/enquiry logic.
- Repeat order logic.
- Action Alert logic.
- Communication Centre logic.
- Privacy guard logic.
- localStorage keys.
- Dashboard data rules.
- Planner, website, or Request Hub.

Manual visual check still required:
- Confirm public/prototype warning banner feels calm and premium.
- Confirm warning buttons are amber, not red/brown.
- Confirm critical/alert rows remain readable and serious.
- Confirm disabled Communication Centre buttons do not look broken.


## v42.9E Warning Tone Correction

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

CSS selectors changed:
- .note.warn
- #prototypeDataWarning
- #clearLocalDataBtn
- .btn.warn
- #clearLocalDataBtn:hover
- .btn.warn:hover
- .action-alert-banner
- .alert-row.warning
- .alert-row.critical
- .stock-card-controls .stock-action-panel.danger-lite
- .security

Visual tone corrected:
- Replaced muddy amber/brown fills with graphite-first warning panels.
- Reduced amber to subtle borders and left rails within the approved warning selectors.
- Reset/clear button now reads as a controlled caution outline action instead of a filled warning block.
- Alert rows remain serious but quieter and closer to the PrimeX dark engineered style.

What was not changed:
- App logic.
- Pricing.
- Stock deduction.
- Kit logic.
- BAC/support logic.
- Quote/enquiry logic.
- Repeat order logic.
- Action Alert logic.
- Communication Centre logic.
- Privacy guard logic.
- localStorage keys.
- Dashboard data rules.
- Planner, website, or Request Hub.

Selector discipline note: v42.9E only edits the approved warning/prototype selectors from the request.

Manual visual check needed:
- Confirm the public prototype banner blends with the app while staying noticeable.
- Confirm reset/clear action is dark with a restrained amber outline.
- Confirm warning panels avoid red, orange, rusty brown, mustard, and glowing yellow.


## v42.9F Empty State Warning Hierarchy Polish

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

CSS selectors changed:
- .note.warn
- #prototypeDataWarning
- #clearLocalDataBtn
- .btn.warn
- #clearLocalDataBtn:hover
- .btn.warn:hover
- .action-alert-banner
- .alert-row.warning
- .alert-row.critical
- .security
- .queue-card.active

Visual hierarchy corrected:
- Made prototype and warning panels graphite-first with weaker amber edge treatment.
- Reduced warning amber strength so notices feel controlled, not muddy or loud.
- Returned the backup/safety panel to normal PrimeX dark panel styling instead of warning treatment.
- Calmed active queue-card highlight so empty dashboard cards compete less with real work.
- Kept the reset action dark with a restrained amber outline.

What was not changed:
- App logic.
- Pricing.
- Stock deduction.
- Retatrutide kit logic.
- BAC/support logic.
- Quote/enquiry logic.
- Repeat order logic.
- Action Alert logic.
- Communication Centre logic.
- Privacy guard logic.
- localStorage keys.
- Dashboard data rules.
- Planner, website, Request Hub, or email/contact settings.

Manual visual check needed:
- Confirm the prototype banner is visible but no longer dominant.
- Confirm the reset button reads as a controlled utility/caution action.
- Confirm backup panel no longer looks like a warning block.
- Confirm zero-count dashboard cards feel calmer, especially Awaiting payment.

## v42.9G Order Step Label Hierarchy Cleanup

Version: v42.9G
Purpose: Small order-entry label and hierarchy cleanup so product and support item steps read as equal order-building steps.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Pre-edit inspection:
- Active file was v42.9F with title "PrimeX Finance HQ · v42.9F Empty State Warning Hierarchy Polish" and boot badge "v42.9F JS OK".
- Found Step 1 already using "1. Product / compound".
- Found Step 2 using "2. Add BAC / support item" and the support selector using "BAC / support item".
- Found other BAC/support wording in generated summaries/admin notes; those were left unchanged because they can affect packing, totals, or operational output wording.

Labels changed:
- "2. Add BAC / support item" -> "2. BAC water / support item".
- "BAC / support item" selector label -> "BAC water / support item".
- Add order items helper text now says "BAC water / support items".
- Support pricing helper now says "BAC water / support item".

CSS selectors changed:
- #singlePanel.flow-block .subhead
- #structurePanel.flow-block .subhead
- #supportItemSection.flow-block>summary
- #supportItemSection.flow-block>summary strong

What was not changed:
- Pricing logic, stock deduction logic, Retatrutide kit logic, BAC/support charge logic, quote/enquiry logic, repeat order logic, privacy guard, localStorage keys, dashboard rules, planner/request hub/email settings, packing output, totals output, customer messaging, and stock/admin wording were not changed.

Manual visual check needed:
- Open Add order items and confirm Step 1 and Step 2 feel visually equal.
- Confirm Step 2 no longer reads as the primary action over Step 1.
- Confirm BAC water/support wording reads clearly without disrupting packing/totals output.
- Browser/mobile testing not performed in this patch.
## v42.9H Guide Prompt Visibility Polish

Version: v42.9H
Purpose: CSS-only visual hierarchy polish for inline guide/helper prompts so operational direction is easier to see without making prompts look like warnings.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Pre-edit inspection:
- Active file was v42.9G with title "PrimeX Finance HQ · v42.9G Order Step Label Hierarchy Cleanup" and boot badge "v42.9G JS OK".
- Guide/helper prompts were mostly using the shared `.note` class, including Order Type, pricing preview, structure preview, support item pricing, fulfilment method, fulfilment checklist, release status, message flow, and generated packing helper prompts.
- `.note` is also used for `.note.warn` and `.note.good`, so the base `.note` style was not changed globally.

Guide/helper selectors adjusted:
- #orderTypeNotice.note:not(.warn):not(.good)
- #pricingNote.note:not(.warn):not(.good)
- #structureNote.note:not(.warn):not(.good)
- #supportPricingNote.note:not(.warn):not(.good)
- #fulfilmentMethodNotice.note:not(.warn):not(.good)
- #fulfilmentChecklist.note:not(.warn):not(.good)
- #releaseStatus.note:not(.warn):not(.good)
- .message-flow-note.note:not(.warn):not(.good)
- #materialsSummary .note:not(.warn):not(.good)

What visual hierarchy was corrected:
- Non-warning guide prompts now use a clearer graphite-blue panel treatment with a restrained steel-blue left rail.
- Text contrast was increased for normal helper prompts.
- Warning amber and success green states were deliberately excluded from the new guide styling.

What was not changed:
- No wording, layout, workflow, app logic, pricing logic, stock deduction logic, order logic, Retatrutide kit logic, BAC/support charge logic, quote/enquiry logic, repeat order logic, privacy guard, localStorage keys, dashboard rules, planner/request hub/email settings, warning styling, or success styling was changed.

Manual visual check needed:
- Confirm Order Type explanatory note is easier to see without feeling like a warning.
- Confirm product/support/structure preview prompts are clearer.
- Confirm Packing contents "Auto rule active" reads as a helpful guide, not an alert.
- Confirm Fulfilment and Payment/Release guide prompts are visible but restrained.
- Browser/mobile testing not performed in this patch.
## v42.9I Order Page Guided Flow Cleanup

Version: v42.9I
Purpose: Order-page-only hierarchy polish so the main working screen reads as a guided intake and fulfilment workflow.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Pre-edit inspection:
- Active file was v42.9H with title "PrimeX Finance HQ · v42.9H Guide Prompt Visibility Polish" and boot badge "v42.9H JS OK".
- Order page sections were already present as Order, Add order items, Order summary, Packing contents, Fulfilment / Delivery, Communication Centre, and Final check.
- Existing styling used shared card, section-title, note, flow-block, payment-advanced, and Communication Centre row classes. Global selectors were avoided where possible.

Proposed / applied Order page hierarchy changes:
- Scoped visual step rhythm to #view-order only using section-title numbering.
- Scoped Order Type note warning-class override so Quote / enquiry guidance reads as a guide prompt, not an amber warning block.
- Renamed visible section title "Order" to "Order details".
- Normalised visible section title "Fulfilment / Delivery" to "Fulfilment / delivery".
- Kept Add order items, Order summary, Packing contents, Communication Centre, and Final check in the workflow.
- Added a collapsed manual-only "Request intake notes" helper under Order details.
- Added a final-actions class around the final Save order row so Save order reads as the final action while Archive complete is quieter.

Labels / wording changed:
- Order -> Order details.
- Fulfilment / Delivery -> Fulfilment / delivery.
- Added static collapsed helper title "Request intake notes".
- Added static helper text reminding the operator to manually enter Customer, contact, source, requested item, qty, price tier, support preference, and internal note.

CSS selectors changed:
- #view-order
- #view-order>section.card
- #view-order>section.card>.section-title
- #view-order>section.card>.section-title h2
- #view-order>section.card>.section-title h2::before
- #view-order>section.card>.section-title p
- #view-order .flow-block
- #view-order .structure-box.flow-block
- #view-order .payment-advanced
- #view-order .payment-advanced summary
- #view-order .request-intake-helper
- #view-order #communicationCentre
- #view-order .comm-row
- #view-order .final-actions
- #view-order .final-actions #saveOrder
- #view-order .final-actions #archiveOrder

Manual-entry helper added:
- Added collapsed "Request intake notes" section as a visual/operator aid only.
- It does not auto-import, parse, calculate, or save data.

What was not changed:
- Pricing logic, stock deduction logic, Retatrutide kit logic, BAC/support charge logic, quote/enquiry logic, repeat order logic, privacy guard logic, localStorage keys, dashboard rules, planner/request hub/email settings, product data, stock data, message generation logic, and customer message templates were not changed.

Manual test checklist:
- Open Order page and confirm sections read as a guided workflow from Order details through Final check.
- Confirm Request intake notes is collapsed and does not store or parse anything.
- Confirm Quote / enquiry note is visible and still says stock is not affected by quote/enquiry use.
- Confirm Step 1 Product / compound and Step 2 BAC water / support item remain equal.
- Confirm Communication Centre feels like a later workflow step and still renders rows.
- Confirm Save order remains clear and Archive complete is quieter.
- Confirm creating/saving a test order still works in browser.
- Browser/mobile testing not performed in this patch.
## v43.0 Request Inbox Convert to Quote

Version: v43.0
Purpose: Add a Finance HQ Request Inbox for structured Request Hub submissions and conversion into Quote / enquiry orders.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Implemented:
- Added Request Inbox screen and nav entry.
- Added separate requestInbox local data layer using px_request_inbox_v1.
- Added paste/import for structured Request Hub JSON.
- Added Finance-only productCode mapping layer; public product library remains untouched.
- Added Convert to Quote flow that creates an unsaved Quote / enquiry order.
- Conversion uses numeric standardCataloguePrice for standard quote pricing when the productCode is safely mapped and fixed-price.
- Audit, quote-mode, missing-price, and unmapped productCodes are preserved in quote notes for manual review instead of being auto-priced.
- Preserved source request metadata in order notes.
- Extended backup export/import to include requestInbox.

Safety rules preserved:
- Request import does not create an order and does not deduct stock.
- Convert to Quote creates Quote / enquiry only and does not save a live order.
- Existing stock deduction guard remains based on Live order only.
- Public product library was not edited and no private/internal prices, supplier costs, stock keys, or fulfilment IDs were added to it.

What was not changed:
- Existing pricing formulas, stock deduction, Retatrutide kit logic, BAC/support logic, quote-to-live logic, repeat order logic, customer message templates, product data, stock data, planner, website, Request Hub backend/API, and public product library content were not changed.

Verification notes:
- JavaScript syntax check passed after patch.
- Node request-logic harness confirmed test JSON normalises correctly, fixed-price mapped item is quote-ready, and audit item is held for manual review.
- Manual browser test still required for paste/import UI, Convert to Quote UI, no stock deduction, and backup export/import.