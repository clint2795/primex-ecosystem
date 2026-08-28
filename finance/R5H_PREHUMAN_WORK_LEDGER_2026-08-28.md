# PrimeX Finance HQ — R5H Pre-Human Completion Ledger

**Date:** 2026-08-28  
**Controlling register:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md`  
**Accepted checkpoint:** `PX-ROUTE-R5G` / `ee2929df244a1ca6e0226ee638285671e4ccf0af`  
**Protected review route:** `https://portal.primexbiolabs.co.uk/finance-operator-layout-review/`  
**Live `/finance/`:** locked / untouched until cutover gate passes.

## Purpose

Prevent R5H from becoming one-by-one owner ping-pong. Exhaust all machine-checkable, code-inspectable and fixable Finance work before asking the owner or Jade to perform another manual journey.

## Working rule

Do not ask the owner to manually test a path merely because it exists in the R5H scenario list. First inspect the complete affected path, run existing regressions, add focused checks for any newly discovered failure class, and fix all determinable defects on the protected candidate. Human/device testing comes only after the pre-human sweep is exhausted.

## FIX NOW / INSPECT WITHOUT OWNER

### R5H — complete operator journey pre-human sweep

Inspect and prove the full path for:

- emailed Early Access enquiry -> quote;
- known structured request -> quote;
- unmapped/custom request -> resolution -> quote;
- fully covered stock;
- partly covered stock;
- unavailable stock;
- exact dispatch known;
- dispatch timing unconfirmed with dated customer-update promise;
- quote generation and exact outbound body;
- email / WhatsApp / copy handoff availability and no automatic send;
- mark-sent state and stale-message invalidation;
- customer acceptance;
- accepted-total lock;
- quote -> live-order conversion;
- payment requested;
- payment recorded;
- manual reconciliation state if present;
- preparation;
- packing;
- collection;
- dispatch;
- tracking follow-up;
- cancellation;
- archive;
- restore;
- test cleanup;
- historical records;
- reload and device-local persistence;
- failed online backup;
- retry;
- authenticated shared sync;
- conflict/reconciliation behaviour;
- owner-versus-Jade visibility/permissions as far as code/RLS allows;
- empty queues;
- multiple concurrent orders;
- overdue actions;
- error recovery;
- no task disappearing between screens;
- every waiting promise having an owner/date or an explicit blocker.

### R5I — stock/replenishment items that can be inspected before supplier decisions

Inspect current implementation for:

- available stock visibility at request/quote decision points;
- low-stock alert truth;
- reorder level vs target level vs active/inactive stocking separation;
- received stock flow;
- batch/lot and COA-state fields/paths already present;
- damage/correction and stock-movement history;
- BAC/support stock treatment versus compound stock;
- any hidden assumption that a stock check creates a supplier order.

Do not invent supplier-order architecture while the decision items below remain unresolved.

### R5J — alert/ownership items that can be inspected before platform decisions

Inspect current implementation for:

- Start as the authoritative in-app action queue;
- actionable exceptions only;
- alert contents: record, action, reason, deadline where applicable;
- any stale recurring reminder logic that survives without operational reason;
- current ownership/handoff fields if any;
- missing ownership visibility that can be fixed without selecting an external notification platform.

### Cross-cutting regression / authority sweep

Re-run and extend only where needed:

- Finance JavaScript parsing;
- R5 operator-layout regression;
- combined-candidate equality/authority checks;
- commercial authority;
- message authority;
- operational truth;
- workflow reliability;
- message direction;
- email-only handoff / no auto-send;
- request-resolution behaviour;
- stock deduction guards;
- accepted-total lock;
- local-save / online-backup fallback;
- shared archive / restore;
- authenticated Supabase read/write guards;
- no live `/finance/` modification.

## NEEDS DECISION — DO NOT GUESS

These are not implementation blockers for the pre-human sweep, but must not be silently invented:

### R5I supplier-order decisions

- supplier-order data model;
- approved supplier records;
- who can approve a supplier order;
- whether Finance owns supplier payment/reconciliation or links to a separate purchasing record;
- supplier timing/order-deadline/expected-receipt ownership model where not already represented.

### R5J delivery/notification decisions

- what Jade receives initially;
- external notification/task platform;
- which events justify phone/watch interruption;
- acknowledgement/handoff behaviour outside Finance.

### Protocol integration decisions

- remaining source verification;
- next protocol priority after arthritis;
- final integration route into Finance.

## HUMAN-ONLY — DEFER UNTIL PRE-HUMAN SWEEP IS CLEAN

Only after code/regression/authority work is exhausted:

- final owner end-to-end operator journey on protected candidate;
- final Jade shared-account visibility/permission journey where authentication state matters;
- actual device email/WhatsApp handoff boundary;
- physical browser/download confirmation for backup export if not automatable;
- final desktop/mobile smoke test of the exact release candidate;
- owner approval of actual generated customer messages and visible release candidate.

## LATER / SEPARATE — DO NOT LET THESE INTERRUPT R5H

- protocol module completion/integration until core Finance R5H passes;
- data cleanup and live cutover until R5H passes and material R5I dependencies are resolved;
- public structured intake restoration until live Finance proves stable;
- permanent website work remains separate.

## Exit condition for pre-human sweep

Do not return to the owner for another manual test until:

1. every FIX NOW path above is inspected;
2. all determinable defects are fixed on the protected candidate or explicitly recorded as later-scope/decision-dependent;
3. focused regressions pass;
4. one consolidated findings report exists with PASS / FIXED / NEEDS DECISION / HUMAN-ONLY;
5. the remaining human test list is short and unavoidable.
