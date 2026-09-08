# R5H — Operator v2 workspace integration

Status: approved product direction; implementation and operator acceptance pending.
Controlling authority: FINANCE_HQ_COMPLETION_REGISTER.md. This document does not close R5H, approve cutover or supersede existing domain controls.
Source checkpoint: d4eb44634e54551d5c64a51f43ef42f9c3d300bf. Previous rollback: 6cc7bfda79bf61570fc02a3195fec4c32403c6a7. Live /finance/ remains locked.

## Product architecture decision

Customer Jobs is the parent work hub. A customer master record, a specific customer job and a specialist domain record are different identities. A customer may have multiple jobs and a job may have multiple quote revisions, payments and fulfilment events. Keep their references and histories linked, never manufacture a customer job merely to record an unrelated business transaction.

The parent job owns context, lifecycle, current action and linked history. The Quote, Order, Payment, Stock and Fulfilment specialists own their domain operations and evidence. A specialist opens within the job context and has a clear return path. Global specialist indexes provide search, filters, bulk work and entry to records across customers. The same authoritative record must be used in the job and global index, not copied into independent ledgers.

Desktop navigation: Start, Requests, Customer Jobs, Quotes, Orders, Stock, Payments, and More/Admin, with utility settings in the shell. Mobile retains five primary destinations: Start, Requests, Jobs, Stock, More. Quotes, Orders, Payments, Purchasing, reporting and settings are discoverable via More and contextual actions. Do not add a tab for every specialist or force unrelated business activity through Customer Jobs.

## Contextual help

Retain the owner's preferred compact icon-and-description treatment as a reusable, optional guide, not a second navigation system or an always-visible dashboard. Place a small Help entry in the shared shell or an existing More/Help area. It explains where a task belongs, its current prerequisites and how to resume it. The actual working screen remains the primary experience. Help must not show fake counts or claim unavailable features are operational. Use the saved theme/emphasis preferences and semantic colours; neutral entries must not look complete. Accessible labels and text remain meaningful without colour. The reference image is a design direction, not a request to replace the current workflow screens.

## Next implementation slice: Quote Workspace

Reuse the hardened quote editor and current commercial authority, rather than recreating pricing logic in a demonstration page. First inspect the existing protected quote creation, amendment, approval, message and conversion functions and their regression tests. Build a reusable domain adapter so the v2 shell can invoke the same operations.

Required operator journey:
1. Open a request or start a new quote, resolving an existing customer or creating the required customer identity without duplicates.
2. Edit line items, quantities and allowed commercial fields using authoritative product codes and prices. Show totals, postage and availability from authoritative data.
3. Save a draft without stock deduction or customer communication. Support reload and Clint/Jade shared-state/conflict behaviour through the existing engine.
4. Review and approve the quote using current stock, pricing and timing rules. A shortage must expose the approved commercial resolution and dated update promise where required.
5. Prepare the actual customer message from the authoritative quote, inspect the rendered body, and deliberately hand off through the selected channel. Generation is not sending; marking sent requires the existing evidence rule.
6. Preserve quote revision history. Amendments must not silently rewrite historical sent messages or an accepted total. Record which version was accepted.
7. Convert an accepted quote to a live order through the existing authority. Only the permitted live-order transition changes stock. The job and global Quotes/Orders indexes must reflect the same record and state.
8. Return to the same customer job with the new stage, current action and evidence visible. No record disappears merely because its stage changed.

Acceptance includes empty, multiple-record, partial/unavailable stock, stale commercial authority, changed quote after message preparation, rejected invalid transitions, save/retry/conflict, and owner/Jade permissions. Run existing regressions plus new adapter-specific tests. Review actual message output independently. No real customer messages or stock changes during proof testing.

## Payment and wider finance boundaries

The existing Payment proof is a useful local interaction checkpoint, not proof of production payment integration. Manual bank reconciliation is the approved first-release approach. Customer claims, recorded evidence, independently confirmed receipts and final reconciliation are distinct states. Partial receipts, duplicate references, overpayment, rejection, audit and permission rules must use the hardened authority. Full payment alone does not invent a live order or dispatch.

A global Payments index is required for customer receipts, unmatched receipts and business outgoings. Supplier payments, expenses and refunds must not be entered through fabricated customer jobs. The first release should record real transactions manually, link to the appropriate customer/order/supplier/purchase/expense record, and distinguish an outstanding commitment from money actually paid. A later bank feed may import and suggest matches, but does not bypass reconciliation authority. Do not introduce a paid bank integration or new ledger schema incidentally during R5H.

Supplier purchasing, broader expense accounting, cashflow and period exports require their own accepted scope and authoritative records. The existing R5I purchasing dependencies and enhancement backlog remain controlling. Reuse existing expense and supplier functionality where present; do not assume it is absent or create a second ledger.

## Completion and release

The next work is the Quote adapter and complete quote-to-order vertical slice, not another colour proof. Payment integration remains pending a real domain adapter and operator acceptance. Fulfilment, stock/purchasing, shared handoff, broader finance and cutover remain separate gates. The UI target remains a shared installable Windows/macOS/iOS/Android/web product with configurable company identity and terminology; no current code should prevent later tenancy, permissions or packaging.

Before each implementation, inspect the actual latest source and record the exact rollback point. Keep work scoped and testable. Publish only the protected review candidate. Do not treat this plan, a successful build, or an isolated demo interaction as owner acceptance or permission to replace live Finance.