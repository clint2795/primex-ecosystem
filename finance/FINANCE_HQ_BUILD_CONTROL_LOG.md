# Finance HQ Build Control Log

## Current Local Version
- `v42.2 import safety + zero-price guard`
- Active live file: `finance/index.html`

## Current Live GitHub Version
- Not verified remotely from this local folder.
- Deployment target is expected to be GitHub Pages folder `finance/`.

## Last Tested Version
- `v42.2`
- Test status: needs local/browser/mobile test before Jade imports.
- Check run: JavaScript syntax parse passed after v42.2 edit.

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
- Verify v42.2 on local/browser/mobile before Jade imports, especially zero-price blocking, manual packing override/reset, stock dropdown coverage, postage charge entry, and Start prompts.
- Next likely version depends on v42.2 import testing results.

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
- Full pathway pricing table review.
- Backup/export.
- Bin/restore safety.
- Full customer records/address autofill.

## Decisions
- Active Finance HQ edits target `finance/index.html` directly.
- Missing planner/existing prices require manual owner confirmation.
- Packing contents are operational packing data, not just materials.
- Postage charge belongs with the fulfilment/delivery workflow.
- Payment status and order workflow wording are separated.
- Existing/new internal status value `New / awaiting payment` displays as `New order` where safe.
- Customer-facing paid new orders display as `Order received / being prepared`.
- Reta structures now attach default materials per vial.
- Test orders are excluded from active value and active operational queues.
- Past/Test/Live order type notices are shown near Order type.
- Courier collection added.
- Fulfilment / Delivery grouped by workflow.
- Dispatch quick access added to Start.
- Label/QR fields added as manual text-only fields.
- `Prep anyway` renamed to `Move to prep — unpaid`.
- `Not paid` removed from visible payment status.
- `Awaiting payment` is default.
- `Paid`, `Waived`, and `Approved credit` remain payment-cleared.
- `Pay on collection` remains not fully cleared.
- Materials section needs compact mobile behaviour.
- Materials summary appears before editable fields.
- Full material fields are behind `Edit materials`.
- Delivery/Royal Mail grouped by workflow step.

## Do-Not-Touch Rules
- Do not use abandoned v33.
- Do not touch pricing logic unless explicitly approved.
- Do not touch Reta vial/kit product logic unless explicitly approved.
- Do not touch stock deduction logic unless explicitly approved.
- Do not overwrite live versions without confirming target path and version.

## Current Risks
- Some products still need owner-confirmed standard/existing prices.
- Old orders with `£0` lines need manual review.
- Full pathway content build-out still required.
- Existing orders with old status labels may display using mapped wording.
- Existing saved structure orders may need reopening/resaving if materials were saved incorrectly before v42.
- Manual label/QR fields are text-only until upload/scanning exists.

## Upload / Live Status
- Local live-folder build only.
- Not committed.
- Not pushed.
- Not confirmed live on GitHub Pages.
