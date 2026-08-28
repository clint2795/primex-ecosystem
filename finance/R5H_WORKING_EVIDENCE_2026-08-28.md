# PrimeX Finance HQ — R5H Working Evidence

**Work unit:** `R5H — Complete operator-journey acceptance`  
**Authority:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md` / `PX-FINANCE-COMPLETION-2026-08-26`  
**Protected review route:** `https://portal.primexbiolabs.co.uk/finance-operator-layout-review/`  
**Live `/finance/`:** LOCKED / untouched by R5H batches 1–2  
**R5G rollback / accepted UI checkpoint:** `ee2929df244a1ca6e0226ee638285671e4ccf0af`  
**R5H current main checkpoint after Batch 2:** `0c2bbd73b6476c3a2fcad58ea11081d2182bb56a`

> This is a working evidence record inside the active R5H work unit. It does not replace the Completion Register. R5H remains open until the full scenario set and human operator acceptance are complete.

## Batch 1 — lifecycle truth

**Approved purpose:** repair lifecycle/evidence defects found during the first R5H operator-journey inspection without changing live Finance.

**Commits:**
- `f878b952a4700e78c5345aef3e42a01d97f54af2` — Add R5H batch 1 lifecycle guards.
- `5f16ea4dec1513bcb922872676e7dea9e7c50c8e` — Load protected R5H batch 1 lifecycle patch.
- `067d6cbd6d8dd335d29fa34da8a2497ef632f8e1` — Add R5H batch 1 lifecycle regression.
- `93ca9f04cd9138f9b0c273949c255ee5c2886aba` — Remove duplicate R5H work ledger so the Completion Register remains the single controlling queue.

**Implemented:**
- Workflow/History quote acceptance now routes through the accepted-total lock rather than raw quote-status mutation.
- Quote cancellation records truthful quote and order cancellation state and persists through the normal save path.
- Live cancellation/void actions mark the record for retryable shared online backup rather than leaving an undisclosed device-only state.
- Protected quote cancellation controls use quote-specific wording and hide the inappropriate archive action.

**Evidence obtained:**
- Focused Batch 1 lifecycle harness passed acceptance-lock routing, quote-cancellation persistence and live-cancellation online-backup triggering.
- Protected route guard retained; live `/finance/` excluded.

## Batch 2 — payment, operator accountability and handover truth

**Approved purpose:** make payment/release evidence, final customer handover communication and History bin/restore state truthful and durable across operators.

**Commits:**
- `afef9135bcd5eb978517c2518829a77a1227d5d1` — R5H Batch 2 operator truth and handover guards.
- `b46f58b7e8ec3b108e71adb8cfb831de620bbe5c` — Load protected R5H Batch 2 after Batch 1.
- `d2ab1cf76ab2152566f46a7f310263c5eb1b6a4f` — Harden payment and handover invariants.
- `0c2bbd73b6476c3a2fcad58ea11081d2182bb56a` — Add focused Batch 2 regression guard and become the Batch 2 main checkpoint.

**Files changed from the pre-Batch-2 main checkpoint:**
- `finance-operator-layout-review/r5h-batch1.js` — protected Batch 2 loader only.
- `finance-operator-layout-review/r5h-batch2.js` — protected R5H logic patch.
- `finance/tests/r5h_batch2_regression.js` — focused machine-detectable regression guard.

No `finance/index.html`, live route source, pricing/commercial authority, product code, stock calculation, protocol, customer intake route, Supabase schema or RLS file changed.

**Implemented:**
- Added factual payment evidence in the existing shared JSON payload: amount received, received timestamp, optional reference, recorded-by operator and reconciliation note.
- `Paid` and `Part paid` now require consistent evidence; `Paid` cannot record less than the order total and `Part paid` cannot equal/exceed it.
- Queue `Mark paid` records the authenticated Finance operator, amount and timestamp before progressing the payment lifecycle.
- Unpaid preparation/release can no longer silently self-authorise as generic `Manual override`; an active authenticated operator and explicit reason are required.
- Final handover messages are route-truthful: customer collection, local drop-off, Royal Mail collection/postage and courier handover no longer collapse into one inaccurate dispatch message.
- Carrier dispatch can produce/send the final handover update even when a tracking reference is not yet available.
- Post-handover required communication uses one final handover/tracking state and `Mark complete` is blocked until that required customer update is recorded as sent/already sent.
- Live-order communication sent states persist locally and attempt the existing shared online backup immediately rather than relying on a later remembered Save.
- Cloud-backed order Bin and Restore actions now attempt the existing shared backup so owner/Jade History does not knowingly diverge after refresh.

**Supabase evidence checked read-only:**
- Clint profile: active `admin`.
- Jade profile: active `finance`.
- Both roles are write-enabled by the current RLS model.
- Deployed `quotes_orders` has `payment_status` but no dedicated payment amount/date/reference columns; additive Batch 2 evidence is therefore stored in the existing `payload` JSONB without a schema migration.
- Deployed `claim_quote_order` and `release_quote_order_claim` functions exist.

**Verification obtained:**
- Branch diff before merge was limited to the three protected/test files above.
- Main was fast-forwarded, not force-updated, to `0c2bbd73b6476c3a2fcad58ea11081d2182bb56a`.
- Main source fetch confirmed `finance-operator-layout-review/r5h-batch2.js` with the protected-route guard intact; blob SHA `9bc8540a3bbb4b08cdf40c1a9ad945c1aafd81a0`.
- `finance/tests/r5h_batch2_regression.js` was added to detect reintroduction of payment-evidence, anonymous-override, handover-wording, completion-gate and local-only bin/restore failures.

**Verification limitation:**
- The Batch 2 Node regression file has been source-inspected but was not executed by the available connector environment. Do not record it as an executed pass until it is run in an execution-capable environment.
- GitHub source on `main` is confirmed; hosted custom-domain delivery of the new Batch 2 JS still requires a served-route check or operator refresh confirmation.

## R5H remaining scenario groups

The controlling Completion Register remains authoritative. After Batches 1–2, the principal unresolved R5H evidence groups are:

1. **Reload / backup / retry / shared conflict:** prove local-save survival, failed online backup visibility, retry, optimistic row-version conflict handling and claim behaviour using realistic operator states.
2. **Owner/Jade concurrency:** prove one operator sees shared changes, an active edit conflict cannot silently overwrite newer work, and lock/claim errors are described truthfully.
3. **Claim lease behaviour:** current deployed claim lease defaults to 10 minutes; determine whether long-running edits require renewal or whether the stale-save conflict path is sufficient and understandable.
4. **Multiple concurrent records / empty states / overdue work:** prove active work does not disappear or merge visually/logically across queues and Start priorities.
5. **Actual outbound body review:** independently inspect generated quote, payment, availability, preparation, packed, collection/drop-off/dispatch and tracking bodies against the underlying record state.
6. **Human operator acceptance:** final owner and Jade realistic journeys on the protected route after the machine-detectable defects are closed.

## Current state

- R5H: **IN PROGRESS**.
- Batches 1–2: implemented on protected route and recorded above.
- Batch 3 or later code: **NOT APPROVED / NOT STARTED**.
- R5I and later work units: remain blocked/separate according to the Completion Register.
- Live `/finance/`: remains locked and unchanged.
