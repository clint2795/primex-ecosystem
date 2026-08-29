# PrimeX Finance HQ — R5H Working Evidence

**Work unit:** `R5H — Complete operator-journey acceptance`  
**Authority:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md` / `PX-FINANCE-COMPLETION-2026-08-26`  
**Protected review route:** `https://portal.primexbiolabs.co.uk/finance-operator-layout-review/`  
**Live `/finance/`:** LOCKED / untouched by R5H batches 1–3  
**R5G rollback / accepted UI checkpoint:** `ee2929df244a1ca6e0226ee638285671e4ccf0af`  
**R5H current main checkpoint after Batch 3:** `c0dff5cd0da9acc0dfb791bb8963b2026174a1e2`

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

## Batch 3 — shared reliability, refresh protection and conflict recovery

**Approved purpose:** make reload/shared-refresh, failed backup/retry and owner/Jade edit conflict behaviour truthful and non-destructive on the protected route.

**Commits:**
- `1eb9068fcf6d1039cb4eddf40c20deb819a8789b` — Add R5H Batch 3 shared reliability guards.
- `cb01e9c4da8b82d7c239367750fa487463e56e2f` — Load protected Batch 3 only after Batch 2 finishes loading.
- `c0dff5cd0da9acc0dfb791bb8963b2026174a1e2` — Add focused Batch 3 shared-reliability regression and become the Batch 3 main checkpoint.

**Files changed from the pre-Batch-3 main checkpoint:**
- `finance-operator-layout-review/r5h-batch1.js` — protected loader sequencing only.
- `finance-operator-layout-review/r5h-batch3.js` — protected shared-reliability patch.
- `finance/tests/r5h_batch3_shared_reliability_regression.js` — focused regression source.

No `finance/index.html`, live route, Supabase schema/RLS, commercial/pricing authority, stock calculations, protocol or public intake route changed.

**Defects confirmed before implementation:**
- The deployed claim RPC returns an empty result when another active operator owns the claim, but auth/network/RPC errors were also collapsed to `false`; `loadOrder()` therefore described infrastructure failure as “Another operator is currently working on this record”.
- `refreshCloudOrders()` replaced local cloud-backed records with the latest cloud snapshot and only preserved unsynced records that did not match a cloud id/ref. An unsynced edit to an existing cloud-backed record could therefore be overwritten in the browser workspace by manual, focus or realtime refresh before the failed backup was resolved.

**Implemented:**
- Shared claim acquisition now treats an empty RPC result as the genuine active-claim case and allows auth/network/RPC failures to surface as connection failures instead of impersonating an operator conflict.
- Failed shared edit-lock checks do not open the record for editing and show a truthful retry message.
- Before every shared-order refresh, unsynced cloud-backed local records are snapshotted. After refresh, their local copies are restored rather than silently discarded.
- If the refreshed remote row version differs from the preserved local version, the record is marked as an explicit shared conflict and the latest remote snapshot is held for recovery.
- Conflict UI states that the local unsynced copy was preserved and offers deliberate choices: keep the local copy for reconciliation, or explicitly load the latest shared version with a destructive confirmation.
- `Load shared version` replaces only the affected local record after explicit confirmation; it does not silently resolve or overwrite a conflict.
- Failed edit-lock release is surfaced as a non-fatal warning explaining that the server lease will expire automatically.
- Existing row-version guarded save logic remains the cloud-write authority; Batch 3 does not introduce a force-overwrite path.

**Verification obtained:**
- Branch was created from main checkpoint `e39aac69505c7bedae4189741557da18a345c19a` and remained fast-forwardable.
- Pre-merge compare showed exactly three changed files: protected loader, protected Batch 3 patch and focused regression source.
- Main was fast-forwarded, not force-updated, to `c0dff5cd0da9acc0dfb791bb8963b2026174a1e2`.
- `finance/tests/r5h_batch3_shared_reliability_regression.js` asserts the protected route guard, claim-error separation, pending-local preservation, row-version conflict surfacing, explicit shared-version recovery and lease-expiry warning.
- Deployed Supabase `claim_quote_order` / `release_quote_order_claim` functions were inspected read-only; no database change was made.

**Verification limitation:**
- The execution container has no outbound DNS/network path to GitHub, so the Batch 3 Node regression could not be executed from the branch checkout there. The source and branch diff were inspected, but the regression must not be recorded as an executed pass yet.
- Hosted custom-domain delivery of Batch 3 still requires a served-route/browser confirmation before final R5H human acceptance.

## R5H remaining scenario groups

The controlling Completion Register remains authoritative. After Batches 1–3, the principal unresolved R5H evidence groups are:

1. **Claim lease / long edit behaviour:** determine whether the 10-minute lease needs renewal during long edits or whether stale-save detection plus explicit recovery is sufficient for normal Clint/Jade use.
2. **Multiple concurrent records / empty states / overdue work:** prove active work does not disappear, merge or lose priority across Start and Workflow when several orders/quotes exist.
3. **Actual outbound body review:** independently inspect generated quote, payment, availability, preparation, packed, collection/drop-off/dispatch and tracking bodies against underlying record state.
4. **Reload / retry human proof:** exercise a real protected-route local save, failed/paused shared backup state, reload, retry and shared refresh without using customer data.
5. **Owner/Jade concurrency human proof:** prove a genuine second-operator claim becomes read-only while connection failure is described differently.
6. **Human operator acceptance:** final owner and Jade realistic journeys on the protected route after machine-detectable defects are closed.

## Current state

- R5H: **IN PROGRESS**.
- Batches 1–3: implemented on protected route and recorded above.
- Further R5H code: **NOT APPROVED / NOT STARTED** until the next bounded batch is proposed/approved.
- R5I and later work units: remain blocked/separate according to the Completion Register.
- Live `/finance/`: remains locked and unchanged.
