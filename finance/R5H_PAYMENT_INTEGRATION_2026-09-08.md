# R5H — Customer Job / Payment integration

Date: 2026-09-08
Status: IMPLEMENTED / CI VERIFIED / OWNER REVIEW PENDING
Work unit: R5H operator-journey acceptance. This does not close R5H or authorise live cutover.

## Source and rollback

- Starting commit: `6cc7bfda79bf61570fc02a3195fec4c32403c6a7`.
- Previous Customer Job proof blob: `7e2cc4d959042fe5b83550fb6ff97394f6161e8c`.
- Existing standalone Payment proof preserved as a rollback/reference.
- Integration branch: `review/r5h-payment-integration`.
- Review route after protected publication: `/finance-operator-v2-job-ready-quote-proof/#payment`.
- Live `/finance/`, existing hardened Finance services, commercial authority, stock, Supabase, message output and public routes are excluded.

## Implemented

The existing Customer Job route now owns the Payment task. It retains customer identity, a six-stage lifecycle and specialist work below the current stage. The Payment module is local-only and keeps customer claims, pending bank evidence, verified receipts and final reconciliation separate. It includes partial payments, duplicate reference and overpayment guards, rejection reasons, evidence history and scenario fixtures. The working area uses the money-first hierarchy and does not repeat the entire customer record.

Review controls are collapsed outside the customer record. Strong section emphasis is the owner's working preference. Minimal/Balanced/Strong and System/Dark/Light are saved independently using the existing local preference keys. The provisional light orange-red and dark burnt-orange checkpoints are retained without declaring final palette approval. Green is reserved for genuinely completed states; neutral sections do not imply completion.

The Payment module emits an explicit read-only summary to the parent workspace. A reconciled payment can expose the next Fulfilment review; merely reporting payment, saving evidence or reaching the accepted total without final reconciliation cannot. Fulfilment and Complete remain labelled demonstration fixtures, not implemented live workflows.

## Automated evidence

GitHub Actions workflow `finance-v2-payment-integration.yml`, run `34261787789`, completed successfully on `d4e6c1be14faa3801ade3e749b261ad0e2e4779f`. All payment interaction regressions and route/module boundary checks passed. The tests cover claims, pending evidence, independent confirmation, partial payments, duplicate references, overpayment, rejection reasons, final reconciliation and fixture reset.

This is Node-based interaction evidence with a minimal DOM harness, not a real-browser or production-service test. Owner desktop and phone review, actual rendered overflow checks, production adapter verification and the full R5H journey remain outstanding. No bank connection or paid integration is included.

## Next acceptance gate

Review the integrated route on the owner's phone and desktop. Correct genuine usability defects, then connect the accepted UI to the existing hardened Finance payment authority on an isolated candidate. Reuse its evidence, permissions, accepted-total and order-transition controls instead of promoting the local demo ledger as a production engine. Only then continue the remaining R5H fulfilment and end-to-end scenarios. R5I and R5J remain under the controlling completion register.
