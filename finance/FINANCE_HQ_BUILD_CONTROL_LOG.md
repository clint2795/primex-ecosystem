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
- .comm-row button:disabled

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
