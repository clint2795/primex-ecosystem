# PrimeX Finance HQ — R5H Batch 4 Evidence

**Work unit:** `R5H — Complete operator-journey acceptance`  
**Authority:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md` / `PX-FINANCE-COMPLETION-2026-08-26`  
**Protected route:** `https://portal.primexbiolabs.co.uk/finance-operator-layout-review/`  
**Live `/finance/`:** LOCKED / untouched  
**Pre-Batch-4 main checkpoint:** `8c33543f0015d7855c1741dda5645bf6e7bc3561`

## Approved Batch 4 scope

- long-edit / shared claim-lease behaviour;
- multiple-record / empty / overdue-state machine checks;
- customer-message promise truth discovered during the outbound-body audit.

## Defects confirmed

1. Shared record claims use a deployed 10-minute lease, but the protected Finance UI had no renewal heartbeat. A long edit could therefore continue showing `Editing` after the database lease had expired and become claimable by another operator.
2. The Payment Request told the customer that payment instructions would be issued separately, but Finance had no recorded owner/date/completion state for that promised follow-up.
3. Carrier handover messages without tracking said PrimeX would share tracking later if it became available, creating an unnecessary future promise after the final handover update could already be considered complete.

## Implemented

- Added protected `r5h-batch4.js` and sequenced it after Batch 3.
- Added a four-minute heartbeat for the deployed ten-minute `claim_quote_order` lease.
- Heartbeat renews again when the tab becomes visible or the window regains focus.
- Successful renewal updates local claim expiry and row-version metadata so later optimistic saves use the current database version.
- A genuinely lost lease makes the open shared record read-only and surfaces a clear recovery warning; local unsynced changes remain preserved by the existing Batch 3 conflict protections.
- Network/auth/RPC renewal failure is described as a shared-connection problem rather than falsely claiming another operator owns the record.
- Added payment-instruction follow-up evidence to the existing payload: status, due-at, owner and sent-at.
- Payment Request generation now requires a future deadline and an active Finance operator to own the promised follow-up.
- The customer Payment Request includes that recorded deadline in the actual message wording.
- Once the Payment Request is marked sent, Finance exposes a Communication Centre task and Start/priority alert until the separate payment instructions are marked sent.
- Due/overdue payment-instruction alerts include the order, owner and deadline.
- Carrier handover updates without tracking now state the current fact (`No tracking/reference is available at the time of this update.`) instead of promising a later optional tracking message.

## Multiple-record / empty / overdue machine checks

The Batch 4 regression also ratchets the accepted source behaviour that:

- `queueData()` derives the active Workflow records by stage;
- Workflow retains a clear all-empty state;
- dated customer availability promises retain overdue alerts;
- action alerts sort by severity first and deadline second.

No new defect was found in those static invariants during Batch 4.

## Files changed

- `finance-operator-layout-review/r5h-batch1.js` — protected Batch 4 loader only.
- `finance-operator-layout-review/r5h-batch4.js` — Batch 4 protected logic.
- `finance/tests/r5h_batch4_lease_message_truth_regression.js` — focused regression.
- this evidence record.

No `finance/index.html`, live `/finance/`, Supabase schema/RLS, commercial authority, product codes, stock calculations, protocol route or public intake route changed.

## CI evidence

Initial Batch 4 CI run `33249273411`:
- Batch 1 verifier: PASS
- Batch 2 regression: PASS
- Batch 3 regression: PASS
- Batch 4 regression: FAIL because the test looked for a rigid literal `title:` form while the implementation correctly selected `Payment instructions overdue` through a ternary expression.

The test assertion was corrected without changing application behaviour.

Final Batch 4 checkpoint: `ebbf18a4d083148778949b52eb410ca1c5f4eb1c`.

Final Finance regression CI run: `33249302573` / job `99092081063`.

Result: **SUCCESS**.

Passed:
- R5H Batch 1 verifier;
- all committed `finance/tests/r5h*_regression.js`, including Batch 2, Batch 3 and Batch 4.

## Remaining R5H evidence

R5H remains open. Principal remaining proof is human/hosted behaviour rather than another broad code audit:

- hosted protected-route delivery of the Batch 1–4 patch chain;
- one realistic local-save / retry / reload journey;
- one genuine Clint-vs-Jade shared-claim/read-only journey;
- independent review of actual generated customer bodies from representative quote/payment/availability/preparation/packed/collection/dispatch/tracking records;
- final owner/Jade operator acceptance.
