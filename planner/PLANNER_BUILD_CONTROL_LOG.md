# PrimeX Planner Build Control Log

## v185C — Temporary Route Identity + Provisional Family Accents (STAGING / NOT LIVE)

- Date: 2026-08-13.
- Version: `v185C-STAGE`.
- Branch: `fix/customer-route-v185A`.
- Status: staging only; `main` and production Supabase remain unchanged.
- Single purpose: correct temporary-route messaging, use the current PrimeX wordmark treatment, remove meaningless blue family dots, and differentiate known product families without prematurely locking label/site colours.
- Temporary-state message added: the main PrimeX BioLabs website is currently being developed/updated; this route exists in the meantime for browsing current research references and sending requests for review.
- Header identity changed from PX-square lockup to the current `PrimeX BioLabs` wordmark treatment with blue X, based on the owner-supplied current website reference. The rest of that website concept remains unapproved.
- Blue family-dot decoration removed completely because it conveyed no useful information and incorrectly implied one family across the range.
- Family assignment corrections supplied by owner and reflected in staging accents: Retatrutide = metabolic family; BPC-157 / TB-500 = repair family; Thymosin Alpha-1 = immune family; 5-Amino-1MQ = support family. KPV and NAD+ remain restrained/neutral pending exact family reconciliation.
- Accent colours in this staging page are PROPOSED visual mappings only and are not label/packaging authority. They must not be treated as locked production colours until the compound→family colour map is reconciled and explicitly approved.
- Public text remains neutral and RUO-led; family names are not exposed as therapeutic/customer-facing claims.
- Existing request payload codes, public prices, Supabase endpoint, consent validation, email/copy fallback and sent-state protection remain preserved.
- Next proof: owner visual review of the same staging preview; then tray/details behaviour and controlled request-submission proof.

## v185B — Product-led Customer Route Refinement (STAGING / NOT LIVE)

- Date: 2026-08-13.
- Version: `v185B-STAGE`.
- Branch: `fix/customer-route-v185A`.
- Draft PR: `#1` — Customer route stabilization v185A.
- Status: staging only; not merged to `main`; no Supabase Edge Function deployment performed.
- Single purpose: reduce form-like presentation, reduce blue dominance and align the staging customer route with the recovered PrimeX family-colour system while keeping public wording neutral and RUO-led.
- `request/index.html` changed only within staging: graphite/near-black becomes the dominant material; PrimeX system blue is reduced to restrained navigation/action cues.
- Interaction hierarchy changed to: Browse products → compact request tray → Continue to details → contact/review/send. Contact/review content remains hidden until the customer has selected at least one reference and chooses to continue.
- Family-colour source recovered from `PRIMEX_BRAND_SYSTEM_BOARD.html`: Steel Blue baseline `#275FA9 → #9FD2FB`; Deep Violet `#2A1A4A → #7A58C8`; Warm Amber `#4A3010 → #C87830`; Tactical Crimson `#3A0A10 → #A03040`; Slate `#283340 → #6A8090`; Clinical Teal `#1A4A3C → #4AB890`.
- Public use rule: family colour may appear as a subtle visual identifier only. Specialist family names such as regenerative/performance/metabolic are not exposed as customer-facing claims in this staging route.
- Assignment rule for this pass: default core research references use the recovered Steel Blue baseline; Semax/Selank use recovered Deep Violet because those products are explicitly named in that family source. Other specialist assignments remain unresolved rather than guessed.
- Visible public wording remains neutral: Research references, Core range, Reference structures, Extended catalogue, Research use only, Request for review.
- Existing customer-route payload shape, product codes, public prices, Supabase endpoint, consent validation, email/copy fallbacks and successful-send session lock remain preserved.
- Existing `order-request/index.html` remains untouched as fallback.
- Existing production Supabase Edge Function v19 remains untouched.
- No current PrimeX website visual concept is promoted or approved by this staging refinement.
- Next proof: owner desktop/mobile visual review of the same staging preview URL, then selection/tray/details behaviour and controlled request submission tests.

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
