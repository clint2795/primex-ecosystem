# PrimeX Planner Build Control Log

## v185A — Customer Route Stabilization (STAGING / NOT LIVE)

- Date: 2026-08-13.
- Version: `v185A`.
- Branch: `fix/customer-route-v185A`.
- Draft PR: `#1` — Customer route stabilization v185A.
- Status: staging only; not merged to `main`; no Supabase Edge Function deployment performed.
- Single purpose: preserve the existing physical QR destination while making the temporary customer route useful, compact and resistant to accidental duplicate requests.
- Live route authority confirmed: root `CNAME` is `portal.primexbiolabs.co.uk`; GitHub Pages from `clint2795/primex-ecosystem` owns the portal route.
- Physical QR verification: current box scan reaches `portal.primexbiolabs.co.uk` successfully.
- `planner/index.html` staging change: temporary landing now exposes the current core reference range and sends customers to the compact request route instead of forcing a generic Contact PrimeX detour.
- New staging route: `request/index.html` — compact mobile-first browse/request flow with Core range, Reference structures and Extended catalogue; visible Planner/Planning Portal wording is removed from this new route.
- Duplicate-send hardening: `finance/supabase/functions/submit-request/index.ts` is a versioned staging candidate based on production `submit-request` v19. It retains exact `request_ref` idempotency and adds a five-minute recent-identical-payload check. It has NOT been deployed.
- Client confirmation hardening: the new request route stores the successful request reference in session storage, disables Send after success and restores the sent state after same-tab refresh/back navigation.
- Existing `order-request/index.html` remains unchanged as the current live fallback.
- Existing production Edge Function v19 remains unchanged.
- Existing website visual concepts remain unapproved; this stabilization work is operational customer-route work only.
- Rollback: delete/abandon branch `fix/customer-route-v185A`; `main` and live Supabase remain unchanged.
- Release proof still required before live promotion: review branch diff; validate core/extended/reference selection; validate required contact/consent errors; confirm one successful request; retry same payload and verify no second row; verify refresh/back restores sent state; verify email/copy fallbacks; verify mobile layout; inspect Supabase rows; then update this log with exact evidence.

## v184H-TEMP — Temporary Public Holding Page

- Date: 2026-07-29.
- Version: `v184H-TEMP`.
- Single purpose: temporarily replace the public Planner entry page with a branded holding page while product selection, pricing clarity and Request Hub handling are reviewed.
- Exact source file changed: `planner/index.html`.
- Original Planner preserved: complete Planner `v183B` remains in Git commit `8959e8407e986f48175b325eabc5db2652b47873`.
- Public route retained: `/planner/`; no QR destination or routing change is required.
- Verified contact destination retained: `../order-request/`, presented as `Contact PrimeX`.
- Temporary search handling: `noindex, nofollow`.
- Restoration method: restore `planner/index.html` from commit `8959e8407e986f48175b325eabc5db2652b47873`, then reapply any separately approved Planner improvements.
- Tests performed: local HTTP response returned 200 at `/planner/`; desktop 1280×720 and mobile 390×844 browser renders passed; no horizontal overflow; heading, contact destination and `noindex, nofollow` verified; no JavaScript/runtime console errors; Request Hub route returned 200; `git diff --check` passed; unrelated tracked files remained unchanged.
- Deliberately unchanged: Request Hub, Finance, Supabase, product contract, QR destination and all untracked recovery/reference material.
