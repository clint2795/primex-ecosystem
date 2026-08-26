# PrimeX Finance HQ Completion Register

**Authority ID:** `PX-FINANCE-COMPLETION-2026-08-26`  
**Status:** APPROVED controlling work register  
**Owner:** PrimeX owner/operator  
**Technical record:** `finance/FINANCE_HQ_BUILD_CONTROL_LOG.md`  
**Current protected checkpoint:** `PX-ROUTE-R5F` / publication record commit `cc2b77c6c483e13d1a20acc01047af63a28d81cb`
**Current protected review route:** `https://portal.primexbiolabs.co.uk/finance-completion-review/`
**Live Finance:** remains separate and must not be replaced until the cutover gate passes.

## Purpose

Finish Finance HQ as a dependable owner-and-Jade operating system, not a collection of individually working screens. This register is the single ordered queue for remaining Finance work. Chat suggestions and isolated review builds do not supersede it unless an approved decision is recorded here.

## Completion rule

Finance is not complete because code parses or one route works. It is complete only when a realistic request can enter, become a truthful quote, be sent through the correct channel, become an agreed order, reserve/deduct stock correctly, surface every required follow-up, complete fulfilment, and remain understandable on owner and Jade devices without hidden steps.

Every work unit must:

1. Start from the latest accepted checkpoint and record its rollback point.
2. Search the whole affected app for sibling occurrences before editing.
3. Preserve approved commercial data, customer-message authority, product codes and unrelated behaviour.
4. Pass technical regression checks and the relevant human operator scenario.
5. Be added to this register and the build log before the next work unit starts.
6. Stay on a protected review route until owner approval explicitly authorises live replacement.

## State definitions

- `COMPLETE / EVIDENCED` — implemented and backed by recorded checks.
- `READY` — approved scope whose dependencies are satisfied.
- `BLOCKED` — cannot be completed truthfully until the named dependency or decision exists.
- `LATER / SEPARATE` — retained so it is not forgotten, but it must not interrupt the current completion path.

## Completed foundation — do not repeat

| Work unit | State | Accepted outcome |
|---|---|---|
| R5 core reliability | COMPLETE / EVIDENCED | Deadlines, postage decisions, local-save fallback, backup retry and task priority controls. |
| R5A shared archive | COMPLETE / EVIDENCED | Recoverable shared request archive plus clearly separate device-only bin. |
| R5B email quote route | COMPLETE / EVIDENCED | Email enquiry can become a quote with deliberate email/WhatsApp/copy handoff. |
| R5C message authority | COMPLETE / EVIDENCED | Stale or wrong-direction messages are blocked; first quote carries known availability and timing. |
| R5D operational truth | COMPLETE / EVIDENCED | Test isolation, quantity-aware stock, local reservation and stage-specific follow-up truth. |
| R5E request resolution | COMPLETE / EVIDENCED | Custom requests have real resolution actions; stock result and test paths are discoverable. |

These checks must be reused as regressions. Do not commission another broad technical audit that simply repeats them.

## Ordered completion queue

### 1. R5F — Combined protected candidate

**State:** COMPLETE / EVIDENCED — PROTECTED ROUTE PUBLISHED
**Job:** Build one protected candidate containing the accepted R5A–R5E behaviour. The owner must no longer need to switch between isolated review routes to understand the current system.

**Must prove:**

- all R5A–R5E controls coexist without regression;
- the visible version marker and source checkpoint identify the exact candidate;
- current commercial authority is loaded rather than copied from an older review;
- live `/finance/`, the protocol route and public customer routes remain untouched.

**Evidence:** `scripts/verify-finance-combined-candidate.mjs` proves the R5F artifact is identical to the cumulative R5E source except for its route-safe config path and visible fingerprint. Commercial-authority, operational-truth, message-authority, workflow-reliability, message-direction and email-only regressions also pass. Protected route `https://portal.primexbiolabs.co.uk/finance-completion-review/` serves SHA-256 `9973f42066c7ba354f40a5b0dcdf1c0a16fa8f8bd27c97e64aba22478c7aecb9` from publication commit `af3b96e16a13968c48554002d429f79851adb3f9`; live `/finance/` remains `v45G JS OK`.

### 2. R5G — Operator layout and mobile control pass

**State:** CORRECTED PROTECTED ROUTE PUBLISHED / HASH VERIFIED — owner-phone and Jade-sized review pending
**Job:** Correct the app-wide human-use problems already observed without redesigning commercial or workflow logic.

**Required outcomes:**

- readable mobile type, labels and status text; practical tap targets;
- highest-value status and next action appear before explanation or secondary controls;
- Start/Mission Control uses compact, prioritised information rather than oversized summary boxes;
- Workflow distinguishes the active record from stage filters and does not make headings look like workflow steps;
- multi-order views remain visibly separated and scannable;
- Requests retains R5E actions without ugly warning pills, duplicate descriptions or dead controls;
- Stock becomes a manageable working view: search/filter first, urgent exceptions before the full catalogue, dense item rows, and secondary setup/adjustment tools collapsed appropriately;
- app-wide box radius, nesting, whitespace and card height follow one restrained Finance pattern;
- fixed navigation does not cover actions or meaningful content;
- desktop width is used for control and comparison, not empty filler.

**Acceptance viewports:** owner desktop, owner phone portrait, and a Jade-sized phone portrait. Each key task must be usable without browser zoom.

**Implementation evidence:** `finance-operator-layout-review/index.html` starts from the exact R5F protected artifact. Its R5G authority raises mobile body/control sizing, reduces card radius and nesting, widens useful desktop space, compacts Start priorities, separates Workflow records from filters, tightens Request records, and places Stock search/overview before collapsed receive/adjust operations. The approved mobile correction additionally compacts the operator header, removes the phone breadcrumb, separates every Start action and Workflow/History record, prevents squeezed one-word wrapping, replaces the unstyled oversized action with the Finance control pattern and restores regular body/status weight. `scripts/verify-finance-operator-layout.mjs` parses the candidate JavaScript, proves application-logic parity with R5F and now asserts those shared mobile controls. All existing R5 commercial, message, operational-truth, workflow and message-direction regressions pass. Previous hosted rollback remains SHA-256 `a322292cfe572d34b05c278337cf307a29c77ede5346738f4c8415ffcc50873d` from publication commit `a47a99f8d3a95602305f27e2efe7ba1a86aa186d`. Corrected protected publication commit `559546447fe159da972480018ddecf5527c4aea8` serves SHA-256 `41b5b00a6f86ca11497502bcbca666d8836282724f58b3195edfb1b6e9fb244c`, exactly matching the approved local source. Owner-phone and Jade-sized review remain required before this work unit can become `COMPLETE / EVIDENCED`.

### 3. R5H — Complete operator-journey acceptance

**State:** BLOCKED until R5G passes  
**Job:** Test the combined candidate as an operator would use it, including waiting and failure states. This is missing validation, not a repeat of the completed audits.

**Scenario set:**

- emailed Early Access enquiry to quote;
- known structured request to quote;
- unmapped/custom request resolution;
- fully covered, partly covered and unavailable stock;
- exact dispatch known and timing still being confirmed with a dated update promise;
- quote generation, actual outbound body, channel handoff and mark-sent state;
- customer acceptance, accepted-total lock and conversion to live order;
- payment requested, payment recorded and any manual reconciliation step;
- preparation, packing, collection/dispatch and tracking follow-up;
- cancellation, archive, restore, test cleanup and historical record handling;
- reload, device-local save, failed online backup, retry, authenticated shared sync and conflict behaviour;
- owner-versus-Jade visibility and permissions;
- empty queues, multiple concurrent orders, overdue actions and error recovery.

**Pass condition:** every action has a clear result; every waiting promise has an owner and date; no customer message requires an unrecorded follow-up; no task disappears between screens; actual generated customer output is reviewed independently from its operator screen.

### 4. R5I — Stock operations and replenishment

**State:** BLOCKED pending R5H findings and supplier-order decisions  
**Job:** Complete the operational route from stock level to replenishment rather than treating a stock check as a supplier order.

**Required outcomes:**

- current available stock is visible wherever a quote/request decision needs it;
- low-stock alerts replace irrelevant calendar-style weekly stock reminders;
- reorder level, target level, active/inactive stocking and supplier ordering are distinct concepts;
- stock shortage can create or link a replenishment task from Stock without silently creating an order;
- supplier timing, order deadline, expected receipt and customer commitments remain linked;
- priority changes retain a visible reason;
- received stock, batch/lot, COA state, damage/correction and audit history are usable and testable;
- BAC/support stock is handled separately from compound stock where appropriate.

**Unknown/decision required before implementation:** supplier-order data model, approved suppliers, who can approve a supplier order, and whether Finance records payment/reconciliation or links to a separate purchasing record.

### 5. R5J — Alerts, ownership and handoff

**State:** BLOCKED pending R5H/R5I and delivery-platform decision  
**Job:** Ensure work reaches the right person and device without creating alert fatigue.

**Required outcomes:**

- Start is the authoritative in-app action queue;
- only actionable low stock, dated customer promises, failed backups, payment/fulfilment steps and other genuine exceptions alert externally;
- alerts state the order/request, required action, owner, deadline and reason for priority;
- owner can pass an alert/task to Jade deliberately, with acknowledgement and ownership visible;
- no recurring reminder exists solely because it was once scheduled;
- phone/watch delivery is added only after the channel, cost and permissions are approved.

**Unknown/decision required:** what Jade receives initially, which connected task/notification platform is used, and which events justify phone/watch interruption.

### 6. Protocol module completion and integration

**State:** LATER / SEPARATE until core Finance R5H passes  
**Job:** Finish the protected protocol tool and integrate it without contaminating customer quote output or destabilising Finance.

**Required outcomes already approved or identified:**

- compact protocol dropdown rather than multiple cards across the top;
- approved family colours remain semantic on compound markers/lines;
- clear range control, quantities, duration, BAC allowance and stock availability;
- separate operator planning, research record and factual customer quote outputs;
- verified source figures replace provisional or wrongly attributed measurements;
- mobile-readable layout, restrained boxes and no repeated internal compliance prose;
- protocol stock check links to Stock for replenishment work but does not create a supplier order itself;
- Finance pricing resolves from current commercial authority and is never embedded independently.

**Unknown/decision required:** remaining source verification, next protocol priority after arthritis, and final integration route.

### 7. Data cleanup and live cutover

**State:** BLOCKED until R5F–R5H pass and material R5I dependencies are resolved  
**Job:** Move from protected review to the real shared operating system without carrying test clutter or stale authority into live work.

**Required outcomes:**

- classify and clean test, duplicate, historical, parked and genuine records without deleting recoverable customer history;
- verify current product/pricing authority, stock opening balances and user permissions;
- export a rollback backup;
- run the agreed desktop/mobile smoke test against the exact release candidate;
- owner approves the visible candidate and actual customer messages;
- publish the exact approved fingerprint to `/finance/`;
- verify hosted checksum, login, shared sync and one controlled non-customer test journey;
- record rollback procedure and first-live monitoring window.

### 8. Public intake restoration

**State:** LATER / SEPARATE until live Finance proves stable  
**Job:** Decide whether the current Early Access email-only route should remain or structured submission can safely return.

**Required outcomes:** no request can be lost silently; customer sees one clear submission route; inbound email has no outbound-customer footer; duplicate protection and Finance arrival are proven; fallback is explicit and tested.

The permanent website remains a separate project and is not authorised by this register.

## Cross-cutting locked controls

- Use the current approved commercial authority; do not rely on prices copied into old builds or chat.
- Keep internal operator copy, customer/public copy and exported/copyable output separate.
- Do not expose internal strategy, source warnings or supplier planning in customer messages.
- Do not create a customer promise without a surfaced dated follow-up.
- Do not auto-send email or WhatsApp or mark anything sent merely because a message was generated.
- Do not change product codes, stock quantities, deduction rules, Supabase schema/RLS, protocols, Early Access or the permanent website incidentally.
- Do not use arbitrary family colours or decorative status badges.
- Do not restart completed audits; extend the existing regression suite only for newly found machine-detectable failures.

## Recurring-mistake ratchet

| Failure class | Permanent control |
|---|---|
| Completed work proposed again | Check this register and the build log before proposing work; cite the next incomplete work unit. |
| One task described as the whole remaining job | State its work-unit ID and dependencies; never call Finance complete before the cutover gate. |
| User discovers sibling UI/copy faults manually | Run an app-wide same-pattern sweep and a human-result test before handoff. |
| Technically valid but unusable control | Acceptance must show purpose, action and visible result using a realistic operator scenario. |
| Review artifact cannot be accessed | Publish only to a protected isolated route under the standing implementation approval; never ask the owner to review an inaccessible local file. |
| Old values leak from historical builds | Resolve every stale fact against its current authority before implementation or testing. |

## Progress protocol

At the start of each Finance turn:

1. Read this register and the latest build-log entry.
2. Name the current work-unit ID only.
3. Confirm its accepted source and rollback point.
4. Continue that unit until its acceptance tests are recorded.
5. Update the state here before proposing the next unit.

If a new defect is found during owner review, record it under the active work unit or its correct later dependency. Do not abandon the active unit, silently expand scope, or lose the defect in chat.
