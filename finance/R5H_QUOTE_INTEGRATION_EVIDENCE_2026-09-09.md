# R5H Quote integration — working evidence

Status: IN PROGRESS. Source-grounded v2 Quote mount and isolated rendered journey are locally verified; protected publication and authenticated owner/Jade acceptance remain pending. No live cutover authorised.

Continuation checkpoint: 21729ec (`Export protected source for isolated Quote integration testing`). Integration rollback: d4eb44634e54551d5c64a51f43ef42f9c3d300bf. Branch: review/r5h-quote-integration. PR: #4.

## Implemented

- Source inventory reads the actual protected R5G Finance source and identifies quote creation, saving, approval, message, acceptance, conversion, stock and shared-record functions. No pricing or business-rule copy was created.
- Added quote-domain-adapter.js: a narrow asynchronous authority-port contract for open/new, draft save, approval, message preparation, acceptance, conversion and separate live-order saving. It rejects read-only edits, accepted-lock edits, stale or unsaved approval, missing sent-message evidence, duplicate conversion and operations whose results cannot be confirmed. It serialises operations and does not invent success when the authority rejects an action.
- Added focused Node regressions against a controlled authority port plus source-boundary assertions against the actual protected engine.
- Corrected the CI checkout to fetch the base history before checking production-file isolation.
- Mounted the unchanged `finance-operator-layout-review/index.html` engine into the v2 Customer Job workspace. The port loads that source at runtime, checks the R5G marker and required functions, and exposes only the narrow adapter commands.
- Isolated proof execution uses memory-only storage and a no-network CSP. Shared sync and real email/WhatsApp launch are unavailable, so proof activity cannot update live customers, stock, Finance records or Supabase.
- Added deliberate proof-only handoff evidence as a separate step from sent evidence. The generated body and destination must still match the current engine fingerprint before sent evidence can be recorded.
- Approval, sent, acceptance and live-order save commands poll the engine's own saved records. Conversion is unavailable until the accepted snapshot is authoritatively saved; the separate live save is not complete until both the live `sourceQuoteId` and source quote `convertedOrderId` are confirmed.
- The v2 Customer Job retains the same identity across Quote activity and moves to Payment only after the new live order has been saved separately. Source quote sent evidence remains visible after conversion.

## Verified

Earlier GitHub Actions Finance v2 quote integration run 34341373066, commit 5e937c9a82561f7c4b15279d897a4adabb53e824: completed successfully. Source inventory, adapter regressions and production isolation all passed.

Local automated verification on 9 September:

- `node --test scripts/r5h-quote-adapter.test.mjs`: 12/12 pass. Coverage includes asynchronous saved-state confirmation, read-only/accepted locks, current approval and message fingerprints, deliberate handoff, sent evidence, saved acceptance, source linkage, separate live save, duplicate conversion, stale commercial authority, shared-conflict fail-closed behaviour and Finance-role pricing scope.
- `node finance/tests/r5h_batch3_shared_reliability_regression.js`: pass.
- `node finance/tests/r5h_batch4_lease_message_truth_regression.js`: pass.
- `node finance/tests/r5h_batch4_outbound_body_audit_regression.js`: pass.
- `node scripts/verify-finance-operator-layout.mjs`: pass.
- `node scripts/verify-email-only-handoff.mjs`: pass.
- `node finance/tests/r5h_payment_module_regression.mjs`: 7/7 pass.
- `git diff --check`: pass apart from Windows line-ending notices.

Rendered isolated browser evidence:

- Structured request fixture became a real Quote containing RTA20 at the engine-authoritative £150 total with held stock 10.
- Draft save and approval completed; approval showed the matching source and held-stock facts.
- The actual generated customer body was independently opened and checked. It contained the real itemised quote, products/postage/total, available-now statement, expected dispatch and explicit `CONFIRM` instruction.
- A copy handoff was prepared as proof-only evidence; nothing was sent. Sent evidence was then recorded through the engine, followed by customer acceptance and a locked £150 accepted snapshot.
- Conversion created a distinct live reference linked to the source quote. A separate save confirmed both linkage directions, after which the same Customer Job showed Payment as the next stage.
- Editing expected dispatch after preparing the message caused the handoff to fail as stale.
- A GHKCU50 shortage scenario showed held quantity zero and required the confirming-availability route with a dated next update before approval.
- 390×844 and 1440×900 checks showed no horizontal overflow; phone controls were at least 44px high.
- No real customer handoff, financial transaction, stock change, shared write or external request occurred.

## Source findings that control the next step

- approveCurrentQuote uses quoteApprovalIssues and a commercial fingerprint; its save is asynchronous.
- startSendQuoteWorkflow requires a saved quote and matching saved approval, prepares a message, and does not send it.
- customerMessageIsCurrent accepts the actual message element and compares template version, kind and dependency fingerprint.
- markCurrentQuoteAccepted creates an acceptedSnapshot and calls saveOrderNow; it must not be replaced by a generic status update.
- convertCurrentQuoteToLive requires an accepted snapshot, checks an existing conversion, creates a locked live-order record and requires a separate save to activate stock/Workflow.
- saveOrderNow handles local persistence, online backup, source-quote linking and stock recalculation. The adapter must not reimplement those behaviours.
- Existing quickQuoteUpdate is a separate legacy shortcut and is not exposed by the new adapter because it is not an adequate acceptance-authority boundary.

## Remaining R5H gate

Publish this verified change to the existing protected review route only after explicit approval, then perform authenticated two-operator owner/Jade acceptance against non-live test records. That acceptance must exercise claim contention, lease loss, retry/reload and each user's actual stored permissions. Source inspection and regressions confirm read-only conflict handling and `admin`/`finance` pricing scope, but they do not prove Clint's and Jade's current account assignments. The historical Drive working brief was located and confirmed that the repository is authoritative; it contained no current R5H role mapping, so none was invented.

Two inherited repository-verifier issues are recorded rather than concealed: `scripts/verify-commercial-authority.mjs` references `supabase/cutover/20260817_commercial_authority_v2_price_integrity.sql`, which is absent from this branch and `origin/main`; `scripts/verify-message-direction.mjs` expects an older generator signature in `finance/index.html`. Neither file is in the Quote mount's change set, and live/protected source was not altered to force those unrelated checks green.

The wider Payments, purchasing and accounting requirements remain retained in the controlling integration plan. No real customer messages, financial transactions, stock records or Supabase data were changed by this branch.
