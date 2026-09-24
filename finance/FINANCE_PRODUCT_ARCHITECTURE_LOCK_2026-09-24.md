# PrimeX Finance — Product Architecture Lock

**Date:** 2026-09-24  
**Status:** OWNER-APPROVED PRODUCT DIRECTION / LOCKED  
**Branch:** `product/finance-v2-architecture-lock-2026-09-24`  
**Visual base checkpoint:** `cb5f5be5b42df1eb2b01c6560df1162b09eb8770`  
**Operational Finance:** remains separate; do not disturb the operational launch candidate or live `/finance/`.

## Authority

This document is the newest product-architecture authority for the Finance v2 / future commercial product direction.

Where this document conflicts with older navigation, Start-page composition or product-structure wording in `OPERATOR_UI_V2_AUTHORITY.md`, this document wins.

Existing hardened engine/business-rule contracts remain authoritative and must be reused rather than rewritten.

The current mature Finance implementation remains the operational reference and near-term operating safety net while the product UI is rebuilt around a cleaner architecture.

---

## Product intent

Build one professional Finance operating system that works first for PrimeX and can later become a configurable commercial product for other businesses without a second architectural rewrite.

PrimeX is the first real operating company using the product, not a one-off hard-coded version that must later be reverse-engineered into commercial software.

The product must be:

- extremely easy to follow
- rich, premium and deliberate visually
- operational rather than dashboard-driven
- progressively guiding: the software should tell the operator what needs doing next
- suitable for web, desktop and mobile application packaging
- configurable later for other companies without weakening the PrimeX implementation

---

## Core product model

The central concept is the **Customer Job**.

A Customer Job persists from first request to completion and links the specialist records needed to work that job.

Core relationship:

`Customer → Customer Job → Request / Quote / Order / Payment / Fulfilment / Communications / Tasks / Audit History`

Specialist records remain authoritative for their own domain. The Customer Job is the orchestrating workspace that connects them.

Records must be linked by stable identifiers rather than copied into competing duplicate sources of truth.

---

## Primary application areas

### Start

Purpose: tell the operator what matters now and provide a small amount of personal quick access.

Start is split into two distinct layers:

#### Mandatory operational layer

Always controlled by the application.

Surfaces only meaningful work such as:

- jobs requiring action now
- blocked jobs
- new requests
- quotes needing action
- payment actions
- fulfilment / dispatch actions
- stock/replenishment blockers
- overdue commitments or customer follow-ups

Zero/noise states stay compact.

The app should route the operator directly to the relevant Customer Job and exact action wherever possible.

#### Optional personal Quick Access layer

User-configurable but deliberately constrained.

The operator may add a small set of approved shortcuts/widgets, for example:

- New quote
- Repeat order
- Stock intake
- Expenses
- Money overview
- Supplier orders
- Open quotes
- Recent customers
- Backup/export
- saved views later

Initial rule:

- simple `Add shortcut` selector
- show/hide chosen items
- approximately 4–6 items maximum initially
- no freeform dashboard-builder complexity
- drag/reorder may be added later only if cheap and useful
- optional items must never displace mandatory operational priorities

Start = **the app thinks for you first; the user personalises second**.

### Requests

Incoming work that has not yet been resolved into the appropriate Customer Job/workflow state.

A request must never vanish when progressed. It becomes visibly linked to the resulting job.

### Customer Jobs

Primary day-to-day operational centre.

The Jobs hub shows compact, highly scannable job rows/items containing only useful context, e.g.:

- customer
- job/reference
- current state
- value where useful
- concise blocker/status
- next action / due commitment

The hub is for finding and selecting work.

Do not expand the entire workflow inside a list card.

Selecting a job opens its dedicated Customer Job workspace.

### Orders

Cross-job order-centric view.

Used for searching, filtering and managing order records across customers while preserving links back to the parent Customer Job.

### Stock

Inventory truth, stock movement, availability, replenishment and stock operations.

Job-specific stock facts surface in the Customer Job where needed; deeper inventory operations live here.

### Money

Company-level financial truth.

Includes progressively:

- revenue received
- outstanding customer payments
- supplier purchases / cost of goods
- operating expenses
- running gross profit
- running net profit
- cash position
- weekly/monthly performance
- expense categories
- supplier spend
- later: borrowing / liabilities

A Customer Job may show its own revenue, costs and margin, but company-wide profit truth belongs in Money.

Borrowing is useful but is not a launch blocker.

Accounting rule for future borrowing support:

- loan principal is a liability, not an expense
- interest and applicable fees are expenses
- borrowing records should later support lender, original amount, current balance, repayments, interest/fees, next due date and history

### Admin

Company and product configuration, users, roles/permissions, integrations, terminology, branding, modules and settings.

Commercialisation must be enabled here rather than by duplicating the application per company.

---

## Customer Job workspace

A Customer Job gets a dedicated working page/workspace.

Initial specialist sections:

`Overview | Quote | Payment | Fulfilment | Messages | History`

This is one job with connected views, not six disconnected mini-apps.

### Dominant next-action engine

The workspace must always determine and clearly surface the most relevant next operator action based on authoritative job state.

Examples:

- Review request
- Resolve stock issue
- Draft quote
- Send quote
- Record acceptance
- Record payment
- Prepare order
- Dispatch and add tracking
- Send dispatch confirmation
- Complete job

When a prerequisite blocks progress, the app surfaces the blocker instead of pretending the normal next action is available.

Example:

`BLOCKED — TB-500 unavailable — next supplier/customer commitment due Friday`

Completing an action should cause the next appropriate action to surface automatically.

The operator should not need to remember which screen or module comes next.

This progressive guidance is a core product behaviour, not optional decoration.

### Desktop composition

Preferred pattern:

- left: compact active-job list / navigation where appropriate
- centre: selected Customer Job workspace
- right: contextual evidence/status/supporting inspector only when useful

The central workspace must have enough width; do not repeat the overly narrow composition from earlier proofs.

### Mobile composition

`Jobs list → tap job → full-screen Customer Job workspace → specialist section`

No desktop-style squeezed multi-column layout.

### Dedicated routes

Each Customer Job should be deep-linkable by a stable route/identifier.

This supports:

- direct navigation from Start
- return from specialist modules
- browser history
- notifications opening the exact job/action
- future optional separate desktop windows if useful

Do not make multi-window desktop behaviour a v1 dependency.

---

## Whole-app linking rules

The application must behave as one connected system rather than separate islands.

Representative chain:

`Request → Customer Job → Quote → Acceptance → Order → Payment → Stock/Fulfilment → Dispatch → Complete`

Changes in one authoritative domain should surface in the relevant linked views without manual duplicate entry.

Examples:

- accepted quote enables the order transition
- order/payment status appears in the parent Customer Job
- payment actions surface in Money and the job
- stock shortage can block a job and appear in Stock/replenishment views
- stock receipt should resurface affected waiting jobs
- customer messages remain attached to job context
- global Start priorities deep-link to the exact job/action
- audit/history provides a concise chronological explanation of state changes

---

## Visual authority

The product must have **richness**, not washed-out software colouring.

Rejected:

- washed blue-grey
- baby blue
- pale SaaS panels
- generic light SaaS
- generic dark SaaS
- rounded-card stacking
- box-in-box nesting
- pill/badge soup
- giant soft radii
- decorative dashboards
- neon/gamer styling
- low-contrast grey-on-grey surfaces

Approved direction:

- rich blackened graphite / near-black / deep navy-charcoal dark surfaces
- clear tonal separation between background and working planes
- crisp off-white text
- controlled PrimeX steel/ice blue for current/selected/primary action
- green only for genuine successful/cleared states
- true orange/copper only for real attention/caution
- red only for critical/destructive/blocking states
- subtle directional edge-light / line treatment as a recognisable PrimeX visual signature
- sharp, engineered geometry
- near-square corners; only minimal radius where functionally helpful
- spacing, alignment, typography and lines do most hierarchy work
- no visual effect that competes with usability

The first v2 benchmark structure is retained as a useful visual starting point, especially its contained central workspace and better-proportioned supporting rail, but it requires colour/material/proportion refinement.

The later washed-out material-refinement direction is rejected.

---

## Dark / light themes

Dark and light mode are first-class optional presentation modes.

Requirements:

- user-selectable Dark / Light / System
- system preference may be used by default on first use
- saved per-user preference
- identical information hierarchy and interaction semantics in both modes
- accessibility/contrast must remain strong
- theme tokens must be centralised; no page-by-page hard-coded colour drift

Dark mode must preserve the approved rich PrimeX character.

Light mode must be deliberately designed, not a simple colour inversion. Use refined warm/neutral light surfaces with strong hierarchy; avoid washed baby-blue/grey styling.

Theme choice must never alter business logic.

---

## Notifications and wearable alerts

Notifications are an optional configurable capability.

Target channels may include:

- in-app
- desktop
- mobile push
- email where appropriate
- future connected communication channels
- wearable delivery where supported by the user's device/platform

Wearable alerts are an approved product requirement/target, not a launch blocker.

The product must not assume one wearable ecosystem only.

Where platform notification infrastructure allows it, important Finance notifications should be able to reach a paired wearable through the phone/OS notification system.

Examples:

- urgent customer job requires action
- payment confirmation/action
- dispatch/fulfilment reminder
- stock blocker/resolution
- overdue customer commitment
- specifically opted-in workflow reminder

Rules:

- notifications are opt-in/configurable
- users control categories/channels
- avoid notification spam
- quiet-hours support should be possible
- tapping a supported notification should deep-link to the relevant job/action
- sensitive customer/business detail should be minimised on lock-screen/wearable previews according to privacy settings

Direct native watch applications are not required for the first implementation unless later justified.

---

## Commercial product constraints

Do not hard-code PrimeX-specific concepts where a stable generic business concept exists.

Future company configuration should be able to control:

- company name/logo
- brand tokens
- currency
- tax terminology/rules
- product/service catalogue
- workflow labels
- fulfilment methods
- pricing models
- roles/permissions
- enabled modules
- document/message templates
- notification channels
- integrations

PrimeX remains a configured company using the same product architecture.

---

## Hardened-engine rule

Do not copy the old Finance UI into v2.

Reuse/progressively adapt the mature business logic and proven controls behind a clean boundary.

**No old UI crosses the boundary. Only proven business logic, data behaviour and required evidence do.**

Do not weaken:

- commercial price authority / accepted-total lock
- quote/order transitions
- request resolution
- stock truth / deduction guards
- customer-message authority
- payment evidence
- fulfilment truth
- shared save/recovery
- conflict handling
- roles/permissions
- audit history
- regression coverage

---

## Build strategy

Two tracks remain deliberately separate:

### Operational PrimeX track

Use the mature operational Finance candidate to get PrimeX running and protect near-term cashflow.

Only fix launch blockers and material usability issues.

Do not spend prolonged effort trying to turn that interface into the final commercial product.

### Product / commercial track

Continue from the preferred first v2 direction.

Build around:

1. shared design tokens and Dark/Light/System themes
2. product shell/navigation
3. Customer Jobs hub
4. one complete Customer Job workspace
5. dominant next-action engine
6. progressive integration of proven Quote/Payment/Fulfilment/Message/Stock capabilities
7. connected Start priorities
8. Money
9. constrained personal Quick Access
10. notification settings and wearable-compatible delivery foundations
11. commercial configuration/admin layer progressively

The first major proof target is:

**Customer Jobs Hub → selected Customer Job workspace**

This is the architecture-defining proof. It must demonstrate navigation, job context, next-action behaviour, specialist links, desktop/mobile composition and the approved visual language before broad surface expansion.

---

## Anti-overengineering rules

- do not build a freeform widget/dashboard designer
- do not make multi-window desktop behaviour a v1 dependency
- do not build a dedicated watch app merely to claim wearable support
- do not recreate accounting software before PrimeX needs it
- do not invent duplicate sources of truth
- do not add visual containers where hierarchy/spacing/dividers suffice
- do not add modules simply because competitors have them
- do not allow commercialisation ambitions to delay the PrimeX operational path

---

## Owner decision

This product architecture is locked as the current Finance direction.

Changes require a deliberate new owner decision rather than incidental redesign during implementation.
