# Finance HQ Build Control Log

## v42.8O Summary
- Stabilisation cleanup pass after rapid v42.8I–N batches.
- Removed duplicate JavaScript helper function declarations that were being overridden later in the file.
- Confirmed no remaining duplicate function declarations in the extracted app script.
- Cleaned remaining prototype-style wording in corrupt local data and security/admin copy.
- Updated app badge to `v42.8O JS OK`.
- Preserved order, pricing, Reta kit, BAC support, stock deduction, queue, fulfilment and message logic.
- JavaScript extraction and `node --check` passed.
- Browser/mobile visual testing not claimed.

## v42.8O Audit Notes
- Next work should continue from this version only if the app boots and basic navigation works locally.
- Keep non-blocking visual issues logged for final audit/polish rather than stopping forward progress.
- Emergency stop only for startup failure, save failure, pricing error, stock deduction error, or unsafe customer wording.


## Current Local Version
- `v42.8R customer contact cleanup`
- Active live file: `finance/index.html`

## Current Live GitHub Version
- Not verified remotely from this local folder.
- Deployment target is expected to be GitHub Pages folder `finance/`.

## Last Tested Version
- `v42.8R syntax/static check only`
- Test status: needs local/browser/mobile test.
- Check run: JavaScript syntax parse passed after v42.5 edit.

- v42.5 confirms internal pricing table population for products/pathways while keeping unknown existing/private and planner/standard tiers manual-price required.
- v42.4 restructures the order workflow: Order contents replaces Products/order lines, Order summary replaces Items added, fulfilment fields are conditional by method, Royal Mail actions only appear for Royal Mail methods, final dangerous actions are reduced/collapsed, and packing override/review state is persistent.
- v42.3 improves operator clarity and queue safety: missing prices no longer look like normal £0 totals, paid New orders stay visible in To pack / fulfil as prep work, Start prompts include payment-cleared prep, and Products / order lines wording is clearer for daily entry.
- v42.2 adds import safety and zero-price guards: missing/manual product and structure prices must be confirmed with a positive value before adding, packing contents show actual contents, manual packing override is visible/protected, postage charge sits with Delivery setup, stock receive/adjust dropdowns cover all deductible stock keys, and Start includes compact prompts for missing confirmation/update/tracking.
- v42.1 separates payment status wording from order workflow wording: the internal new-order status remains compatible, but visible/customer-facing text uses `New order` or `Order received / being prepared`; customer updates only show postage/courier service for Royal Mail or courier fulfilment; Hold / not arranged now says fulfilment is to be confirmed.
- v42 adds fulfilment/import safety: Reta structures attach default Reta kit materials, Courier collection is available, Fulfilment / Delivery is grouped by workflow, Label/QR reference fields are manual text-only, Dispatch quick access appears on Start, Test orders are excluded from active value/queues, and `Prep anyway` is renamed to `Move to prep — unpaid`.
- v41 adds stock intake, manual adjustment, reorder warnings, Start stock alerts, movement history, and scan placeholder.
- Stock rule decision: Live orders affect stock; Test orders do not affect stock; Past orders do not affect stock by default.
- `Not paid` removed from visible payment status; `Awaiting payment` is now the default.
- Old saved `Not paid` values map/display as `Awaiting payment` when loaded/displayed.
- `Add product` renamed to `Add to order`.
- Materials summary now appears before editable fields.
- Full material fields are behind `Edit materials`.
- Delivery/Royal Mail is grouped by workflow step.
- Copy customer update is still copy-only; operator must send via customer route, mark update sent, and save.
- Postage service is selected manually; Royal Mail pricing is not pulled in.
- Expenses, owner loan tracking, and finance summaries are not implemented yet.

## Next Planned Action
- Verify v42.5 on local/browser/mobile, especially internal tier fast entry and missing-price guards on existing/private and planner/standard tiers.
- Confirm owner pricing for standard/existing tiers before populating any more prices.

## Parked Later Items
- Full Structure/pathway content build-out.
- Full materials redesign if needed.
- Expenses entry and profit summary.
- Barcode/QR scanning.
- Owner loan/repayment tracker.
- Backend/shared database.
- Past order optional stock impact toggle.
- Full payment due method field.
- Email/customer contact model.
- WhatsApp/email/SMS integrations.
- Start screen action prompts.
- Postage pricing automation.
- Delivery lost/damaged/delayed workflow expansion.
- Label PDF/image upload.
- Real Royal Mail/send integrations.
- Full pricing table confirmation.
- Full pathway content build-out.
- Full pathway pricing table review.
- Backup/export.
- Bin/restore safety.
- Full customer records/address autofill.

## Decisions
- Active Finance HQ edits target `finance/index.html` directly.
- Confirmed internal prices populated for non-Reta products and selected pathways.
- Unknown existing/private and planner/standard prices remain manual-price required.
- No public/planner prices invented.
- Price guard remains active for missing or zero prices.
- Order contents replaces Products/order lines.
- Order summary replaces Items added.
- Fulfilment fields are conditional by method.
- Royal Mail actions only appear for Royal Mail postage / Royal Mail collection.
- Packing override/review state is persistent.
- Stock rule decision: Live orders affect stock; Test orders do not affect stock; Past orders do not affect stock by default.

## Do-Not-Touch Rules
- Do not use abandoned v33.
- Do not touch pricing logic unless explicitly approved.
- Do not touch Reta vial/kit product logic unless explicitly approved.
- Do not touch stock deduction logic unless explicitly approved.
- Do not overwrite live versions without confirming target path and version.

## v42.5 Summary
- Confirmed internal prices reviewed/populated for Retatrutide vial/kit, BPC40, TB50010, TA110, KPV10, NAD500, AMINO50.
- Confirmed internal pathway prices reviewed/populated for RTA20_2, RTA20_3, REC_ENTRY, REC_CONT, GUT_PAIR.
- Existing/private and planner/standard prices remain manual where unknown.
- Admin pricing note added for owner-confirmation rules.
- Price guard remains active.

## v42.4 Summary
- Order contents and Order summary wording added.
- Packing summary now has persistent Auto rule / Manual override / Needs review states.
- Fulfilment / Delivery groups are conditional by fulfilment method while preserving existing field ids.
- Royal Mail buttons are hidden outside Royal Mail workflows.
- Final check keeps save/archive prominent and dangerous actions collapsed.

## v42.3 Bugs Fixed
- Missing prices no longer visually display as normal £0 totals.
- Paid New orders remain visible as next-action work.
- Products/order lines section language clarified.

## v42.8J Summary
- Added working quote prices for request/availability-check single compounds currently in the order dropdown: MOTS-c 40mg, SS-31 30mg, DSIP 5mg, and GHK-Cu 100mg.
- Existing/private and planner/standard prices were added for these request items so the operator can quote without searching old chats.
- Internal/close prices for these request items remain manual/owner-approved only.
- Product dropdown wording now distinguishes availability-check items from price-check items.
- Order preview wording now says availability/stock check when a working quote price exists.
- Preserved pricing guard for unpriced/manual items.
- Preserved Reta, BAC charge modes, stock deduction, queues, packing, and customer-message logic.
- NOTE: these are working quote prices pending owner/catalogue review; confirm availability before taking payment.


## v42.8J-2 Summary
- Corrected catalogue structure after owner review.
- Removed GHK-Cu 100mg from active order catalogue.
- Added GHK-Cu 50mg as the active GHK-Cu catalogue product.
- Kept NAD+ 500mg as the main planner/website NAD+ product.
- Added NAD+ 1000mg as request/supplier-check only, not active planner default.
- Added CJC-1295 DAC 5mg, CJC-1295 no DAC 10mg, and Ipamorelin 10mg as request/supplier-check catalogue items.
- Kept BPC-157 10mg as the main BPC product.
- Kept BPC-157 40mg as a high-strength/request option.
- Added product dropdown grouping: Active catalogue, Request / supplier-check, and Custom.
- Active catalogue now includes Retatrutide, BPC-157 10mg, TB-500, KPV, TA-1, NAD+ 500mg, 5-Amino-1MQ 50mg, MOTS-c, SS-31, DSIP, and GHK-Cu 50mg.
- Request items can be recorded/quoted, but supplier availability and pricing must be confirmed before taking payment where price is missing.
- No Reta kit logic, BAC charge logic, queue logic, stock deduction logic, or customer message logic changed.

## v42.8J-2 Risk Notes
- GHK-Cu 50mg working prices are operational quote prices and still need final owner/margin confirmation.
- Request-only compounds are sellable in principle but should not be promised before supplier/stock check.
- Full public website catalogue wording still needs final review before publishing.



## v42.8P Summary
- Added collapsible stock subgroups so long item lists can be opened/closed.
- Kept Order items open by default; internal stock groups can now be collapsed to reduce page length.
- Added quick per-item remove/damaged stock action inside each expanded stock card.
- Added removal reasons: damaged stock, lost/missing, expired/wasted, count correction, used internally.
- Removal action records a negative stock adjustment and updates current stock automatically.
- Added guard preventing removal of more than current stock.
- Renamed manual adjustment section to include damage/removal/correction.
- Preserved stock deduction logic, order logic, pricing, BAC/Reta logic, message flow and fulfilment flow.

## v42.8P Risk Notes
- Per-item removal is aggregate stock only; full lot-specific removal/damage tracking remains parked.
- Scan/barcode intake remains placeholder only.
- Browser/mobile visual test still needed.


## v42.8S Summary
- Daily-use flow batch to reduce order-entry friction without changing business logic.
- Renamed Order contents to Add order items.
- Clarified Single compound vs Pathway / bundle modes.
- Added clearer visual blocks for product/pathway entry and BAC/support entry.
- Tightened BAC/support wording so customer price controls the charge only while stock is still tracked.
- Renamed Order summary clear button to Clear items.
- Simplified Packing contents wording and manual packing override wording.
- Tightened Final check copy: confirm totals, payment, messages, then save.
- Shortened message-flow instructions to generate → copy/send → mark sent → save.
- Kept pricing, Reta/BAC logic, stock deduction, queues, fulfilment and save logic unchanged.
- JavaScript extracted; node --check passed; duplicate function scan passed.
- Browser/mobile visual test not claimed.

## Current Risks
- Standard/existing pricing table still needs owner confirmation.
- Pathway naming/content review still parked.
- Conditional sections still need mobile test.
- Old saved orders may need visual review.
- Old zero-price order lines need manual review.
- Manual label/QR fields are text-only until upload/scanning exists.

## Upload / Live Status
- Local live-folder build only.
- Not committed.
- Not pushed.
- Not confirmed live on GitHub Pages.

## v42.8I-A2 Summary
- Cleaned up the v42.8I-A Stock page grouping so it uses the operator model instead of mixed old/new categories.
- Stock page now separates Order items from Internal stock.
- Order items includes Compounds and Support items sold / included, so BAC Water 3ml, BAC Water 10ml, U100 10-pack, and wipes live with order-capable stock.
- Internal stock is subdivided into Kit-build / packaging materials, Dispatch packaging, Production consumables, and Admin / misc stock.
- Made Add to stock the clean top-level stock intake area: choose item, qty received, batch/lot, supplier/ref, COA, notes, save.
- Clarified that current stock is calculated automatically from received stock, adjustments, and live order usage.
- Kept a collapsed future Scan / barcode / QR intake placeholder for later scanner support.
- Kept stock cards collapsible with reorder/target controls hidden until opened.
- Hid the old category tab row from the main Stock view to reduce visual confusion.
- Preserved receive/adjust dropdowns, custom stock item manager, stock deduction formulas, order logic, pricing, BAC logic, Reta kit logic, queues, and message logic.
- JavaScript extracted and `node --check` passed.

## v42.8I-A2 Risk Notes
- Browser/mobile visual testing still pending.
- Scan input remains a placeholder only; it does not yet parse or auto-select stock items.
- Stock deduction remains aggregate; lot-level deduction is still parked.


## v42.8I-B Summary
- Batched daily-use cleanup after stock grouping review.
- Removed prototype/testing-style wording from the Stock page and Start data-safety card.
- Kept stock intake as the clean top area for received qty, batch/lot, supplier/ref, COA status and notes.
- Changed stock status so zero-quantity items without reorder/target levels show as `Not stocked` instead of urgent `OUT / None`.
- Start stock alerts now only show active reorder-tracked items with `OUT / None` or `Low stock`.
- Added `Not stocked` stock filter for items not currently held/replenished.
- Moved the Compound `Add selected item` action into the same preview/action box so it visually belongs with the selected item.
- Improved support item review flow so BAC water options are clearly alternatives, not combined selections.
- Kept future scan/barcode/QR intake placeholder in place.
- Preserved pricing logic, Reta kit logic, BAC charge modes, order queues, message flow, stock deduction formulas and custom stock item manager.

## v42.8I-B Open Issue List
- Stock page still needs a real browser/mobile visual pass after install.
- Support item flow may need further spacing/wording refinement after visual check.
- Active vs not-stocked defaults should be confirmed against real sell/current-stock decisions.
- Later batch can clean remaining self-explaining copy outside Stock/Order contents.
- Later batch can improve customer message workflow and Start page alert noise.


## v42.8I-C Summary
- Cleaned Stock page section flow after live screenshot review.
- Moved stock item setup into the Stock overview area as Add / activate stock items.
- Renamed Stock status filter to Stock view and clarified inactive dropdown behaviour.
- Changed Save adjustment button from warning/brown styling to neutral styling.
- Reduced stock page explanatory/prototype wording.
- Moved Pathway Add structure action into the pathway preview card.
- Changed Reta preview from To pack to Selected item preview and changed component wording to Stock used by this item.
- Removed visible self-check review approval checkbox from order entry; manual/review items remain internally flagged and price-gated.
- Renamed support charge mode wording so all modes clearly still track stock.
- Reworded packing review note so it no longer implies support items are added later outside the packing list.
- Adjusted customer update logic so Royal Mail collection cannot sound like the customer needs to collect the order.
- Preserved pricing, Reta kit, BAC charge/deduction, stock deduction, queues, and saved order data structures.

## v42.8I-C Open Issues Added
- Stock page still needs visual browser review after this cleanup.
- Single-compound price expansion is urgent and should be handled as a dedicated pricing batch, not silently invented.
- Postal/Royal Mail workflow is still manual and needs a proper fulfilment workflow pass; current link-only behaviour is not enough for finished daily use.
- Customer update wording should be reviewed by fulfilment method before broad client use.
- Need cleaner worker/operator flow once pricing and postal workflow are stabilised.


## v42.8I-D Summary
- Removed “Stock used by this item” from the main product preview.
- Kept kit/support stock deduction logic intact; deduction detail remains represented in Packing contents and Stock movement logic.
- Cleaned Stock page wording for daily use.
- Renamed Stock view selector to “Show stock items” with clearer options.
- Added clearer start-stocking wording on not-stocked item cards.
- Added “Save / start stocking” and “Stop tracking reorder” actions on stock cards.
- Moved the stock item manager toward stock setup/start-stocking language.
- Removed duplicate Stock list render placeholder from the stock page markup.
- Reworded support/BAC stock language so stock is always tracked and charge mode controls customer price only.
- Reworded Packing review message so it does not imply support is added later outside the order.
- Reworded Batch / COA area to remove prototype/label-generator wording.
- Did not change pricing logic, Reta kit contents, BAC charge mode values, order queues, customer message flow, or stock deduction formulas.

## v42.8I-D Next Urgent Batches
- v42.8J Pricing expansion: populate single-compound working prices with owner-approved margins and clear manual-review rules.
- v42.8L Postal / Royal Mail workflow: replace link-only dormant flow with a proper label/tracking/collection/handover process.
- Further UI tightening: reduce empty preview boxes and remaining self-explaining copy once pricing/postage are stable.


## v42.8K Summary
- Added a dedicated fulfilment/postage workflow pass.
- Reworked Fulfilment / Delivery wording so it reads as a live operating flow rather than a dormant prototype/link section.
- Added postage / label status tracking: Not booked, Label created, Royal Mail collection booked, Dropped at Post Office, Collected by Royal Mail, courier/customer/drop-off statuses.
- Added a fulfilment checklist that changes by method: Royal Mail, courier, customer collection, or local drop-off.
- Kept Royal Mail as manual booking for now but made the app record address, booking/label ref, status, tracking/ref, and customer update flow.
- Added quick buttons to mark label created, Royal Mail collection booked, and collected by Royal Mail.
- Updated customer update wording so Royal Mail collection cannot be mistaken for customer collection.
- Changed Royal Mail collection customer wording to Royal Mail handover / collected by Royal Mail.
- Preserved order, pricing, stock deduction, BAC, Reta kit, catalogue, and queue logic.

## v42.8K Risk Notes
- Royal Mail remains manual booking/open-link only; no API integration yet.
- Label/booking status is manually selected by the operator and must be saved with the order.
- Tracking/ref is still manually pasted.
- Customer wording should still be visually checked with real order examples before scaling.


## v42.8L Summary
- Cleaned Final check message flow into generate → copy/send → mark sent → save.
- Moved confirmation generate/copy controls into Message status instead of Save / close order.
- Added Mark confirmation sent and Mark customer update sent buttons.
- Added Mark update sent button beside the customer update message.
- Save now warns in the toast when message status still needs attention instead of silently implying everything is done.
- Simplified Start action wording from “not sent” to “to send”.
- Preserved pricing, catalogue, stock, BAC, Reta, queue, and stock deduction logic.
- Fixed duplicate fulfilment warning function name carried in the previous generated file before syntax check.

## v42.8L Check
- JavaScript extracted and checked with `node --check`.
- Browser/mobile visual testing not claimed.
## v42.8M Summary
- Cleaned Start dashboard wording for daily use.
- Made + New Order visible on Start.
- Reworked Daily actions into Quick actions: New order, Order history, Stock.
- Renamed Order prompts to Next actions.
- Renamed Comms / action needed to Messages to send.
- Renamed Dispatch quick access to Dispatch handover.
- Changed Stock alerts to Urgent stock alerts and limited Start display to the first six active reorder-tracked warnings.
- Limited Start message actions and dispatch handover lists so the dashboard does not become a long noisy page.
- Reworded Backup reminder without prototype/testing language.
- Preserved pricing, catalogue, order, queue, stock deduction, BAC/Reta, and message logic.
- Fixed duplicate fulfilment warning function-name text carried in the prior generated HTML before syntax checking.

## v42.8M Check
- JavaScript extracted from generated HTML.
- `node --check` passed.
- Browser/mobile visual test not claimed.



## v42.8M-R Recovery Fix
- Emergency startup repair after v42.8K/L/M generated files carried a malformed duplicate function declaration.
- Fixed `function syncFulfilmentPaymentWarningfunction syncFulfilmentPaymentWarning()` to a single valid `function syncFulfilmentPaymentWarning()`.
- Updated boot badge to `v42.8M-R JS OK`.
- No business logic changes made in this recovery file.
- JavaScript syntax check passed after repair.

## v42.8K/L/M Failure Cause
- The generated fulfilment/message/start-dashboard files contained a malformed duplicate function name.
- This is why the app failed before booting.
- Old v42.8K, v42.8L and v42.8M files should be treated as BROKEN / DO NOT USE unless repaired.

## v42.8N Summary
- Polished the Stock overview card expansion flow.
- Removed the confusing always-on “Save / start stocking” wording for items already being tracked.
- Changed stock card actions to “Start reorder tracking”, “Save reorder levels”, and “Clear reorder tracking” depending on item state.
- Changed Target Qty wording to Target stock.
- Added a guard so target stock cannot be lower than the reorder level when both are set.
- Softened the focused stock-card outline so clicked cards no longer show a harsh white border.
- Preserved stock intake, live-order stock deductions, pricing, catalogue, fulfilment, message, and order-save logic.
- Added observed stock-card polish issues to audit notes rather than pausing wider build progress.


## v42.8Q Summary
- Polished the Order contents entry flow without changing pricing, stock deduction, queue, or fulfilment logic.
- Hid the empty selected-item preview/action box until a compound/product has actually been selected.
- Reworded support/BAC section as “Add BAC / support item” to match daily order use.
- Changed support charge-mode wording to Customer charge / Included in order price / No customer charge while keeping stock tracking automatic in all modes.
- Clarified support suggestions so BAC options read as alternatives, not multiple items to select together.
- Added optional alcohol wipes quick suggestion alongside U100.
- Reworded product preview note so BAC/support items are selected below when included in the order.
- Cleaned startup failure text so errors point back to the build chat rather than an internal name.
- JavaScript syntax check passed and duplicate function declaration check found none.

## v42.8Q Check
- JavaScript extracted from generated HTML.
- `node --check` passed.
- Duplicate function scan passed: no duplicate function declarations found.
- Browser/mobile visual test not claimed.


## v42.8R Summary
- Moved Phone / WhatsApp contact field into the top Order section so customer/contact details are captured before fulfilment.
- Changed Customer / ref to Customer name / ref.
- Changed Recipient name in fulfilment/address details to Recipient name if different.
- Shortened order type helper wording for daily-use clarity.
- Contact field edits now mark confirmation/customer-update messages as needing review/regeneration.
- Preserved order save logic, pricing, stock deduction, Reta/BAC logic, queue logic, fulfilment logic, and message generation structure.
- JavaScript extracted; node --check passed; duplicate function declaration scan passed.

## v42.8R Risk Notes
- Browser/mobile visual testing still required.
- Customer contact is stored using the existing recipientPhone field; future customer records/autofill remain parked.


## v42.8T Summary
- Added Quote / enquiry order type for pricing/availability checks before taking payment.
- Quote / enquiry does not affect live queues or current stock.
- Added New quote/enquiry quick action on Start.
- Added Quotes filter in Order History.
- Quote/enquiry messages generate as Quote / Availability Check instead of Order Confirmation.
- Quote messages include estimated total and a clear note that stock/fulfilment are confirmed before payment or dispatch.
- Added QUOTE badge in history/queue rows where applicable.
- Preserved live order, pricing, stock deduction, Reta/BAC, fulfilment, and message-save logic.


## v42.8U Summary
- Added quote-to-live conversion workflow.
- Added Convert quote to live order action on the order screen for Quote / enquiry records.
- Added Convert to live action inside Order History quote rows.
- Added Start quick action to open saved quotes/enquiries.
- Clarified that quotes/enquiries stay out of live queues and stock until converted and saved as live orders.
- Preserved live order, stock deduction, pricing, Reta/BAC, fulfilment and message logic.

## v42.8U Check Notes
- JavaScript extracted and checked with node --check.
- Duplicate function declaration scan passed.
- Bad startup duplicate phrase check passed.
- Browser/mobile visual test not claimed.


## v42.8V Summary
- Added repeat order workflow for returning customers.
- Added Repeat order quick action on Start.
- Added Repeat order buttons in Order History rows.
- Added Repeat action in active queue rows.
- Repeat order creates a new unsaved live order with a fresh order ref and today’s date.
- Repeat order copies customer name/ref, phone/WhatsApp, customer notes, address fields, price tier, and order items.
- Repeat order resets payment, order status, fulfilment status, tracking, label/QR refs, postage charge, message sent states, and release fields.
- Repeat orders do not affect stock until the new live order is saved.
- Preserved quote/enquiry conversion, live order logic, pricing, stock deduction, Reta/BAC rules, and fulfilment/message logic.

## v42.8V Risk Notes
- Repeat order should be browser-tested with a saved order before live use.
- Repeated order prices are copied from the source order; review price tier and totals before saving if catalogue prices have changed.
- Repeat order copies address/contact fields where available, but operator must confirm fulfilment method and delivery details before dispatch.


## v42.8W Summary
- Cleaned Start/top action duplication after repeat-order workflow.
- Removed the duplicate top-header + New Order button from visible UI.
- Kept one clear primary + New Order button inside the Today panel.
- Removed duplicate New order tile from Quick actions.
- Quick actions now focus on quote/enquiry, open quotes, repeat order, order history, and stock.
- Changed System Map from pill-style header button to a calmer standard header action.
- Reduced pill button roundness where still used.
- Patched newOrderTop binding so the app does not require the removed header button to exist.
- Preserved quote conversion, repeat order, pricing, stock, fulfilment, and message logic.
- JavaScript syntax check passed and duplicate function scan passed.


## v42.8X Summary
- Added Backup now shortcut to Start quick actions.
- Changed Backup reminder to a direct Export backup action.
- Added customer contact / WhatsApp visibility in queues, dispatch handover, and order history rows when present.
- Preserved quote conversion, repeat order, order save, pricing, stock deduction, Reta/BAC, and fulfilment logic.
- JavaScript syntax check passed with no duplicate function declarations.

## v42.8X Risk Notes
- Backup/export still downloads a local JSON file only; no cloud database or automatic backup exists yet.
- Contact display depends on contact details being captured on the order.
