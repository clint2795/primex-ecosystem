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
- Confirm currency shows Â£, not Ã‚Â£.
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
- Active file was v42.9F with title "PrimeX Finance HQ Â· v42.9F Empty State Warning Hierarchy Polish" and boot badge "v42.9F JS OK".
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
- Active file was v42.9G with title "PrimeX Finance HQ Â· v42.9G Order Step Label Hierarchy Cleanup" and boot badge "v42.9G JS OK".
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
- Active file was v42.9H with title "PrimeX Finance HQ Â· v42.9H Guide Prompt Visibility Polish" and boot badge "v42.9H JS OK".
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
## v43.0A Request Inbox Import Button Fix

Version: v43.0A
Purpose: Fix Request Inbox import button wiring and visible import feedback after live manual test failure.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Root cause:
- Request Inbox Import and Clear buttons existed in the HTML but were not wired in bind().
- On hosted public prototype pages, saveLocal() removed requestInbox from localStorage and also cleared the in-memory requestInbox array, so imported requests could be wiped before the list/count rendered.
- Import failures only used the short toast, so JSON/field errors were easy to miss.

Fix made:
- Wired Import request button to importRequestInboxFromText().
- Wired Clear paste box button with defensive element checks.
- Added visible requestImportStatus area for success and failure messages.
- On success, normalised requests are added to requestInbox, saveLocal() runs, Request Inbox rerenders, request count updates, paste box clears, and a visible success message remains.
- On failure, a visible error message is shown with the parse/field reason.
- Public prototype mode still does not persist requestInbox to localStorage, but no longer wipes the current in-memory imported request before render.
- Updated app title and boot badge to v43.0A.

What was not changed:
- Request Inbox architecture.
- Pricing formulas and private/public pricing rules.
- Stock deduction logic.
- Quote conversion architecture except import-flow wiring needed for Convert to Quote access.
- Product library data.
- Retatrutide kit logic, BAC/support logic, repeat order logic, customer message templates.

Verification:
- JavaScript syntax check passed.
- Function-level Node harness confirmed import path parses test JSON, pushes one request into requestInbox, calls saveLocal(), calls renderRequestInbox(), and clears the paste box after success.
- Protected flows still present: Quote / enquiry, Convert request to quote, Convert quote to live order, Repeat order, Backup now.

Manual browser tests still required:
- Open live v43.0A, paste valid Request Hub JSON, click Import request, confirm count changes to 1 and request row appears.
- Paste invalid JSON and confirm visible error message appears.
- Click Clear paste box and confirm textarea clears.
- Convert imported request to Quote / enquiry and confirm no stock deduction until converted to live order and saved.
## v43.0B Quote Follow-Up Source Tracking

Version: v43.0B
Purpose: Make Quote / enquiry work visible as active customer follow-up without putting quotes into live fulfilment queues.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Fields added:
- Order / request source select: Request Hub / online, Existing customer, Word of mouth / referral, Direct WhatsApp, Manual entry, Repeat customer, Other.
- Referred by free-text field for internal tracking.
- Quote follow-up status select: New request, Quote to send, Quote sent / waiting customer, Customer replied / ready to convert, Parked, Cancelled.
- Saved order payload now carries source, referredBy, quoteStatus, sourceRequestId, and internal sourceRequestMeta.

Quote status logic added:
- Existing saved quotes without quoteStatus safely infer Quote to send unless existing confirmation/status suggests otherwise.
- Request Inbox conversion defaults source to Request Hub / online, quoteStatus to Quote to send, and preserves requestId/source metadata internally.
- Added quote-only helpers for isQuoteOrder, quoteStatusValue, quoteFollowUpData, renderStartQuoteFollowup, quickQuoteUpdate, and quote-specific History rows.

Start/Open Quotes changes:
- Start now has a separate Quote follow-up section for New requests, Quotes to send, Waiting customer, Ready to convert, and Parked/cancelled.
- Open Quotes rows show quote status, source, referredBy when present, requestId when present, and value.
- Quote rows include actions for open/edit, mark quote sent, customer replied, park, and convert to live.

What was not changed:
- Stock deduction logic.
- Live fulfilment queue logic: Quote / enquiry remains excluded from Awaiting payment, To pack / fulfil, Ready send / collect, and In transit / follow-up.
- Pricing formulas.
- Product library.
- Request import parsing.
- Customer message templates.
- Reta kit logic and BAC/support logic.

Verification:
- JavaScript syntax check passed.
- Function-level harness confirmed Request Inbox import still parses, pushes, saves, and rerenders.
- Function-level stock guard check confirmed Quote / enquiry does not affect stock.
- Static checks confirmed source/referral/quote status fields are in orderPayload() and loadOrder().

Manual browser tests still required:
- Import Request Hub JSON, convert to Quote / enquiry, save quote, and confirm it appears in Start Quote follow-up and Open Quotes.
- Confirm saved Quote / enquiry does not appear in live fulfilment queues and does not add to open live order value.
- Mark quote sent, customer replied, and parked from Open Quotes; confirm status changes persist after reload.
- Confirm source and referredBy save/load on a manual quote.
- Convert a ready quote to live order and confirm stock only deducts after saving as a live order.
## v43.0C Saved Quote Follow-Up Fix

Version: v43.0C
Purpose: Fix saved Quote / enquiry visibility on hosted public prototype pages after manual browser testing showed saved quotes disappearing from Start, Open Quotes, and History.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Root cause:
- saveOrderNow() correctly built and pushed the Quote / enquiry order into the orders array.
- In public prototype mode, saveLocal() then removed localStorage and also cleared the in-memory orders array.
- dashboardOrders() also returned an empty array in public prototype mode, so even if a quote existed in memory it would be filtered out of Start, Open Quotes, History, and quote follow-up displays.
- The quote was effectively saved then hidden/wiped during the same Save order flow.

Fix made:
- dashboardOrders() now returns the current in-memory orders array.
- saveLocal() still blocks persisted order/request storage on hosted public prototype pages by removing px_orders_v21 and px_request_inbox_v1, but no longer clears the in-memory orders array.
- Current-session saved Quote / enquiry orders can now appear in Quote follow-up and Open Quotes on the live prototype page.
- Updated title and boot badge to v43.0C.

What was not changed:
- Request Inbox architecture.
- Product library.
- Pricing formulas.
- Stock deduction logic.
- Quote / enquiry exclusion from live fulfilment queues.
- Quote-to-live conversion logic.
- Customer message templates.

Verification:
- JavaScript syntax check passed.
- Harness confirmed a Quote / enquiry save remains in memory after saveLocal() in public prototype mode.
- Harness confirmed quoteFollowUpData().toSend counts the saved quote.
- Harness confirmed historyMatches(savedQuote, 'quote') returns true.
- Harness confirmed isStockAffectingOrder(savedQuote) returns false.
- Harness confirmed Request Inbox import still parses, pushes, saves, and rerenders.

Manual browser tests still required:
- Import Request Hub JSON, convert to Quote, click Save order, and confirm Quote follow-up shows Quotes to send = 1.
- Confirm Open Quotes and History Quotes show the saved quote/customer.
- Confirm live fulfilment queues remain 0.
- Confirm stock is not deducted.
- Refresh the hosted prototype and confirm public prototype mode does not persist private quote/order data across page reloads unless explicitly using an allowed local-data mode.
## v43.0D Draft Quote Follow-Up Visibility

Version: v43.0D
Purpose: Keep Request Inbox conversions visible as active quote work before the quote is saved or sent.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Root cause:
- Convert to Quote changed the request status to converted immediately, before any saved Quote / enquiry order existed.
- Quote follow-up excluded converted requests and only counted saved quote orders, so the converted-but-unsaved quote draft disappeared from Start follow-up until saved.

Follow-up workflow change:
- Added Draft quotes bucket to the Start Quote follow-up section.
- Convert to Quote now marks the request as draft quote and stores draftOrderId while the order is being prepared.
- Saving the quote calls syncRequestAfterQuoteSave(), which moves the request from draft quote to converted and links the saved quote ref.
- quoteFollowUpData() now reports New requests, Draft quotes, Quotes to send, Waiting customer, Ready to convert, and Parked/cancelled.
- Save confirmation toast was made ASCII-safe.

What was not changed:
- Stock deduction logic.
- Live fulfilment queues.
- Pricing formulas.
- Request Inbox import parsing.
- Product library.
- Customer message templates.
- Quote-to-live logic.

Verification:
- JavaScript syntax check passed.
- Harness confirmed draft quote is counted before save.
- Harness confirmed saved quote moves from Draft quotes to Quotes to send.
- Harness confirmed quote does not appear as live open work.
- Harness confirmed quote does not affect stock.
- Harness confirmed Request Inbox import still parses, pushes, saves, and rerenders.

Manual browser tests still required:
- Import Request Hub JSON and confirm New requests = 1.
- Convert to Quote and return to Start before saving; confirm Draft quotes = 1.
- Save the quote and confirm Draft quotes = 0 and Quotes to send = 1.
- Confirm Open Quotes shows the saved quote.
- Confirm live fulfilment queues remain 0 and stock is not deducted.
## v44A Supabase Schema + RLS Foundation
Purpose: Add Supabase database schema, RLS policy foundation, and setup notes for moving Finance HQ beyond localStorage/public prototype mode.

Files changed:
- finance/supabase/schema_v44A.sql
- finance/supabase/rls_policies_v44A.sql
- finance/supabase/RLS_SETUP_NOTES.md
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Tables created in SQL:
- profiles
- customers
- quote_requests
- quotes_orders
- quote_order_items
- stock_items
- stock_movements
- follow_ups
- audit_events

Schema considerations included:
- customers includes email, preferred_contact, source, referred_by, last_contacted_at, and next_follow_up_at.
- quotes_orders includes quote_status, last_contacted_at, next_follow_up_at, follow_up_note, and customer_reply_status.
- follow_ups is included now so request/order/customer follow-up history is not lost later, but should still be reviewed before running SQL.

RLS approach:
- All private Finance HQ tables enable RLS.
- Anonymous access is not allowed by policy.
- Authenticated access is routed through security definer helper functions in app_private to avoid fragile recursive profiles.role policies.
- Baseline roles are admin, finance, fulfilment, and viewer.
- Viewer can read; finance/fulfilment/admin can write operational tables; deletes are admin-only; audit events are append/read only for staff from browser context.

What was not changed:
- finance/index.html was not changed for Supabase wiring.
- No Supabase project URL, anon key, service role key, database password, or customer data was added.
- Product library, pricing formulas, stock deduction formulas, Request Inbox parsing, customer messages, and UI logic were not changed.
- No SQL was run from this workspace. v44A SQL is intended for a fresh empty Supabase staging project.

Manual review before running SQL:
- Confirm first admin bootstrap process in Supabase SQL Editor.
- Confirm role policy behaviour using test users before wiring Finance HQ, including helper function access after `app_private` usage is revoked.
- Confirm whether follow_ups is active in v44A or simply available for v44B/v44C.
- Confirm delete permissions and whether soft delete is needed before live use.
- Confirm whether fulfilment should have narrower field-level permissions before live use.
- Treat `drop policy if exists` and `drop trigger if exists` as fresh-setup safe only; do not run casually over a manually modified live project later.
- If policy evaluation errors due to helper function/schema permission, pause and review exact required grants rather than broadly exposing `app_private`.

## v44B Supabase Login / Connection Test
Purpose: Add Supabase browser-client login/session/status wiring without migrating Finance HQ workflows away from localStorage.

Files changed:
- finance/index.html
- finance/config.example.js
- .gitignore
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated Finance HQ title/badge to v44B.
- Added safe Supabase browser client/config loading.
- Added `finance/config.example.js` placeholders for local config.
- Added `.gitignore` entry for `finance/config.js` so local keys stay out of git.
- Added Admin/System Supabase status panel with configured/not configured, login state, logged-in email, profile role, and RLS profile read test.
- Added login/logout/refresh controls.
- On login, v44B reads only the current authenticated user's row from `public.profiles`.

What was not changed:
- No service role key, database password, JWT secret, connection string, customer data, or Supabase write path was added.
- No customer/order/request/stock migration was added.
- Existing localStorage order, quote, Request Inbox, pricing, stock and message workflows remain the active app behaviour.
- `finance/indexbackup.html`, old Desktop folders, planner files, and request hub files were not edited.

## v44B1 Supabase Login Diagnostics
Purpose: Harden the v44B Supabase login/status path for localhost testing without changing local Finance HQ workflows.

Files changed:
- finance/index.html
- finance/config.example.js
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

Cause found:
- v44B used the Supabase client and base project URL correctly and read profiles through `.from('profiles')`; it did not build a raw `/rest/v1/` fetch.
- The login path did not catch browser/network exceptions from Supabase Auth, so localhost failures surfaced only as `Failed to fetch` with no operation-specific detail.
- Config handling only documented `anonKey`, even though the local setup uses the newer `sb_publishable_` public key format.

What changed:
- Updated app version labels to v44B1.
- Added config normalization for accidental `/rest/v1` or `/auth/v1` URL suffixes while still passing only the project base URL into `createClient`.
- Added support for `publishableKey`, `anonKey`, or `supabaseKey` public browser config fields.
- Added operation-specific error detail for `createClient`, `getSession`, `signInWithPassword`, `profiles` read, and `signOut`.
- Updated `config.example.js` to prefer `publishableKey` while still supporting anon public keys in code.

What was not changed:
- No service role key, database password, JWT secret, connection string, customer data, SQL, or customer/order/request/stock Supabase writes were added.
- Existing localStorage workflows and public prototype guard remain unchanged.

## v44B2 Supabase Login UX + Diagnostics
Purpose: Improve Supabase login usability and visible diagnostics without changing auth/profile behaviour or local Finance HQ workflows.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated app version labels to v44B2.
- Added a mobile-friendly show/hide password control to the Supabase login password field.
- Added visible diagnostics for configured Supabase base URL, Supabase JS loaded/not loaded, and public key type.

What was not changed:
- Login/profile read behaviour is unchanged.
- No customer/order/request/stock Supabase writes were added.
- No real keys, passwords, service role key, customer data, SQL, config.js, backup file, planner/request hub files, or old Desktop folders were touched.

## v44C Request Inbox + Customer Database Sync
Purpose: Add operator-triggered Request Inbox database save for customer linking and quote request intake while keeping active Finance HQ workflows local.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible app version to v44C.
- Added per-request action: `Save selected request to database`.
- Database save requires a logged-in Supabase user.
- v44C writes only to `customers` and `quote_requests`.
- On success, the local request remains visible and receives internal metadata: `supabaseRequestId`, `supabaseCustomerId`, and `supabaseSyncedAt`.
- Re-saving checks existing `quote_requests` by saved Supabase id or `request_ref` to avoid blind duplicates.
- Customer matching checks email first, then phone/contact, then exact customer name/ref. Multiple matches block automatic merge.

What was not changed:
- Saved orders and quotes remain local in `px_orders_v21`.
- Request Inbox remains local in `px_request_inbox_v1` with optional database metadata.
- Stock, pricing, products, Reta kit, BAC/support, fulfilment, and message templates were not changed.
- No writes were added to `quotes_orders`, `quote_order_items`, `stock_items`, `stock_movements`, `follow_ups`, or `audit_events`.
- No service role key, database password, hardcoded customer data, SQL, private config, backup, planner, request hub, product-info, indexbackup, or old Desktop files were touched.

## v44C1 Local Request Inbox Test Helper
Purpose: Add a local-only Request Inbox test helper so database sync can be manually tested without real customer data.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible app version to v44C1.
- Added Request Inbox action: `Create local test request`.
- The helper creates one local Request Inbox item for `TEST REQUEST CUSTOMER`, contact `07000000000`, requested item `Retatrutide 20mg x 1`.
- The helper saves only to local Request Inbox storage and marks the request as local/test.

What was not changed:
- The helper does not write to Supabase automatically.
- No order, stock, pricing, fulfilment, quotes_orders, SQL, private config, backup, planner/request hub, product-info, indexbackup, or old Desktop files were touched.

## v44C2 Pending — Supabase Security Cleanup

Warnings observed:
- Function search_path mutable: public.touch_updated_at
- Public can execute SECURITY DEFINER function: public.rls_auto_enable()
- Signed-in users can execute SECURITY DEFINER function: public.rls_auto_enable()
- Leaked password protection disabled in Auth

Priority:
- Not blocking v44C1 request/customer database test.
- Must be cleaned before wider live staff use.
- Should be handled as a separate SQL/security patch, not mixed into v44C1 app testing.

## v44D1 Request Inbox Bin
Purpose: Add local-only Request Inbox soft-bin behavior before any order sync work.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible app version to v44D1.
- Added Request Inbox view toggle: `Active` / `Bin`.
- Added active request action: `Move to Bin`.
- Added binned request action: `Restore from Bin`.
- Binned requests use local metadata only: `binned`, `binnedAt`, and `restoredAt` on restore.
- Active Request Inbox count and Start quote follow-up now exclude binned requests.
- Binned requests remain in `px_request_inbox_v1` and remain included in Finance HQ backup export/import because the full `requestInbox` array is preserved.
- Existing Supabase request metadata is left untouched: `supabaseRequestId`, `supabaseCustomerId`, and `supabaseSyncedAt`.

What was not changed:
- No order sync was added.
- No SQL was run.
- No Supabase tables, policies, customers, or quote_requests rows are changed by bin/restore.
- `finance/config.js`, stock, pricing, fulfilment, product rules, customer message templates, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.

Verification:
- JavaScript syntax check passed after patch.
- Manual browser test required for Active/Bin toggle, Move to Bin, Restore from Bin, active request count, Start quote follow-up count, and backup export/import preservation.



## v44D2 Schema Compatibility Only
Purpose: Prepare Supabase `quotes_orders` for future Finance HQ quote/order sync by allowing the local order type `Quote / enquiry`.

Files changed:
- finance/supabase/schema_patch_v44D2_order_type.sql
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Added a SQL patch file that updates the `quotes_orders_order_type_check` constraint to allow `Live order`, `Quote / enquiry`, `Past order`, and `Test order`.
- v44D2 is schema compatibility only.
- v44D3 is the earliest order sync target.

Order sync notes carried forward:
- Quote status UI labels must be mapped to normalized DB `quote_status` values before writing orders/quotes to Supabase.
- `quote_order_items` resync must avoid unsafe delete/reinsert assumptions under RLS.
- Bin/archive stays soft-delete only.
- Google Drive source-of-truth review was attempted but blocked by expired Drive auth.
- Drive review must be repeated once Drive access is restored.

Completion:
- v44D2 schema compatibility SQL ran successfully.
- `quotes_orders_order_type_check` now allows `Quote / enquiry` for future quote/order sync compatibility.

What was not changed:
- No app code was changed.
- No additional SQL was run after the completed v44D2 compatibility patch.
- No order sync was implemented.
- `finance/index.html`, `finance/config.js`, stock, pricing, fulfilment, product rules, customer message templates, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.


## v44D2B quote_order_items line_ref Schema Prep
Purpose: Prepare `quote_order_items` for safe idempotent item sync in v44D3.

Files changed:
- finance/supabase/schema_patch_v44D2B_quote_order_items_line_ref.sql
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Added a SQL patch file to add nullable `line_ref` to `quote_order_items`.
- Added a partial unique index on `(quote_order_id, line_ref)` where `line_ref` is not null.
- This is schema prep only.
- Enables future v44D3 item upsert without delete-all-then-recreate assumptions.

Completion:
- v44D2B line_ref schema prep SQL ran successfully.
- `quote_order_items.line_ref` is available for future v44D3 item upsert.
- `quote_order_items_quote_order_id_line_ref_uidx` is in place for non-null line refs.

What was not changed:
- No app code was changed.
- No additional SQL was run after the completed v44D2B line_ref patch.
- No RLS was changed.
- No order sync was implemented.
- No stock, pricing, fulfilment, product rule, or message logic was changed.
- `finance/index.html`, `finance/config.js`, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.


## v44D3 Manual Quote/Order Database Sync
Purpose: Add an explicit operator action to save the currently open saved local quote/order to Supabase without changing normal local workflows.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible app version to v44D3.
- Added manual order action: `Save current quote/order to database`.
- Database sync requires a logged-in authenticated Supabase user.
- Normal local `Save order` remains primary and separate.
- Parent sync writes to `quotes_orders` using `order_ref = local order.id`.
- Existing database parent rows are updated by `order_ref`; missing parent rows are inserted.
- Line items write to `quote_order_items` using stable `line_ref` values from v44D2B.
- Line items are selected then updated/inserted; no delete/recreate flow and no delete permission is required.
- Full local order payload is stored in `quotes_orders.payload`.
- Full local line payload is stored in `quote_order_items.payload`.
- On success, local order metadata is stored: `supabaseOrderId`, `supabaseSyncedAt`, and `supabaseItemSyncStatus`.
- If parent sync succeeds but item sync fails, the app shows a partial sync warning and keeps the local order intact.
- Quote status UI labels are mapped to normalized DB `quote_status` values.

Supabase tables touched:
- Writes: `quotes_orders`, `quote_order_items`.
- Reads/links: `quote_requests` where a source request reference exists.

What was not changed:
- No writes were added to `stock_items`, `stock_movements`, `follow_ups`, or `audit_events`.
- No customer writes were added in v44D3.
- No stock deduction, pricing, fulfilment, Reta/BAC/support, product rule, or customer message template logic was changed.
- No automatic migration was added.
- `finance/config.js`, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.

## v44D3A Currency Display Encoding Fix
Purpose: Fix pound sign rendering in Finance HQ currency display, including Open Order Value, without changing calculation logic.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated the shared `money()` display formatter to render the pound sign using a stable Unicode escape (`\u00a3`).
- Open Order Value and other values that use `money()` now render `£` correctly instead of mojibake such as `Â£` / `A£`.
- Inspected Backup / Export warning wording; it remains valid until orders and stock are fully cloud-backed.

What was not changed:
- No pricing, totals, stock, Supabase sync, order sync, fulfilment, product rule, or customer message template logic was changed.
- `finance/config.js`, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.

## v44D3B Order Sync Table Grants SQL Patch
Purpose: Fix v44D3 manual quote/order database sync permission failure: `Order lookup failed: permission denied for table quotes_orders`.

Cause:
- RLS policies exist for `quotes_orders` and `quote_order_items`, but the authenticated role is missing base table grants.

Files changed:
- finance/supabase/schema_patch_v44D3B_order_sync_grants.sql
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Added a SQL permissions patch granting `select`, `insert`, and `update` on `quotes_orders` to `authenticated`.
- Added a SQL permissions patch granting `select`, `insert`, and `update` on `quote_order_items` to `authenticated`.
- v44D3B is SQL permissions only.
- Enables authenticated staff to reach `quotes_orders` and `quote_order_items` for v44D3 manual sync.
- RLS still controls actual access via `app_private.can_read_finance()` and `app_private.is_staff()`.
- No delete grant is included.

What was not changed:
- No app code was changed.
- No SQL has been run yet for v44D3B.
- No RLS policy logic was changed.
- No stock, pricing, fulfilment, product rule, or customer message logic was changed.
- `finance/index.html`, `finance/config.js`, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.
