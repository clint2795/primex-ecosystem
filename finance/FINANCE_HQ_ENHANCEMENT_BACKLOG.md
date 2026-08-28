# PrimeX Finance HQ — Enhancement Backlog

**Status:** PROPOSED / UNAPPROVED — consider later only  
**Purpose:** Capture business-system improvements that could make Finance HQ stronger, faster, safer or more sellable without interrupting the current completion register.  
**Controlling authority remains:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md`

Nothing in this file is approved for implementation merely because it is listed here. Current completion work stays in R5H → R5I → R5J → Protocol → Cutover order.

## Highest-value candidates

### 1. Universal operator search
Search customers, request refs, quote refs, order refs, phone/email, tracking refs, products and stock from one place. Useful once record volume grows and especially important if Finance becomes a sellable product.

### 2. Customer master record + timeline
One customer page showing requests, quotes, live orders, messages, payments, cancellations, notes and lifetime value. Include duplicate-customer detection/merge with an audit trail.

### 3. Proper task ownership
Every actionable item can have an owner, due date, priority reason, handoff, acknowledgement and completion history. This should build on R5J rather than become a separate competing task system.

### 4. Audit log viewer
Human-readable activity history: who changed price, status, payment, stock, address, message, order ownership or customer data; when; old value → new value; and why where required.

### 5. Exception dashboard / SLA ageing
Show work that is overdue, approaching deadline, waiting too long for customer/supplier/payment, or has failed sync. Include ageing such as “waiting 3d” rather than relying only on status labels.

### 6. Supplier purchasing / PO system
After R5I decisions: supplier records, purchase orders, approval, expected receipt, partial receipts, landed cost, payment/reconciliation, shortage links and customer commitments.

### 7. Inventory forecasting
Beyond low-stock thresholds: usage velocity, days of cover, open-order demand, incoming stock, suggested reorder quantity and “stockout risk before next delivery”.

### 8. Lot / batch / COA traceability
Per receipt: supplier, lot/batch, received date, quantity, COA status/link, expiry/retest date, damage/quarantine/release state and which customer orders consumed which lot where appropriate.

### 9. Barcode / QR stock operations
Scan receive, pick, pack and adjust actions. Reduce manual stock mistakes and make fulfilment faster if order volume grows.

### 10. Payment reconciliation workspace
Structured payment reference, expected amount, received amount/date, method, part-payment, refund, discrepancy and who reconciled it. Later payment-provider integrations should feed this rather than bypass it.

## Sales / customer-operation improvements

### 11. Quote versioning
If a quote changes after it was prepared, keep V1/V2 history and clearly identify which version the customer accepted.

### 12. Quote expiry / validity controls
Optional validity date with clear follow-up, without automatically cancelling useful quotes.

### 13. Customer communication timeline
Chronological record of generated/sent messages and channel, with message authority/version and no mixing of internal notes into customer output.

### 14. Inbound email/request capture
Later: connect inbox intake so email enquiries can become structured records without retyping, while retaining a review gate before anything becomes a quote.

### 15. Reusable customer preferences
Preferred contact channel, collection/delivery preference, usual support items and factual fulfilment preferences — never silently override a new request.

### 16. Saved operator message snippets
Approved factual snippets for common situations, version-controlled and clearly separate from full customer-message templates.

### 17. Better follow-up intelligence
“Waiting on customer”, “waiting on PrimeX”, “waiting on supplier” and “waiting on carrier” as distinct responsibility states so nothing sits in a generic pending bucket.

## Fulfilment / logistics improvements

### 18. Pick / pack checklist by order
Generated from the exact accepted order, with picked/packed confirmation and discrepancy handling.

### 19. Courier integration
Royal Mail label/tracking creation and status retrieval later, but keep explicit operator approval and never treat label generation as customer communication sent.

### 20. Dispatch manifest
Daily view of everything leaving, collection handovers, tracking presence and unresolved packing exceptions.

### 21. Returns / resend / damage case
A controlled after-sales exception record linked to the original order, stock adjustments and customer messages.

## Finance / management improvements

### 22. Margin and contribution reporting
Revenue, product cost, postage subsidy, support materials and gross contribution per order/customer/product. Keep supplier cost private and separate from public pricing authority.

### 23. Cashflow view
Expected incoming customer payments, supplier commitments, postage/operating outflows and short-term cash requirement.

### 24. KPI dashboard
Small useful set only: quote conversion, average time to quote, payment ageing, fulfilment time, stockout events, order value and gross contribution. Avoid decorative dashboard clutter.

### 25. Period close / export pack
Monthly export of orders, payments, stock movements, adjustments and audit events for bookkeeping/accountant use.

## Reliability / sellable-product improvements

### 26. Role-based permissions in the UI
Make admin/finance/fulfilment/viewer differences explicit in both UI and backend permissions. Hide actions a user cannot perform rather than letting them fail late.

### 27. Record-level conflict centre
If two devices edit the same record or sync fails, show a clear comparison/resolution flow rather than only an error toast.

### 28. Offline queue / sync status centre
Central place showing local-only changes, failed backups, retry state and last successful sync per device/user.

### 29. Health / diagnostics panel
Supabase connectivity, auth, last request sync, last order sync, realtime state, version/fingerprint and storage health in one support view.

### 30. Feature flags / staged rollout
Allow new modules to be enabled for owner only, then Jade, then wider users without maintaining duplicate app copies.

### 31. Data import / migration wizard
Validated import with preview, duplicate detection, rollback and mapping for customers, orders, stock and suppliers. Essential if Finance ever becomes a product for other businesses.

### 32. Data retention / privacy tools
Customer export, archive/retention rules, deletion workflow where legally appropriate, audit protection and clear separation between operational history and removable data.

### 33. Disaster-recovery drill
Not just backup export: documented restore test, recovery point, verification and periodic proof that backups can actually rebuild the workspace.

### 34. Training / sandbox mode
A clearly isolated practice workspace for new operators that cannot touch live customer, stock or shared production records.

### 35. In-app release notes / version fingerprint
Small operator-facing “what changed” view tied to the deployed version so Jade/owner know when behaviour changed and support can identify the exact build.

## Productisation / future sellability

### 36. Organisation / tenant separation
If sold to others: each business has isolated users, customers, inventory, suppliers, pricing authority and branding.

### 37. Configurable workflow policy
Allow a future customer organisation to configure stages, payment rules, fulfilment methods and alerts without forking code.

### 38. Setup wizard
Products, stock, users, roles, postage, messages, suppliers and starting balances with validation before first live order.

### 39. Integration layer / webhooks
Stable event model for request received, quote accepted, payment recorded, stock low, dispatched, etc., so external services integrate without embedding business logic into the UI.

### 40. Support diagnostics package
One-click non-sensitive support bundle containing version, failing operation, sync state and technical logs without customer secrets.

## Prioritisation rule

When the controlling completion register is complete, score enhancements by:

1. **Risk reduction** — prevents lost orders, stock mistakes, wrong customer messages or data loss.
2. **Operator time saved** — removes repeated manual entry/clicking.
3. **Revenue/cash impact** — improves conversion, payment speed, stock availability or margin visibility.
4. **Scale/sellability** — makes the system usable by more operators or other businesses.
5. **Complexity / dependency cost** — prefer high-value changes that do not create fragile integration overhead.
