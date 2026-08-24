# PrimeX Planner Build Control Log

## PX-EMAIL-E1 — Emergency Email-Only Request Handoff (PROTECTED OWNER REVIEW)

- Date: 2026-08-24.
- Purpose: temporarily route every completed Early Access request through the established PrimeX order inbox while the shared Finance intake is audited and repaired.
- Customer action: `Email request` opens a completed draft addressed to `orders@primexbiolabs.co.uk`, containing the selected products, quantities, indicative total, contact details, notes and stable request reference.
- Truthful handoff: the page now states before and after the action that opening the draft does not submit the request; the customer must press Send in their email app.
- Backup action: the normal form now shows only `Email request`. `Email didn’t open? Copy request instead` appears only after the email action is used and directs the customer to the same PrimeX inbox.
- Message-direction correction: the inbound customer-to-PrimeX email now contains only the request reference, contact details, fulfilment preference, selected products, quantities, indicative total and notes. Customer-facing RUO and fulfilment footer wording remains on the public page but has been removed from the inbound email body.
- Cloud isolation: the Planner no longer calls the Supabase `submit-request` endpoint and cannot create a Finance request record.
- Exact repository scope: `planner/app.js`, `planner/index.html`, `planner/styles.css`, `scripts/verify-commercial-authority.mjs`, `scripts/verify-email-only-handoff.mjs`, `scripts/verify-message-direction.mjs` and this control-log entry only.
- Locked and unchanged: product authority, prices, products, sets, quantities, public RUO treatment, Finance HQ code and customer templates, Supabase functions, database schema and every other route.
- Rollback point: `553a4438fb6dbc5cfa6f914f81bf320c0457bfa0`.
- Focused verification: **PASS** — JavaScript syntax, approved inbox, one-action presentation, delayed fallback, pre-send explanation, post-open warning, clean and complete inbound request fields, outbound Finance message footer coverage, absence of the cloud endpoint/function, changed-file scope and diff formatting.
- Existing broad-verifier blocker: `scripts/verify-commercial-authority.mjs` cannot complete at this accepted checkpoint because its referenced `supabase/cutover/20260817_commercial_authority_v2_price_integrity.sql` file is absent. This emergency change did not delete or alter that missing dependency.
- Publication status: protected local review only. No commit, push or deployment performed.

## PX-ROUTE-R3 — Planner-to-Finance Intake Repair (LOCAL OWNER REVIEW)

- Date: 2026-08-16.
- Purpose: restore structured Supabase Request Inbox delivery from the current temporary public Planner while preserving its existing email handoff as the fallback.
- Planner change: the existing Email request action now submits the stable request reference, customer contact fields, product codes, strengths, quantities and approved public prices to the existing `submit-request` intake before opening the unchanged email draft.
- Failure behaviour: a cloud-intake failure does not block the existing email handoff. The Copy request behaviour and wording remain unchanged.
- Current public product data, set contents, HTML, CSS, design, layout and request email text remain unchanged.
- Connected Finance work is recorded under the same `PX-ROUTE-R3` identifier in `finance/FINANCE_HQ_BUILD_CONTROL_LOG.md`.
- Rollback point: `be1c256fabafd2a76a1c669ea0b9917c16d05dfa`.
- Status: local owner review only. No commit, push, Edge Function deployment or GitHub Pages deployment performed.

## PRICE-ONLY HOTFIX — Temporary Public-Price Correction

- Date: 2026-08-14.
- Previous live commit and rollback point: `e4951c614029af309cfee188f41a556c37bf5d7e`.
- Exact product-data corrections: GHK-Cu 50mg £40→£55; the unapproved BPC-157 40mg £60 entry was removed and replaced in the featured selection by BPC-157 10mg £40, with its duplicate wider-range entry removed; NAD+ 500mg £65→£49; 5-Amino-1MQ 50mg £125→£110; TB-500 10mg £60→£65; Thymosin Alpha-1 10mg £85→£75; SS-31 30mg £105→£95. KPV 10mg was verified at £55.
- Verified scenario total: GHK-Cu ×2 (£110) + BPC-157 ×3 (£120) + Wolverine ×1 (£100) = **£330**.
- Verified all-product total: all 14 currently listed products at quantity one = **£1,279**.
- Scope lock: only `planner/app.js` product data and this log entry changed. HTML, CSS, design, copy, functionality, set contents and every other route remain unchanged.
- This temporary public-price correction does not approve the long-term Planner or product range; both remain unapproved.

## V01E2-LIVE-ROUTE-HOTFIX — Final Layout, Colour and Copy Release

- Date: 2026-08-14.
- Customer-visible failure: live commit `b091f0820a18a611a3e597eda8ff53c87130b1fb` produced oversized featured cards at the owner’s approximately 935px browser width and retained rejected temporary-route/internal wording.
- Layout cause: `planner/styles.css` changed `.featured-grid` from four columns to two at `max-width: 980px` while `.product-card` retained `aspect-ratio: 1 / 1`, creating two approximately 440px square cards near 935px.
- Final authoritative colour lock: page `#02050A`; sections `#060C16`; cards/panels `#0A1828`; raised areas `#0E1A2E`; structural borders `#2A3240`; clinical white `#F4F7FA`; Signal core `#275FA9`; Signal hover `#5898D8`; `#80B8F0` and `#9FD2FB` reserved for tiny focus/specular or PrimeX X-gradient stops. The rejected bright cyan token was removed completely while product-family rails remain unchanged.
- Copy correction: replaced the rejected temporary-site, “reference” and “request for review” customer wording with the owner-approved product/request language; approved success messages and Research Use Only wording remain unchanged.
- Exact changed files: `planner/index.html`, `planner/styles.css`, `planner/app.js`, `planner/PLANNER_BUILD_CONTROL_LOG.md`.
- Viewport acceptance: **PASS** at `1440`, `1280`, `1024`, `981`, `980`, `935`, `760`, `759`, `740`, `520`, `519`, and `390×844`; four columns remain through 760px, two columns apply below 760px, 935px cards measure `216×216px`, 390px cards measure `169×202px`, all controls and product text remain visible, and no horizontal overrun occurs.
- Functional regression: **PASS** — featured and supporting-category selection, selected state, quantity, removal, request details, required/email/WhatsApp/consent validation, copy output, generated PX reference, exact success messages, email mailto URL/body, compliance wording, console and JavaScript syntax.
- Final colour/accessibility regression: **PASS** — no rejected cyan token or matching RGB value remains; computed page, surface, panel, raised-area, border, heading, steel-text and Signal colours match the authoritative lock; all headings render Clinical White; no large Signal-blue fill exists; minimum audited text contrast is `5.72:1`; product-family rails are unchanged.
- Final engineering gates: **PASS** — `node --check planner/app.js`, `git diff --check`, browser console, protected copy/behaviour checks and four-file Git scope.
- Live rollback point: `b091f0820a18a611a3e597eda8ff53c87130b1fb`.
- Deployment record: validated for direct publication to `main`; this release commit is the commit containing this entry. GitHub Pages workflow and live desktop/mobile verification are recorded in the owner release handoff after publication because a commit cannot contain its own immutable hash or post-commit deployment result.

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
