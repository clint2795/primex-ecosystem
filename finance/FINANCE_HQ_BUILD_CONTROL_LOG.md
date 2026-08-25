# PrimeX Finance HQ Build Control Log

## PX-ROUTE-R5C — Customer Message Authority (LOCAL PROTECTED REVIEW)

- Date: 2026-08-25.
- Purpose: stop incomplete, legacy or mismatched customer messages being copied, opened or marked sent, and make the first quote carry the information already known at quote time.
- Destination controls: Finance screen remains internal operator-only; generated quote/order/update bodies remain outbound customer copy; email and WhatsApp actions remain deliberate handoffs and never send automatically.
- Adds message template authority `PX-MSG-R5C-1`. Every newly generated confirmation or fulfilment message stores its type, template version and a dependency fingerprint covering the customer, contact route, reference, line items, prices, total and the operational facts used by that message.
- Changing a relevant order or quote fact invalidates the saved message. Old records without current authority metadata and generated rows pointing at another message type show `Regenerate required`.
- Stale messages cannot be copied, opened in email/WhatsApp, marked sent, marked already sent or skipped. The only active row action is to generate a fresh message.
- Quote-to-live conversion clears the quote message and message metadata so a quote body cannot become the live-order confirmation.
- The first quote now contains itemised lines, product total, postage, total, availability, explicit expected dispatch when known, or a dated next-update promise when dispatch is genuinely unconfirmed, plus one confirmation/change reply instruction.
- Retires the vague `Availability, fulfilment, payment, and dispatch details are confirmed separately` quote wording and the `Estimated total` label.
- Availability modes `Available now`, `Part ready`, `Incoming stock` and custom wording require an explicit expected-dispatch entry before approval. Unconfirmed timing continues to require a future dated update.
- Regression coverage: `scripts/verify-finance-message-authority.mjs` blocks the retired wording, missing authority metadata, copy/open/mark-sent bypasses and quote-message carry-over. Workflow, commercial-authority, message-direction and email-only checks remain in the suite.
- Verification passed: Finance JavaScript parsing; message-authority regression; workflow reliability; commercial authority; message direction; emergency email-only handoff; diff formatting.
- Environment limit: no local browser binary is available in this workspace, so rendered desktop/mobile interaction remains for owner review on the protected route after publication is separately authorised.
- Files in this work unit: `finance/index.html`, `scripts/verify-finance-message-authority.mjs`, `scripts/verify-finance-workflow-reliability.mjs`, `scripts/verify-message-direction.mjs`, this control log.
- No customer message was sent, no database record was changed, and no commit, push, publication or live Finance change was made.
- Accepted rollback remains protected review publication `ac6b09e03e6079dc12685e02253c9aca2eb27f2d`; live `/finance/` remains unchanged.
- Status: local protected review ready. R5D stock/deadline truth and R5E app-wide mobile readability remain queued and were not started.

## PX-ROUTE-R5B — Email Quote Workflow (PROTECTED OWNER REVIEW)

- Date: 2026-08-25.
- Purpose: make the accepted email-only Early Access intake process usable from customer email through quote preparation and deliberate sending.
- Start now separates `Quote from email` from `Direct order`; email intake starts as `Quote / enquiry`, source `Early Access email`, next action `Quote to send`.
- Adds a customer email field and preserves it through local save, shared payload backup, reopen, request conversion and quote-to-live conversion.
- Quote/order duplicate identity can use customer email when no structured request identity exists.
- Generated quote messages now expose deliberate `Open email`, `Open WhatsApp` and `Copy` routes according to the stored contact details.
- `Send quote` prepares the message and sending choices but does not launch a channel or mark the message sent automatically.
- Email handoff pre-fills the customer address, quote/order reference subject and the approved generated message body. The operator must review and send it in the device email app.
- Existing records without an email remain readable; WhatsApp and Copy remain available.
- No message was sent during implementation or verification. No pricing, stock, protocol, database schema, RLS, Early Access page or live Finance change is included.
- Verification: JavaScript parsing, email intake defaults, email persistence, encoded email handoff, non-automatic sending, shared archive controls, commercial authority, message direction, email-only handoff and diff formatting passed.
- Rollback: republish protected review commit `42c3eaef34b428e3632dedf2234b5b922e4c2e9b`.
- Review publication: `ac6b09e03e6079dc12685e02253c9aca2eb27f2d` updated only `finance-reliability-review/index.html`.
- Live verification: the protected route serves `PX-ROUTE-R5B JS OK`; `Quote from email` opens an Email quote with `Quote / enquiry`, `Early Access email` and `Quote to send` selected, with customer email visible before Phone/WhatsApp.
- Environment limit: the cloud browser cannot prove the device email application boundary without launching a real `mailto:` handoff; static verification confirms the address, subject and body are encoded and no send/mark-sent action is automatic.
- Status: published for protected owner review; live `/finance/` remains unchanged.

## PX-ROUTE-R5A — Shared Request Archive (PROTECTED OWNER REVIEW)

- Date: 2026-08-25.
- Purpose: remove retired/test Early Access submissions from active work consistently for the owner and Jade without deleting customer records.
- Adds a shared `Archive request` action which updates `quote_requests.request_status` to `closed` only after an authenticated database update succeeds.
- Adds an `Archived` request view and a shared restore action. Archived requests remain recoverable and are excluded from active Request counts and alerts.
- Shared closed records are included during refresh solely so they remain visible in Archived; database request status overrides stale payload status.
- Cross-device reconciliation handles archive and restore changes without allowing an older local status to silently win.
- The existing local Bin is explicitly labelled device-only and is no longer offered as the cleanup action for cloud-backed requests.
- No database records were archived, restored, deleted or otherwise changed during implementation or verification.
- No schema, RLS, commercial pricing, stock, protocol, customer page or live Finance change is included.
- Verification: JavaScript parsing, shared archive controls, non-deletion guard, cross-device status reconciliation, commercial authority, message direction, email-only handoff and diff formatting passed.
- Rollback: republish the earlier protected review route from commit `3c850165968f0c7098d16cb7590a18096dd631aa`.
- Review publication: `42c3eaef34b428e3632dedf2234b5b922e4c2e9b` updated only `finance-reliability-review/index.html`.
- Live verification: the protected route serves `PX-ROUTE-R5A JS OK`; Requests contains `Archived` and `Local bin`, Archived opens independently, and no database record was changed during verification.
- Status: published for protected owner review; live `/finance/` remains unchanged.

## PX-ROUTE-R5 — Finance Reliability (PROTECTED OWNER REVIEW)

- Date: 2026-08-24.
- Purpose: make quote and order processing dependable while the accepted Early Access page remains on its emergency email-only route.
- Accepted remote checkpoint: `1a75491964ce326bf57dcdde129d9aab2caf2d3b`; equivalent protected local source: `3d0ac53`.
- Quotes with uncertain stock or dispatch timing require a future customer-update deadline. Due-soon and overdue commitments appear on Start.
- Customer availability messages state the promised next-update deadline and cannot be generated without one.
- New quotes and orders require an explicit postage decision. A charged decision requires a positive postage amount; a no-charge decision requires £0.
- Existing saved records derive their earlier postage decision from the saved amount so accepted historical work is not stranded.
- Quotes and workflow changes remain saved on the operator device if the online backup fails. The failure is surfaced as `Retry online backup` rather than blocking the operator path.
- Customer deadlines outrank routine online-backup warnings within the same severity.
- Record-dependent quote, confirmation and fulfilment actions wait for the requested record to finish loading before acting.
- Workflow quick actions now attempt the same online backup after the local save, preventing silent device-only status changes.
- The stale direct cloud-submission Planner changes from the earlier audit were not carried into this review. The accepted public email-only route is unchanged.
- Commercial pricing, product authority, strengths, stock quantities, protocol calculations, database schema, RLS and the permanent website remain unchanged.
- Supabase review: current changelog/docs checked; no database, policy, table, function or Edge Function change is included.
- Focused checks: Finance JavaScript parsing, workflow-reliability regression, commercial authority, message direction, email-only handoff and diff formatting.
- Review publication: `3c850165968f0c7098d16cb7590a18096dd631aa` adds only `finance-reliability-review/index.html`; live `/finance/` and the public Planner remain unchanged.
- Live verification: `https://portal.primexbiolabs.co.uk/finance-reliability-review/` serves `PX-ROUTE-R5 JS OK`, loads the shared Finance configuration and contains the explicit postage and customer-update controls.
- Rollback: remove the isolated `finance-reliability-review/` route and retain remote `1a75491964ce326bf57dcdde129d9aab2caf2d3b` for live Finance behaviour.
- Status: published for protected owner review. No live Finance replacement or database write performed.

## v44E3E Workflow Usability Layout
- Date: 2026-07-02
- Scope: Workflow/Start presentation and routing only.
- Moved the active Workflow record list above the stage selector and converted the twelve large stage cards into compact stage tabs.
- Added an active-stage heading/count, retained the previous non-empty stage where possible, otherwise selected the first non-empty stage, and added a clear all-empty state.
- Stage clicks now update and temporarily focus/scroll to the active work list while preserving existing row actions and derived stage membership.
- Replaced Start's twelve-stage mirror with six aggregate Mission Control cards for quotes, stock, payment, preparation, handover and tracking.
- Removed the redundant Start Quote follow-up tile section; closed quote access remains available through History and active quote work through Workflow.
- Replaced the literal Admin `??` label with `WARNING — Wipe Local Finance Workspace`.
- Preserved stored values, lifecycle transitions, stock logic, database fields and message templates.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E3D Workflow Page Foundation
- Date: 2026-07-02
- Scope: Active-work presentation and routing only.
- Renamed the visible Queues page/navigation to Workflow while retaining internal view IDs and persistence contracts.
- Added twelve derived Workflow stages covering quote drafts, active quote follow-up, stock shortage, payment, preparation, packing, collection, dispatch and tracking follow-up.
- Added separate Workflow render paths for quote/request-draft rows and live-order rows so quote rows never expose payment, packing or dispatch controls.
- Made live-order stage assignment mutually exclusive using stock shortage, then uncleared payment, then existing fulfilment/order status.
- Restricted History presentation to completed, cancelled, converted/closed quote, past/test and binned records; active work remains in Workflow.
- Restricted the active Request Inbox presentation to new/review intake while preserving linked/draft/closed request records internally.
- Updated Start summary routing to open the matching Workflow stage.
- Preserved stored status/quote values, orders, request records, save paths, stock deduction logic, lifecycle functions, message templates and database schema.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E3C Start / Queues Consolidation
- Date: 2026-07-01
- Scope: Start/Queues presentation and routing only.
- Kept Start as a command-centre summary with queue counts, quote follow-up, one Next actions list, urgent stock, quick navigation, and one Backup action.
- Removed the embedded queue order list, duplicate top Action Banner, direct customer-message action rows, Dispatch handover detail, and duplicate Quick actions backup button from Start.
- Added `startQueueCardHTML(x)` so Start queue summary cards navigate to Queues and open the selected existing lane.
- Kept Queues as the sole full operational lane view, with existing rows, filters, buttons, calculations, and transitions unchanged.
- Preserved queue logic, status transitions, stock logic, storage, message templates, and database fields.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E3B Operator Language Pass
- Date: 2026-07-01
- Scope: Operator-facing presentation wording only.
- Updated Finance visible/version markers to v44E3B.
- Reworded Request Inbox lifecycle badges and actions around the next operator step while preserving technical item-readiness and stored request states.
- Added `operatorQuoteStatusLabel(status)` and separated raw quote status from its History display label so quote actions continue using unchanged lifecycle values.
- Reworded Start quote follow-up tiles, action alerts, Customer messages to send, payment/release guidance, and Communication Centre rows/status badges around what to do next, what is awaited, or what is blocking progress.
- Renamed Step 4 presentation to Fulfilment & Messages / When needed without moving or redesigning its contents.
- Preserved status values, queue behaviour, database fields, lifecycle transitions, stock logic, customer message templates, and message-generation behaviour.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E3A Customer-Safe Quote & Order Messages
- Date: 2026-07-01
- Scope: Customer-facing quote and final order confirmation wording only.
- Updated Finance visible/version markers to v44E3A.
- Added `customerMessageLine(l)` so zero-price/no-charge support items display as Included in customer messages while preserving internal pricing and order lines.
- Updated only the Quote / enquiry branch of `generateConfirmation()` with the approved Quote & Availability wording, customer-safe greeting, conditional BAC prompt, clear reply action, and unchanged RUO wording.
- Updated only the Live order branch of `generateConfirmation()` with customer-safe final items, total, payment wording, delivery/collection wording, next-step copy, and unchanged RUO wording.
- Preserved `customerLineTitle(l)`, including the Retatrutide Observation customer wording.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No payment-request generator/row, persisted fields, availability field, quote/order status, WhatsApp, Mark sent, stock, pricing, Request Hub, Planner, Supabase, fulfilment logic, or Step 2 layout was changed.

## v44E2Z Next-Action Routing
- Date: 2026-07-01
- Scope: Finance HQ next-action routing and presentation only.
- Updated Finance visible/version markers to v44E2Z.
- Added `openOrderTask(orderId,task)` and `orderTaskTarget(task)` so Start action alerts open the saved order, reveal Optional Details when required, scroll to the relevant control/Communication Centre row, and apply a temporary focus highlight.
- Added stable `data-comm-key` targets to Communication Centre rows and `.next-action-focus` styling.
- Routed payment, confirmation, customer-update, tracking/label, dispatch and hold alerts to their relevant Order-page targets without generating, sending or marking messages.
- Made normal New-order unpaid presentation read Awaiting payment, retained stronger unpaid warnings for advanced stages, and aligned Paid, Waived and Approved credit presentation with `isPaymentCleared()`.
- Added derived converted-quote presentation: source quotes and linked Request Inbox records show Converted to live order, and the Start quote bucket is now Closed / converted.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No confirmation packing blocker, stock deduction rule, totals, quote conversion data, message generation/sending, Request Hub, Planner, Supabase schema, or Step 2 layout was changed.

## v44E2Y Start-Only Action Dashboard
- Date: 2026-06-30
- Scope: Finance HQ UX/layout refinement only.
- Updated Finance visible/version markers to v44E2Y.
- Moved the existing global `#actionBanner` into `#view-start` so Action Needed operational awareness appears only on Start.
- Order, Queues, History, Requests, Stock, and Admin now remain focused on their module workflows while existing inline/module-specific warnings remain unchanged.
- Kept `deriveActionAlerts()`, `renderActionBanner()`, action routing, module warnings, and all operational data logic unchanged.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No stock, pricing, quote/request/order lifecycle, messaging, Supabase, fulfilment, or workflow behaviour was changed.

## v44E2X Request Inbox Lifecycle Cleanup
- Date: 2026-06-30
- Scope: Request Inbox presentation/lifecycle badges and header counts only.
- Updated Finance visible/version markers to v44E2X.
- Added `requestInboxLifecycleBadge(req,blocked)` so linked saved quotes show Quote created, Waiting customer, Customer accepted, Quote parked, Quote cancelled, or Linked quote missing before falling back to draft/request/item-readiness states.
- Updated `renderRequestInbox()` to keep every linked record visible, preserve Open quote actions, and show separate active-intake and linked-record header counts.
- Kept `requestItemStatus()` and `activeRequestInboxItems()` unchanged.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No quote send, Mark sent, dashboard quote counters, quote history, live order conversion, stock, pricing, Request Hub import, Supabase schema, Step 2 layout/alignment, or message wording was changed.

## v44E2W Quote Mark Sent Persistence
- Date: 2026-06-29
- Scope: Quote Mark Sent persistence only.
- Updated Finance visible/version markers to v44E2W.
- Updated `markConfirmationSentNow()` so Quote / enquiry Mark sent sets confirmation and waiting-customer state, centralises the Communication Centre sent state, and immediately persists through the existing `saveOrderNow()` path.
- Removed the duplicate chained `setCommStatus('orderConfirmationStatus','sent')` call from the Communication Centre Mark sent action.
- Kept live order confirmation on the existing manual-save workflow while retaining its Communication Centre sent-state refresh.
- Fixed `quickQuoteUpdate()` so moving a quote to Quote sent / waiting customer explicitly sets confirmation to `Yes`.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No Request Inbox lifecycle badges, quote message wording, WhatsApp opening, stock rules, pricing, Planner, Request Hub import, Supabase schema, fulfilment, layout, or Step 2 UI was changed.

## v44E2V Quote WhatsApp Flow Polish
- Date: 2026-06-27
- Scope: Quote send workflow polish only.
- Updated Finance visible/version markers to v44E2V.
- Updated `startSendQuoteWorkflow()` to open the existing WhatsApp URL automatically when the generated quote message and a valid phone number are available, without marking the quote sent.
- Added a persistent no-phone instruction that keeps the generated message available for copy/manual sending or adding a WhatsApp number.
- Polished only the Quote / enquiry branch of `generateConfirmation()` with warmer customer-ready wording and guarded greetings for blank/internal/test references.
- Kept `customerLineTitle(l)`, including the `RTA20_OBSERVATION` customer wording, and continued omitting Quote status and Customer note from quote messages.
- Updated `quoteHistoryRow(o)` so quote cards keep Payment and Quote status but no longer display the inherited ordinary order status; live order history rows are unchanged.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No stock, pricing, Request Hub, Planner, Supabase, fulfilment/update messages, live order confirmation messages, Step 2 layout/alignment, quote status transitions, or Mark sent behaviour was changed.

## v44E2U Persistent Quote Send Instruction
- Date: 2026-06-26
- Scope: Quote Send workflow instruction only.
- Updated Finance visible/version markers to v44E2U.
- Added `#quoteSendInlineStatus` near the generated confirmation/quote message area.
- Added `setQuoteSendInlineStatus(msg,type)` using the existing inline note status pattern.
- Updated `startSendQuoteWorkflow()` so the final operator instruction is persistent inline text instead of the bottom floating toast.
- Kept validation/error toasts in `startSendQuoteWorkflow()` unchanged.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No global toast behaviour, `generateConfirmation()` wording, `setCommStatus()` behaviour, quote status logic, pricing, stock, Request Hub, Planner, Supabase, or fulfilment logic was changed.

## v44E2T Customer-Safe Quote Messages
- Date: 2026-06-26
- Scope: Quote customer message generation only.
- Updated Finance visible/version markers to v44E2T.
- Added `customerLineTitle(l)` for customer-facing quote message wording without changing `lineTitle()` or internal order summaries.
- Quote / enquiry messages now use `customerLineTitle(l)`, so `RTA20_OBSERVATION` displays as `Retatrutide Observation / 1 vial allocated`.
- Removed customer-facing `Quote status` and `Customer note` lines from Quote / enquiry messages.
- Kept RUO wording unchanged.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No live order confirmation, fulfilment/update messages, pricing, stock, Request Hub, Planner, Supabase, or quote workflow logic was changed.

## v44E2S Stage-Aware Quote Cards
- Date: 2026-06-26
- Scope: History > Quotes card actions only.
- Updated Finance visible/version markers to v44E2S.
- Added `sendQuoteFromHistory(id)` to load a quote and reuse the existing `startSendQuoteWorkflow()` without marking the quote sent automatically.
- Updated `quoteHistoryRow()` so quote cards show stage-aware actions: `Send quote` for Quote to send, `Customer accepted` for waiting customer, `Convert to live order` for ready to convert, and Open / edit only for parked/cancelled statuses.
- Existing advanced quote controls remain available.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No History renaming, nav labels, function/view IDs, stock, pricing, Request Hub, Planner, Supabase, fulfilment logic, or send/Mark sent behaviour was changed.

## v44E2R Visible Send Quote Workflow
- Date: 2026-06-25
- Scope: Visible saved-quote send workflow only.
- Updated Finance visible/version markers to v44E2R.
- Added a `Send quote` action near the Save area for saved Quote / enquiry records with `Quote to send` status.
- The action reuses `generateConfirmation()`, opens Optional Details / Communication Centre, scrolls/focuses the generated quote message area, and marks the communication row as generated.
- The action does not mark the quote as sent automatically; existing `Mark sent` behaviour still moves the quote to `Quote sent / waiting customer`.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No stock, fulfilment, Request Hub, Planner, pricing, Supabase, quote-to-order conversion, or Customer accepted logic was changed.

## v44E2Q Request Inbox State Guard
- Date: 2026-06-25
- Scope: Request Inbox state guard only.
- Updated Finance visible/version markers to v44E2Q.
- Added guards in `convertRequestToQuote()` so requests with an existing `convertedOrderId` open the linked quote instead of creating another quote.
- Added draft-state handling so requests with `draftOrderId` or `draft quote` state resume a recoverable draft or warn instead of creating a duplicate draft.
- Made Request Inbox actions status-aware: new/reviewed requests show `Create quote`, draft requests show `Resume quote`, converted requests show `Open quote`, and parked requests show `Unpark` / `Move to Bin`.
- Added lifecycle text for draft, converted, and parked request cards.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No quote send workflow, Communication Centre, pricing, stock, Supabase, Planner, Request Hub, fulfilment logic, payment/fulfilment gate, dashboard count logic, or existing data cleanup was changed.

## v44E2P Planner Request Mapping Guard
- Date: 2026-06-24
- Scope: Planner-origin Retatrutide Observation request mapping only.
- Added the Finance request alias `RTA20_OBSERVATION -> RTA20` so Retatrutide Observation imports can create a quote line from Request Inbox.
- Added a zero-line guard in `convertRequestToQuote()` so Finance does not silently create a Â£0 quote when no request items map into quote lines.
- The guard shows: `No quote items were imported. Review request mapping before creating quote.` and keeps the request active.
- Existing Â£0 test quote records were not cleaned or changed.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing logic, stock logic, Supabase logic, Request Hub, Planner, payment/fulfilment gate, notification system, or button labels were changed.

## v44E2O Request Confidence Hotfix
- Date: 2026-06-24
- Scope: Customer/operator confidence fixes only.
- Request Hub dropdown options now use stronger scoped option states for browser/native select readability.
- Request Hub top Send request validation now scrolls/focuses the visible validation message when blocked.
- Request Hub now shows visible status after adding or removing request items.
- Planner request tray now blocks Continue to request form when no items are selected and shows: `Select at least one item before continuing to the request form.`
- Finance cloud refresh copy now states that cloud refresh can re-import existing Supabase requests and that local wipe does not delete cloud rows.
- Finance cloud refresh now reports preserved rows as existing requests already converted/binned.
- Files changed: order-request/index.html, planner/index.html, finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No staff notification, pricing, stock calculations, quote/order lifecycle, Supabase schema, product rules, or Request Hub payload shape were changed.

## v44E2N Request Capture Reliability
- Date: 2026-06-24
- Scope: Request capture reliability only.
- Updated Finance title/comment markers to v44E2N Request Capture Reliability.
- Request Hub now blocks submit/copy/email fallback validation when no items are selected and shows: `Please select at least one item before sending your request.`
- Request Hub now treats Edge Function duplicates as a specific already-received state instead of normal sent success.
- Edge Function now rejects empty item arrays with `{ ok:false, error:"No request items supplied" }` before inserting into `quote_requests`.
- Finance cloud refresh now reports skipped cloud rows with request ref, created time, and validation reason in the visible refresh status.
- Files changed: order-request/index.html, supabase/functions/submit-request/index.ts, finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock calculations, quote/order lifecycle, Planner, product rules, message templates beyond the requested validation/duplicate messages, or localStorage keys were changed.

## v44E2N Final Destructive-Action Confirmation
- Date: 2026-06-24
- Scope: Wipe Local Finance Workspace safety only.
- Updated visible version markers to v44E2N.
- Added a final destructive-action confirmation after the exact `WIPE LOCAL WORKSPACE` phrase is entered.
- The wipe still clears local Finance HQ browser workspace data only and still does not delete Supabase cloud requests.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock calculations, Supabase sync logic, Request Hub, Planner, product rules, message templates, or localStorage keys were changed.

## v44E2M Operator Clarity & Workspace Safety
- Date: 2026-06-24
- Scope: Phase 1 operator workflow clarity and local workspace wipe safety only.
- Updated visible version markers to v44E2M.
- Renamed the primary save action dynamically: Save quote, Save live order, or Save order.
- Moved manual database save/sync behind Advanced save / database sync controls while keeping local save as the primary action.
- Standardised quote/customer communication labels to Mark sent and Customer accepted in the visible workflow.
- Renamed Convert to live to Convert to live order, Mark delivered / complete to Mark complete, Archive complete to Mark complete, and Reset local test workspace to ?? Wipe Local Finance Workspace.
- Replaced the local workspace wipe confirmation with a two-step warning plus exact phrase entry: WIPE LOCAL WORKSPACE.
- Removed the parked Payment message row from the main Communication Centre and moved the unpaid prep shortcut behind Advanced payment controls.
- De-emphasised quote lifecycle shortcuts in History by moving Move back to Quote to send, Park, and Cancel quote behind Advanced quote controls.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock calculations, Supabase sync logic, Request Hub, Planner, product rules, message templates, or localStorage keys were changed.

## v44E2L Admin Local Test Workspace Reset
- Version: v44E2L local admin cleanup patch
- Purpose: Add a safe Admin reset for local browser test clutter before real customer use.
- Files changed:
  - C:\Users\Clint\OneDrive\Documents\PrimeX Ecosystem\finance\index.html
  - C:\Users\Clint\OneDrive\Documents\PrimeX Ecosystem\finance\FINANCE_HQ_BUILD_CONTROL_LOG.md
- Changes:
  - Added Admin action `Reset local test workspace`.
  - Reset confirmation now states: `This clears local Finance test data only. It does not delete Supabase cloud requests.`
  - Reset clears local Finance workspace keys only and does not touch Supabase config, auth/session storage, or cloud rows.
  - Added Admin shortcut `Refresh cloud requests` for pulling Supabase requests back into the local Request Inbox when ready.
- Verification:
  - JavaScript syntax check passed after patch.
- Risks:
  - Reset also clears local stock/custom stock workspace keys because they are part of the existing Finance local workspace reset key list.
  - Supabase cloud requests remain available and can be re-imported with the refresh action after login.

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
- Confirm currency shows Ã‚Â£, not Ãƒâ€šÃ‚Â£.
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
- Active file was v42.9F with title "PrimeX Finance HQ Ã‚· v42.9F Empty State Warning Hierarchy Polish" and boot badge "v42.9F JS OK".
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
- Active file was v42.9G with title "PrimeX Finance HQ Ã‚· v42.9G Order Step Label Hierarchy Cleanup" and boot badge "v42.9G JS OK".
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
- Active file was v42.9H with title "PrimeX Finance HQ Ã‚· v42.9H Guide Prompt Visibility Polish" and boot badge "v42.9H JS OK".
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
- Open Order Value and other values that use `money()` now render `Â£` correctly instead of mojibake such as `Ã‚Â£` / `AÂ£`.
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


## v44D4A UX Encoding Quote Workflow Patch
Purpose: First safe UX patch after the v44D3 workflow audit.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible build markers to v44D4A.
- Reduced visible mojibake in rendered UI strings, including broken quantity markers, separators, arrows, dashes, checkmarks, and loading text.
- Kept currency display on the stable \\u00a3 formatter path so pound signs continue to render as the GBP pound symbol.
- Changed the local save area wording to `Save quote/order` and added helper text explaining that Quote / enquiry records appear in Quote follow-up after local save.
- Added Quote / enquiry-specific customer message generation titled `Quote / Availability Check`.
- Kept live order customer confirmation titled `Order Confirmation`.
- Changed Quote / enquiry packing wording to estimated/preview language while leaving live order packing wording intact.

What was not changed:
- No pricing, totals, stock calculation, Supabase sync, order sync, courier/postage, fulfilment, product rule, or database logic was changed.
- No auto-sync was added.
- No SQL was run.
- `finance/config.js`, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.



## v44D4B Source Data Encoding Cleanup
Purpose: Clean known mojibake at the source-string/title layer before UI rendering, local save payloads, generated messages, and manual quote/order database sync item titles.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Added cleanDisplayText() for known broken display sequences: broken multiplication marks, separators, dashes, arrows, checkmarks, ellipsis, and pound symbols.
- Added cleanOrderLine() / cleanOrderLines() so locally saved order lines keep cleaned display names and notes without changing product keys, quantities, prices, totals, or stock counts.
- Routed product, support, structure, Request Inbox quote conversion, line titles, packing labels, generated quote/order message item names, and quote_order_items title/payload text through the cleanup path.
- Updated visible build markers to v44D4B.

What was not changed:
- No Supabase sync control flow, table targets, lookup/upsert logic, RLS, SQL, pricing logic, totals logic, stock calculation, fulfilment logic, courier/postage logic, or Retatrutide fulfilment rules were changed.
- finance/config.js, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.


## v44E1 Auto Sync After Local Quote/Order Save
Purpose: After a successful local Save quote/order, attempt the existing quote/order database sync automatically when a Supabase user is logged in.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible build markers to v44E1.
- Kept local Save quote/order as the primary operational save.
- Added automatic post-save quote/order database sync using the existing quotes_orders and quote_order_items sync path.
- Kept the manual Save current quote/order to database button as retry/manual sync.
- Added visible order database sync states: Local only, Database synced, Sync failed / retry needed, and Partial item sync.
- Logged-out or unconfigured Supabase state no longer blocks local save; it records/shows local-only status.

What was not changed:
- No request sync behavior was changed.
- No stock_items, stock_movements, follow_ups, or audit_events writes were added.
- No SQL was run.
- No pricing, totals, stock calculation, fulfilment, message template, courier/postage, Reta/BAC/support, or product rule logic was changed.
- finance/config.js, planner, order-request, product-info, indexbackup, and old Desktop folders were not touched.


## v44E2 Quote Lifecycle Polish
Purpose: Improve saved quote lifecycle status handling without changing Request Inbox, pricing, stock, fulfilment, schema, or sync architecture.

Files changed:
- finance/index.html
- finance/FINANCE_HQ_BUILD_CONTROL_LOG.md

What changed:
- Updated visible build markers to v44E2.
- Added saved quote quick actions: Move back to Quote to send and Cancel quote.
- Kept existing saved quote actions: Mark quote sent, Customer replied, Park, and Convert to live.
- Updated quickQuoteUpdate() to keep local save primary and then trigger existing autoSyncSavedQuoteOrder(id) when available.
- Updated Communication Centre first row label to Quote message for Quote / enquiry records only. Live order wording remains Order confirmation.

What was not changed:
- Request Hub JSON, Request Inbox parser, Convert Request to Quote wiring, pricing/catalogue, stock deduction, fulfilment rules, Supabase schema, courier/payment integration, visual redesign, and finance/indexbackup.html were not touched.

## v44E2B Start Screen Quote Follow-up Priority
- Date: 2026-06-18
- Scope: Start screen layout priority adjustment only.
- Moved existing Quote follow-up section directly after the main Today queue section and before Quick actions.
- Kept Quote follow-up logic, cards, counts, quote status logic, quickQuoteUpdate(), Request Inbox, Supabase sync, stock, pricing, fulfilment, and styling unchanged.
- Updated visible version markers to v44E2B.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E2C Live Operational Mode Cleanup
- Date: 2026-06-18
- Scope: Hosted/mobile local persistence for live operational use.
- Removed the Start/top public prototype warning banner.
- Disabled public prototype mode so hosted Finance HQ loads and saves local orders, request inbox, stock, stock movements, thresholds, and custom stock normally.
- Simplified loadOrdersSafely() and saveLocal() so hosted pages no longer remove orders/request inbox.
- Request Inbox now loads from px_request_inbox_v1 on hosted pages.
- Kept Clear test data / Reset local data available from Admin/System Map using existing clearLocalFinanceData().
- Removed renderPrototypeDataWarning() from the normal renderAll() path.
- Did not change isStockAffectingOrder(), recalcStock(), Past order stock behaviour, Live order stock behaviour, pricing, fulfilment, quote lifecycle, Request Hub parser, or Supabase schema.
- Updated visible version markers to v44E2C.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E2D Kit Display Double-count Fix
- Date: 2026-06-19
- Scope: Support / kit-build stock display only.
- Updated supportMaterialsHTML(m) so it no longer adds the full kitBuildDeductionsFromLines() result on top of current.materials.
- current.materials remains the source for BAC/U100/wipes/box/insert/inlay quantities.
- Retatrutide vial count is still shown by adding only RTA20 vial count from RTA20_KIT product lines.
- Did not change retaMaterials(), autoMaterialsFromLines(), productContentsFromLines(), actual stock deduction, pricing, fulfilment, quote lifecycle, Request Hub parser, Supabase schema, or page layout.
- Updated visible version markers to v44E2D.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E2E Past Order Entry Cleanup
- Date: 2026-06-19
- Scope: Small past-order/live-entry UX cleanup only.
- Updated supportMaterialsHTML(m) to use a display-only support material copy that hides BOX, INSERT, and INLAY from the customer-facing Support / kit-build display.
- Did not change current.materials, retaMaterials(), autoMaterialsFromLines(), recalcStock(), or backend/internal stock deduction behaviour.
- Updated the paymentStatus listener to re-render the Communication Centre when payment status changes, so Paid/Awaiting payment messaging refreshes immediately.
- Added a quoteStatusField wrapper and hide/show handling so Quote follow-up is visible only for Quote / enquiry orders and hidden for Past order, Live order, and Test order.
- Updated visible version markers to v44E2E.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction rules, fulfilment rules, Request Hub parser, Supabase schema, quote conversion, or visual redesign changes.

## v44E2F Order Page Flow Cleanup
- Date: 2026-06-19
- Scope: Small Order page visibility/order cleanup for mobile and historical entry.
- Moved the existing Final check / Payment & release / Save quote/order block before Fulfilment / delivery and Communication Centre so the page now follows customer/order, items, summary, packing, payment/save, fulfilment, communication.
- Added fulfilmentSection and requestIntakeHelper visibility handling without deleting or changing stored fulfilment/request fields.
- Past order and Quote / enquiry now hide the Fulfilment / delivery section from the normal entry flow; Live order and Test order keep fulfilment available.
- Request intake notes now show only for Quote / enquiry or records linked to a source request.
- Stopped updateFulfilmentVisibility() from opening the customer update message by default.
- Added mobile CSS so Communication Centre rows stack cleanly and final action buttons become easier to tap, with Save quote/order prioritized.
- Made the manual database sync button visually secondary while keeping its id and listener intact.
- Updated visible version markers to v44E2F.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, fulfilment data/rules, Request Hub parser, Supabase schema, quote conversion logic, payment/message templates, product logic, or localStorage keys changed.

## v44E2G Guided Past Order Entry + WhatsApp Helper
- Date: 2026-06-19
- Scope: Mobile Past Order guided entry and manual WhatsApp open-link helper.
- Reframed Order page headings toward Step 1 Customer, Step 2 Items, Step 3 Payment / Save, and Step 4 Optional details while preserving existing inputs, IDs, and listeners.
- Past order now keeps the normal entry flow focused on customer/date/source/order type, items, order summary, totals/payment/status, save, and sync status.
- Past order hides the packing section, fulfilment section, Communication Centre, advanced message controls, dangerous/cancel controls, and archive button from the main flow without changing saved data or stock behaviour.
- Added UK-style cleanWhatsAppPhone(), refreshWhatsAppButtons(), and openWhatsAppMessage() helpers.
- Added manual Open WhatsApp buttons beside confirmation and fulfilment/customer update message controls; buttons only appear when a customer phone and generated message text exist, and they open WhatsApp without auto-sending.
- Did not change Supabase/database sync logic; local save remains first.
- Updated visible version markers to v44E2G.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, fulfilment rules/data, Request Hub parser, Supabase schema, quote conversion, product logic, or localStorage keys changed.

## v44E2H Communication Centre Cleanup + Operator Wayfinding
- Date: 2026-06-19
- Scope: Scoped UX/workflow polish for Communication Centre rows, Start screen message actions, and mobile order-page wayfinding.
- Added commRowActionable() so disabled, not-ready, not-needed, sent, already-sent, and skipped communication rows render as status-only rows without action button stacks.
- Start screen Messages to send now shows only ready/usable actions: confirmation needed, customer update ready, and tracking update ready.
- Added small CSS hierarchy improvements for order step cards, optional/scaffold sections, status-only communication rows, action-ready communication rows, and mobile save emphasis.
- Updated visible version markers to v44E2H.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, kit rules, product logic, Request Hub parser, Supabase schema, order conversion, localStorage keys, or payment/message template wording changed.

## v44E2I Single Optional Details Flow
- Date: 2026-06-19
- Scope: Scoped Order page layout cleanup for one clear optional details flow.
- Reordered Order page flow to Step 1 Customer, Step 2 Items, Order summary, Step 3 Payment / Save, and one Step 4 Optional Details wrapper.
- Moved/grouped Packing preview, Advanced message controls, Fulfilment / delivery, Communication Centre, and Cancel / archive options under the single Optional Details wrapper while preserving existing IDs/listeners.
- Payment message row is now disabled/status-only so parked/manual payment wording does not show Mark already sent or Skip for now.
- Past order still hides non-essential optional operational sections; Quote / enquiry still hides fulfilment through existing visibility rules; Live order keeps fulfilment available.
- Updated visible version markers to v44E2I.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, kit rules, product logic, Request Hub parser, Supabase schema, order conversion, localStorage keys, or message template wording changed.

## v44E2J Optional Details Collapse + Compact Polish
- Date: 2026-06-19
- Scope: Scoped UX polish for the v44E2I Optional Details area.
- Added inner optionalDetailsToggle details element inside optionalDetailsSection; Optional Details is closed by default for new Live/Test orders and remains hidden for Past order via existing visibility logic.
- Added optionalDetailsHasSavedData(), setOptionalDetailsOpen(), and openOptionalDetails() helpers.
- Auto-opens Optional Details when generating confirmation/update messages, changing fulfilment away from hold, editing manual packing/material inputs, or loading a saved order with meaningful optional data.
- Made Optional Details, Packing preview, materials summary, and Communication Centre rows visually quieter/compact without changing calculations or message logic.
- Updated visible version markers to v44E2J.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, kit rules, product logic, Request Hub parser, Supabase schema, order conversion, localStorage keys, or message template wording changed.

## v44E2K Communication Centre Task Polish
- Date: 2026-06-19
- Scope: Scoped UX/operator-flow polish for Communication Centre rows, Start screen message actions, and Optional Details visual density.
- Updated commRow() so action-ready rows show task-first actions: Generate message, Open WhatsApp when a customer phone and generated message exist, and Mark sent.
- Moved Copy, Mark already sent, and Skip for now into a low-weight per-row Advanced message controls details area instead of the main action row.
- Kept not-ready, not-needed, sent, already-sent, and skipped Communication Centre rows status-only.
- Updated Start screen message task labels to Send confirmation, Send customer update, and Send tracking update, with only ready message actions rendered.
- Added scoped CSS so Packing preview, Fulfilment / delivery, and Communication Centre inside Optional Details render flatter and more toolbox-like while preserving v44E2J collapsed-by-default behaviour.
- Updated visible version markers to v44E2K.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, kit rules, product logic, Request Hub parser, Supabase schema, order conversion, localStorage keys, or message template wording changed.

## v44E2L Quote Lifecycle Sync
- Date: 2026-06-22
- Scope: Small Quote / enquiry lifecycle sync blocker fix.
- Updated markConfirmationSentNow() so marking a generated quote confirmation as sent now moves blank or Quote to send quotes to Quote sent / waiting customer.
- Preserved existing quote statuses such as Customer replied / ready to convert, Parked, and Cancelled when marking confirmation sent.
- Added markCurrentQuoteAccepted() for Quote / enquiry records to set Customer replied / ready to convert and remind the operator to save the quote.
- Added a quote-only Order page button labelled Customer accepted / ready to convert near the quote conversion and save controls.
- Kept conversion manual and kept the existing save requirement after lifecycle changes.
- Updated visible version markers to v44E2L.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No pricing, stock deduction, kit rules, product logic, Request Hub parser, Supabase schema, localStorage keys, message wording, or quote conversion logic changed beyond the ready-to-convert action.

## v44E3 Request Intake Cloud Bridge Stage 1
- Date: 2026-06-22
- Scope: Supabase preparation only for Request Hub cloud intake.
- Added schema_patch_v44E3_request_intake_bridge.sql to add quote_requests.payload and a duplicate-safe unique partial index on request_ref.
- Added Supabase Edge Function source for submit-request, using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-side only.
- Edge Function accepts Request Hub finance JSON payloads, validates contact/items/body size, stores the full request payload, and returns created/duplicate status.
- No deployment was run from this workspace.
- Files changed: finance/supabase/schema_patch_v44E3_request_intake_bridge.sql, supabase/functions/submit-request/index.ts, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No planner, Request Hub, Finance UI, pricing, stock deduction, quote conversion, product logic, or customer message wording changed.

## v44E3 Request Intake Cloud Bridge Stage 2
- Date: 2026-06-22
- Scope: Request Hub submit wiring only.
- Added public REQUEST_INTAKE_ENDPOINT for the submit-request Edge Function.
- Added cloud-first sendRequest() flow that validates, reuses one financeJsonPayload() per send attempt, posts to the Edge Function, then opens the existing email fallback.
- Added send-button guarding/disable behaviour to reduce duplicate taps while preserving the manual Copy request and Copy finance JSON fallbacks.
- Kept financeJsonPayload() shape and existing email subject/body wording unchanged.
- Files changed: order-request/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No Planner, Finance app flow, pricing, stock deduction, quote conversion, product logic, or customer message wording changed beyond small submit status text.

## v44E3 Request Intake Cloud Bridge Edge Secret Rename
- Date: 2026-06-23
- Scope: Edge Function deployment compatibility patch only.
- Renamed submit-request Edge Function secret reads from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to PRIME_SUPABASE_URL and PRIME_SUPABASE_SERVICE_ROLE_KEY because Supabase CLI rejects custom secret names beginning with SUPABASE_.
- Updated Edge Function comments to match the new secret names.
- Files changed: supabase/functions/submit-request/index.ts, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No function behaviour, Request Hub payload shape, Finance flow, pricing, stock deduction, quote conversion, product logic, or message wording changed.

## v44E3 Request Intake Cloud Bridge Edge Auth Header Hardening
- Date: 2026-06-23
- Scope: Edge Function Supabase client authentication hardening only.
- Kept PRIME_SUPABASE_URL and PRIME_SUPABASE_SERVICE_ROLE_KEY secret names and continued passing the service role key as the createClient second argument.
- Added explicit global apikey and Authorization headers using the same server-side service role key for Supabase REST calls from the Edge Function.
- Files changed: supabase/functions/submit-request/index.ts, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No Request Hub payload shape, Finance app flow, pricing, stock deduction, quote conversion, product logic, or message wording changed.

## v44E3 Request Hub Cloud Submit Customer Flow
- Date: 2026-06-23
- Scope: Customer-facing Request Hub submit UI only.
- Renamed the primary Request Hub button to Send request.
- Updated successful cloud submit so it keeps the customer on the page and shows Request sent to PrimeX for review instead of opening mailto automatically.
- Added Send by email fallback as a manual secondary action and kept Copy request as a fallback.
- Removed customer-facing Copy finance JSON, Contact section, and Product & fulfilment info buttons from the Request Hub action row.
- Files changed: order-request/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- No Planner, Finance HQ, payload shape, pricing, stock deduction, quote conversion, product logic, or customer message template wording changed.


## v44E3F Customer Communication System — 2026-07-02

- Version: v44E3F
- Scope: Customer-facing message system only.
- Replaced the generic fulfilment update with distinct preparation, packed, collection, dispatch, tracking, and stock-delay templates.
- Added shared customer-safe greeting, reference, line-item, workflow selection, and immutable RUO footer helpers.
- Made quote availability wording conditional-safe and retained the BAC water prompt and prices.
- Removed internal status, fulfilment, and payment labels from customer updates; revised order-confirmation payment wording.
- Added a live-order-only Payment Request row using the existing paymentMessageStatus. Generation requires final lines, uncleared payment, and an explicit operator confirmation that final contents are agreed.
- Copy and WhatsApp continue to use the generated textarea. Sending and Mark sent remain explicit operator actions.
- No saved status values, stock calculations, workflow derivation, lifecycle transitions, database schema, totals, Request Hub, or Planner logic changed.


## v44E3G Mission Control Counts + Back Navigation — 2026-07-02

- Version: v44E3G
- Scope: Start-page visibility and lightweight navigation only.
- Added Mission Control cards for New Requests, Customer Messages, and Stock Alerts while retaining all six workflow aggregate cards.
- Added live totals to the Next actions and Urgent stock alerts headings.
- Routed Mission Control cards to Requests, the first actionable customer communication task, and Stock.
- Added an in-app distinct-view Back stack and breadcrumb. Start is the root and disables Back; no browser history or hash routing is used.
- No workflow stages, status values, stock calculations, message templates, lifecycle transitions, or database schema changed.


## v44E3H Operator Guidance System — 2026-07-02

- Version: v44E3H
- Scope: Operator guidance only.
- Added stage-aware Workflow guidance explaining current state, waiting condition, and next actions.
- Added derived-state Order guidance under “What happens next?”.
- Added Request Inbox guidance plus request-specific next-step explanations.
- Added Purpose and Send when guidance to every Communication Centre row.
- Styling uses a subtle neutral operator-assistant panel without warning colours.
- No workflow stages, routing, button behaviour, database schema, lifecycle transitions, stock logic, customer wording, or message generation changed.

Deployment poke for v44E3H GitHub Pages refresh.


## v44E3J Cloud Request Suppression + Message Send Flow Fix — 2026-07-03

- Version: v44E3J
- Added browser-local ignored cloud request identities that survive normal workspace wipe.
- Cloud refresh now skips ignored Supabase IDs/request references before merge.
- Moving a cloud request to Bin also suppresses it from future refreshes.
- Added conservative obvious-test request cleanup and Admin controls for test cleanup and clearing ignored IDs.
- Fixed Payment Request ordering so generated text exists before Communication Centre WhatsApp eligibility rerenders.
- Generated messages are labelled Ready to send and explain that saving happens after sending/marking sent.
- Added disabled missing-phone reason and item-specific manual-review guidance/actions.
- No Supabase rows, schema, workflow stages, stock deductions, lifecycle transitions, or customer message templates changed.


## PX-ROUTE-R2 Connected-System Contract Repair — 2026-07-28

- Repair identifier: PX-ROUTE-R2.
- Aligned Planner, Request Hub, Supabase intake and Finance around the shared 19-product request contract and four stable planning-structure codes.
- Kept Retatrutide at RTA20 / 20mg, BPC-157 at BPC10 / 10mg, and Melanotan II at MT2_10 with Planner hidden, Request Hub selectable and Finance supported.
- Removed the duplicated request-only product cards from Planner while preserving its later customer-route UI and request tray.
- Preserved canonical product, structure and range codes; capped quantities at 1–99; and retained allocated quantities so Planner range totals convert to correct Finance unit prices.
- Made Request Hub request references retry-stable and collision-resistant, kept email and WhatsApp separate, and preserved audit/null-price items for Finance review.
- Added strict Edge intake validation, duplicate-safe handling, and legacy acceptance for existing Planner/request codes without calling a live endpoint.
- Made Finance backward-compatible with stable structure codes, current request-only products, legacy aliases/generic contact fields, structure quantity multipliers and existing local request/order data.
- Verified inline JavaScript syntax, shared visibility/code contract, Supabase project/schema alignment, Edge handler validation/idempotency, storage-key compatibility, Planner-to-Hub browser handoffs, Finance inbox normalization, legacy mappings, quote quantities/totals and persistence across reload.
- Browser verification produced no console errors. No live Supabase request, push, merge or deployment was performed.
- Files changed: planner/index.html, order-request/index.html, supabase/functions/submit-request/index.ts, finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.


## v44E3K Tier-safe Quote Approval + Accepted-total Lock — 2026-07-29

- Version: v44E3K.
- Single purpose: make Finance quote tier pricing deterministic and prevent accepted commercial totals from changing silently.
- Relabelled the existing stored tiers without changing their values: standard = Public, existing = Existing customer, internal = Close contact, custom = Custom approved price.
- Confirmed automatic Retatrutide 20mg pricing only: Public GBP 150, Existing customer GBP 130, Close contact GBP 110.
- Tier changes now recalculate every eligible unlocked Retatrutide quote line already present.
- Non-Public prices for other products and pathways are no longer inferred from unapproved embedded tier values. They show Price approval required until an operator explicitly enters and approves the price.
- Added additive line-level price provenance, priced-tier, lock, approval-required and previous-unit-price fields.
- Custom/manual, included/no-charge and legacy lines are protected from automatic repricing. Older saved lines without v44E3K fields default to legacy-protected without changing their saved price.
- Added a quote approval checkpoint showing previous/current unit price, quantity, line total, postage, final total, unavailable-margin explanation, stock required and fulfilment contents.
- Added Approve and prepare quote. Sending is blocked until the current commercial fingerprint is approved and saved.
- Quote acceptance now captures an accepted snapshot containing tier, lines, quantities, prices, materials, postage service/charge and total.
- Conversion to a live order requires the accepted snapshot and uses that snapshot. The converted order carries a commercial lock so later tier/catalogue changes cannot alter the accepted total.
- Added bounded audit-history entries for tier changes, automatic repricing, manual-price protection/approval, quote approval, quote acceptance and accepted-total locking.
- Kept all existing localStorage keys unchanged. New fields are additive inside existing order/line payloads and remain compatible with existing payload-based database sync.
- Clarified the payment request: no online checkout link is implied; the operator must issue genuine payment instructions separately. Payment-provider selection and structured reconciliation remain a follow-up job.
- Verification: all inline JavaScript parsed successfully.
- Verification: synthetic offline DOM/runtime matrix passed Public to Existing to Close Contact repricing across multiple eligible Retatrutide lines, manual-price protection, non-Retatrutide price blocking/approval, quote approval persistence, accepted snapshot locking, live conversion from the locked snapshot, legacy-line migration defaults, Request Hub contract normalisation/duplicate-safe merge and required audit events.
- Verification: the first matrix run exposed and corrected an in-place repricing defect before final verification; the complete rerun passed 14/14 checks.
- Browser note: the controllable browser rejected the local file URL under its URL security policy, so no live endpoint or hosted production page was used for this implementation test.
- No Planner, Request Hub, Supabase function, schema, product code, request-routing field, public Planner price card, stock deduction rule, localStorage key, commit, push or deployment changed.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.

## v44E3L Automatic Cloud Request Sync — 2026-07-30

- Version: v44E3L.
- Single purpose: remove the operational dependency on remembering to press Refresh cloud requests.
- Restores and validates the persisted Supabase staff session during Finance startup, then imports cloud requests automatically only for an active authenticated profile.
- Repeats the sync every five minutes while Finance is visible and when the page becomes active or focused again.
- Prevents overlapping cloud refreshes and keeps the existing manual Refresh cloud requests button as a backup.
- Shows explicit Checking, Last cloud refresh, Login required, Sync unavailable, and Sync failed states; a local zero is not presented as cloud-verified until a sync succeeds.
- Reuses the existing duplicate-safe merge and preserves progressed, converted, binned, ignored, and locally edited request workflow state.
- No Supabase rows, schema, RLS, Edge Function, Planner, Request Hub, pricing, stock, quote lifecycle, localStorage keys, or customer message wording changed.
- Files changed: finance/index.html, finance/FINANCE_HQ_BUILD_CONTROL_LOG.md.
- Verification: inline JavaScript parses successfully; startup, login, five-minute, visibility/focus, overlap-guard, manual fallback, and untrusted-zero status paths are present.
## PX-ROUTE-R3 — Intake Contract + Public Quote Authority Repair (LOCAL OWNER REVIEW) — 2026-08-16

- Single purpose: make current temporary-Planner requests arrive in Finance with deterministic approved public quote values.
- Corrected Finance Public prices only: BPC-157 10mg £50→£40; TB-500 10mg £70→£65; Thymosin Alpha-1 10mg £85→£75; NAD+ 500mg £65→£49; 5-Amino-1MQ 50mg £125→£110; SS-31 30mg £105→£95; GHK-Cu 50mg £95→£55.
- Verified already-matching Public prices remain unchanged: Retatrutide 20mg £150; MOTS-c 40mg £95; DSIP 5mg £55; KPV 10mg £55.
- Added stable Finance structure mappings for the current public Wolverine £100, Glow £140 and Klow £195 sets so each retains its fixed public total and constituent-vial stock requirements.
- Extended the existing Supabase intake allowlist only for `SET-WOLV10`, `SET-GLOW70` and `SET-KLOW80`.
- Retatrutide private options remain unchanged: Existing customer £130 and Close contact £110. Non-Public prices for other products remain manual/approval-gated under v44E3K behaviour.
- Existing HTML layout, CSS, customer message templates, quote/payment lifecycle, email fallback, stock quantities, historical records, localStorage keys and all other routes remain unchanged.
- Long-term Planner, permanent product range, legacy pathways, private-price revision, customer-message consolidation and stock cutover are outside this release and remain separate objectives.
- Rollback point: `be1c256fabafd2a76a1c669ea0b9917c16d05dfa`.
- Status: local owner review only. No commit, push, Supabase deployment or GitHub Pages deployment performed.

## PX-FINANCE-TIER-CLARITY — Conditional Retatrutide Tier (LOCAL OWNER REVIEW) — 2026-08-17

- Single purpose: remove the redundant Existing-customer choice from routine quoting while preserving Retatrutide's approved exception.
- The normal selector now shows Standard price, owner-approved Close friends/family and the deliberate Custom approved price override.
- Existing customer appears only while Retatrutide is selected or already included in the current quote/order, and identifies the approved Retatrutide £130 price in the option label.
- Switching away from Retatrutide safely returns an unused Existing selection to Standard; non-Retatrutide approved prices remain unchanged because Existing and Standard are identical under PX-COMMERCIAL-2026-08-17.2.
- Added quiet operator-only helper text explaining both the conditional tier and that order/request source is internal tracking only.
- Applied the same operator behaviour to the isolated `finance-protocol-proof/` review route.
- Locked authority, product codes, price values, stock logic, Supabase schema/functions, Planner, Request Hub and customer-facing quote/message output were not changed.
- Verification: both inline JavaScript blocks parse successfully; `git diff --check` passes. Automated browser execution is unresolved because the installed Playwright package has no browser binary in this workspace.
- Rollback point: accepted main `001135580850756d83e9475f58f4b2da4ff8516d`.
- GitHub commits: protocol review route `d49d2aef9d451327c3b8a039e820b28ef0326080`; Finance tier clarity `c72684ac296c186dc31075f4bebc8832f54c1093`.
- Status: committed and pushed to `main` after owner approval. No Supabase deployment or manual deployment action was performed.
