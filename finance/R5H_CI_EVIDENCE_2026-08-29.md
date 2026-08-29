# PrimeX Finance HQ — R5H CI Evidence

**Date:** 2026-08-29  
**Work unit:** `R5H — Complete operator-journey acceptance`  
**Controlling register:** `finance/FINANCE_HQ_COMPLETION_REGISTER.md`  
**Live `/finance/`:** untouched

## Finance regression CI

Workflow: `.github/workflows/finance-regression.yml`

Initial CI commit: `06784980d3475eacce09d2f33cfc46a9b386f6ad`

Future-proof CI commit: `8299b800bcbe29e059546af9e2ef0f940e332bd9`

The workflow runs on Finance-related pushes and pull requests to `main`, and can also be started manually. It uses Node 22 and has read-only repository permissions.

The workflow now executes:

1. `scripts/verify-finance-r5h-batch1.mjs`
2. every file matching `finance/tests/r5h*_regression.js`

This means later R5H regression files are picked up automatically without editing the workflow for each batch.

## Executed evidence

GitHub Actions run: `33248873355`

Job: `Finance regressions` / job id `99090964262`

Result: **SUCCESS**

Executed steps:

- Checkout repository — PASS
- Use Node.js — PASS
- Run R5H Batch 1 verifier — PASS
- Run all R5H regressions — PASS
- Job completion — PASS

At the time of this run, the automatic R5H set contained the committed Batch 2 and Batch 3 regression files, so the successful run establishes executable PASS evidence for R5H Batches 1, 2 and 3 on the exact committed `main` source.

## Control meaning

This removes the previous limitation where Batch 2/3 regressions were only source-inspected because the local execution container could not reach GitHub. GitHub Actions is now the execution authority for committed Finance regression tests.

The CI addition changes no Finance application logic, pricing, stock calculations, customer messaging, Supabase schema/RLS, protocol behaviour or live `/finance/` route.
