# R5H Quote integration — working evidence

Status: IN PROGRESS. Domain adapter and isolated regression suite implemented; actual v2-to-engine mounting, rendered review and operator acceptance pending. No live cutover authorised.

Base: 41b7d52d2586b7df4eec094cf17034fa883f3a04. Rollback: d4eb44634e54551d5c64a51f43ef42f9c3d300bf. Branch: review/r5h-quote-integration. PR: #4.

## Implemented

- Source inventory reads the actual protected R5G Finance source and identifies quote creation, saving, approval, message, acceptance, conversion, stock and shared-record functions. No pricing or business-rule copy was created.
- Added quote-domain-adapter.js: a narrow asynchronous authority-port contract for open/new, draft save, approval, message preparation, acceptance, conversion and separate live-order saving. It rejects read-only edits, accepted-lock edits, stale or unsaved approval, missing sent-message evidence, duplicate conversion and operations whose results cannot be confirmed. It serialises operations and does not invent success when the authority rejects an action.
- Added focused Node regressions against a controlled authority port plus source-boundary assertions against the actual protected engine.
- Corrected the CI checkout to fetch the base history before checking production-file isolation.

## Verified

GitHub Actions Finance v2 quote integration run 34341373066, commit 5e937c9a82561f7c4b15279d897a4adabb53e824: completed successfully. Source inventory, adapter regressions and production isolation all passed. This is unit/contract evidence, not a rendered end-to-end or production integration acceptance.

## Source findings that control the next step

- approveCurrentQuote uses quoteApprovalIssues and a commercial fingerprint; its save is asynchronous.
- startSendQuoteWorkflow requires a saved quote and matching saved approval, prepares a message, and does not send it.
- customerMessageIsCurrent accepts the actual message element and compares template version, kind and dependency fingerprint.
- markCurrentQuoteAccepted creates an acceptedSnapshot and calls saveOrderNow; it must not be replaced by a generic status update.
- convertCurrentQuoteToLive requires an accepted snapshot, checks an existing conversion, creates a locked live-order record and requires a separate save to activate stock/Workflow.
- saveOrderNow handles local persistence, online backup, source-quote linking and stock recalculation. The adapter must not reimplement those behaviours.
- Existing quickQuoteUpdate is a separate legacy shortcut and is not exposed by the new adapter because it is not an adequate acceptance-authority boundary.

## Remaining R5H gate

Connect a source-grounded engine port to the v2 Quote Workspace in a truly isolated protected environment; preserve actual pricing, stock, message and save authority. Review the real editor, actual generated customer copy, sent evidence, accepted lock, conversion, source linkage and failure/retry behaviour. Verify owner/Jade permissions and shared conflicts before accepting production integration. Do not publish a mock as the completed Quote Workspace or claim this unit complete merely because unit tests pass.

The wider Payments, purchasing and accounting requirements remain retained in the controlling integration plan. No real customer messages, financial transactions, stock records or Supabase data were changed by this branch.
