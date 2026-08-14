# PrimeX Planner Build Control Log

## V01E1-LAUNCHER-HOTFIX — Windows Review Port Collision Repair (LOCAL / NOT LIVE)

- Date: 2026-08-14.
- Protected parent: `V01E-LIVE-ROUTE`; parent package remains unchanged and is the rollback point.
- Observed issue: the Windows browser reached `127.0.0.1:4198` but returned `Not found` because that fixed port could already belong to an older local review server.
- Approved purpose: repair only the local review launcher so it selects a free operating-system port and opens the browser only after the correct server is listening.
- Exact implementation: `START_REVIEW.cmd` now runs `node serve.mjs --port 0 --open`; `serve.mjs` reads the assigned port after startup and opens the correct `/planner/` URL.
- Website design, cards, copy, product data, request logic and proposed live repository files are unchanged.
- Finance HQ, Request Hub, Supabase, CNAME, DNS, GitHub and the current public site remain untouched.
- Acceptance tests: syntax, automatic-port HTTP route, occupied-old-port simulation, static content and complete request-flow regression.
- Result: **PASS** — with port `4198` deliberately occupied, the repaired server selected port `38387` and returned HTTP `200` at the correct `/planner/` route; full automated suite passed `4/4`.
- Owner Windows check exposed a separate launcher defect: using `explorer.exe` opened File Explorer at Documents instead of the default browser. That failed opener was removed before acceptance.
- Corrective implementation: Windows now invokes the registered URL handler through `rundll32.exe url.dll,FileProtocolHandler`; no new owner-facing folder/version was created for this correction.
- Publication remains a separate controlled action.

## V01E-LIVE-ROUTE — Accepted Temporary Route Integration (LOCAL RELEASE CANDIDATE / NOT LIVE)

- Date: 2026-08-14.
- Repository target: `clint2795/primex-ecosystem`.
- Target route: `/planner/` at `portal.primexbiolabs.co.uk`.
- Status: local release candidate only; no commit, push, merge or deployment performed.
- Single purpose: convert the owner-accepted V01E temporary request route into dependency-free GitHub Pages files and prepare a controlled replacement for the existing `v184H-TEMP` holding page.
- Owner accepted the current square-card result as a visual compromise and approved preparation for live-route replacement.
- Product names, strengths, prices, order, supporting categories, exact approved request copy and manual Copy/Email handoff are preserved from V01E.
- Proposed repository scope is limited to `planner/index.html`, `planner/styles.css`, `planner/app.js` and this build-control log.
- Deliberately unchanged: `order-request/`, Request Hub, Finance HQ, Supabase, CNAME, DNS, all other routes and all production services.
- Rollback baseline: repository head `5a3b4578859dfb10529e2d12c27e4816a60b4882`; existing `planner/index.html` blob `99bf6d10a3e3a6356e32c8bc58f3d9b9352181cc`.
- Existing temporary holding-page publication commit: `03195dd709f62417a83f52e0067f05d1dd1ce1c3`.
- Missing authority recorded: original `primex-public-product-contract-v1.2.json` was not available in GitHub or connected Drive; the owner explicitly approved preparation using the frozen V01E values.
- Publication remains a separate explicit approval after local release-candidate QA.

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
