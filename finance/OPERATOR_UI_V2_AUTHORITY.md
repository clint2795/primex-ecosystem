# PrimeX Finance HQ — Operator UI v2 Authority

**Status:** APPROVED DIRECTION / IMPLEMENTATION AUTHORITY  
**Purpose:** Reconstruct the Finance operator experience around the hardened Finance engine without rewriting proven commercial/workflow logic.  
**Source checkpoint:** `385608709ba7834cbd11a474d2b04caf0673c441`  
**Live `/finance/`:** LOCKED / untouched  
**Legacy protected candidate:** retained as rollback/reference.

## Product intent

Finance HQ v2 is designed first as a high-trust daily operating system for PrimeX and second as the foundation of a future configurable commercial product.

The interface must answer three questions immediately:

1. What happened?
2. What matters?
3. What do I need to do next?

The product must feel premium, calm, obvious and operationally trustworthy before decorative styling is added.

## Approved application target

Operator UI v2 is not a browser-only Finance page. It is the product UI foundation for a proper installable commercial application.

Target delivery surfaces:
- Windows desktop application
- macOS desktop application
- iPhone / iPad application
- Android application
- web application for browser access where appropriate

Architecture must therefore avoid browser-only assumptions that would make later application packaging expensive or force a second UI rewrite.

The product should converge on one shared business/domain layer and reusable UI system, with platform-specific shells only where native behaviour genuinely improves the experience.

Future application capabilities may include:
- secure company/user sign-in
- role and permission management
- cloud synchronisation
- resilient local/offline state where appropriate
- push / desktop notifications
- automatic update/version handling
- audit and backup controls
- licensing/subscription management
- company onboarding and configuration
- installers and app-store distribution

These commercial/platform capabilities are not all part of the immediate v2 shell build, but current architecture must not prevent them.

## Core interaction model

Daily work is organised around **jobs and state transitions**, not database fields or generic dashboard cards.

Primary workflow:

`Request → Quote → Accepted → Payment → Fulfilment → Complete`

Only the current stage should demand attention. Previous stages collapse to concise evidence. Future stages remain quiet until relevant.

## Foundation surfaces

### Start / Control Pad

Authoritative operator landing surface.

Start is a **command/control pad**, not a work queue and not a dashboard. It should let an operator immediately run the business, resume current work and see only the operational exceptions that genuinely need attention.

Primary Start structure:
- Continue current job / resume work
- Core actions such as New quote, New order, Requests and Stock
- Operational controls such as Payments, Packing / Dispatch, Customer messages and Replenishment
- Compact needs-attention strip for genuine blockers, overdue work or exceptions
- Tappable live status counts only when they lead directly to useful work
- Recent / resume shortcuts for active records

The needs-attention queue is one part of Start, not the whole screen.

Do not turn Start into passive KPI cards, charts or decorative dashboard statistics. Every visible control or count must either launch work, resume work or surface a meaningful operational exception.

### Requests

Incoming work only.

Each request must communicate in this order:
- who / record
- what they want
- current state
- important blocker/exception
- next job

Secondary details stay collapsed.

A request that becomes a quote must never appear to disappear. It moves visibly into a new state with a clear Resume quote action.

### Single Job Workspace

One customer/job at a time.

Header contains:
- customer / record
- current stage
- concise status
- one dominant next action

Stage rail:
`Request → Quote → Accepted → Payment → Fulfilment → Complete`

Current stage is expanded. Previous stages summarise. Future stages stay subdued.

## Navigation

### Desktop

Default desktop shell uses a persistent left sidebar.

Target information architecture:
- Start
- Requests
- Customers
- Quotes
- Orders
- Stock
- Payments
- Admin

Desktop responsibilities:
- **Left sidebar = where am I going?**
- **Start control pad = what can I do?**
- **Main workspace = what am I working on?**
- **Sidebar utility area = profile / company / settings / theme**

Profile, company identity, Settings and theme controls belong at the bottom of the sidebar or inside Settings, not inside job/workflow screens.

Future personalisation may offer an expanded sidebar and compact icon rail, but the navigation model must remain stable.

### Mobile

Keep primary navigation intentionally small.

Default bottom navigation target:
- Start
- Requests
- Orders
- Stock
- More

Secondary modules and Settings live under More rather than squeezing additional equal tabs across the screen. Theme controls should not consume workflow-space on mobile.

## Visual system

PrimeX production UI must not resemble generic SaaS, gamer dashboards or flat black admin templates.

Target qualities:
- engineered near-black / graphite surfaces in dark mode
- refined warm-neutral light surfaces in light mode
- restrained PrimeX icy-blue used for focus, selection and primary action only
- low border density
- spacing and tonal planes provide most hierarchy
- crisp typography with visibly different levels for page, job, label, helper and metadata
- subtle material depth; no decorative sci-fi effects
- one obvious primary action per current state
- semantic warning/success colour only where operationally meaningful
- compact data density without visual compression

## Theme requirement

Dark and light modes are first-class product modes.

Requirements:
- same hierarchy and accessibility in both
- design tokens, never page-specific hard-coded theme colours
- user-selectable toggle
- saved preference
- system preference used on first visit when no saved preference exists

Future company configuration may customise brand tokens, but must preserve product contrast and hierarchy rules.

## Sellable-product constraint

Do not hard-wire the future product to PrimeX-specific terminology where a stable generic concept exists.

Future company configuration layer may control:
- company name / logo
- brand tokens
- currency / tax terminology
- product/service terminology
- workflow labels
- fulfilment methods
- pricing models
- staff roles / permissions
- optional modules
- notification channels

This configuration layer is **not part of the current implementation scope**, but v2 must avoid architecture that prevents it later.

## Locked engine behaviour

Do not rewrite or weaken existing proven controls merely to simplify the UI:
- commercial price authority / accepted-total lock
- request resolution rules
- stock truth / deduction guards
- customer-message authority
- payment evidence
- fulfilment truth
- local save + shared backup retry
- row-version conflict handling
- Clint/Jade claims and permissions
- audit history
- Finance regression CI

The new shell may call or adapt these capabilities but must not silently duplicate their business rules.

## Approved availability and replenishment customer model

When requested stock is unavailable or short, Finance must separate the internal replenishment job from the customer communication job.

Customer-service rule:

**Give the customer the most specific truthful position currently available. If a reliable availability date or window cannot yet be given, give a specific next-update date instead.**

Customer-facing availability states should progress with confidence rather than expose supplier operations:
- availability being confirmed → customer request is held against next available stock and a specific next-update date is promised
- replenishment confirmed → customer can be told the requested item is allocated against incoming stock, while the final availability window is still being confirmed
- expected window known → customer receives the genuine expected availability date/range
- stock received → customer is notified and the request resumes toward quote/order completion

Do not expose supplier names, supplier response delays, purchasing friction or other internal replenishment details in customer messaging.

Do not use vague open-ended wording such as “we’ll let you know” when a more specific service commitment can be made.

If no stock ETA is known, the specific customer commitment is the **next update date**. Finance must create and retain that follow-up job so the request cannot silently disappear while replenishment is unresolved.

Internal replenishment state should support, at minimum:
- replenishment needed
- awaiting availability confirmation
- inbound confirmed
- quantity needed for open requests
- quantity incoming
- expected date/range when known
- next supplier/internal chase date
- next customer update date
- affected open requests

When inbound stock is received, Finance should identify affected waiting requests and surface them for resumption rather than requiring the operator to rediscover them manually.

This model supersedes weaker generic out-of-stock / “awaiting replenishment” messaging as the target for R5I stock operations and v2 customer workflow integration.

## Approved action-state language

Action controls must communicate where they sit in the workflow without becoming visually dead or visually noisy.

Use the same control footprint as it progresses through state:
- **Future / locked:** graphite fill, restrained icy-blue outline, bright readable label, and a short prerequisite helper explaining what must happen first. It must look like a real control that will become available, not like passive text or a dead grey button.
- **Ready / active:** the same control becomes the full PrimeX icy-blue primary treatment and is the dominant action for that state.
- **Completed:** replace the large action emphasis with a compact success confirmation/evidence treatment; do not leave a large green action slab in place after completion.

Future/locked controls may use a small lock or progression icon where useful, but icons must support meaning rather than decorate the control.

The button should not move or transform into an unrelated component when it becomes available. Progressive activation should teach the workflow through continuity of position, size and label.

Routine workflow should remain graphite + icy-blue. Green is reserved for completed/successful state, amber for genuine attention/caution, and red for true blocking/critical states. Do not add semantic colour merely to make a screen more visually interesting.

## Interaction hierarchy

Every production surface follows:

**PAGE → CURRENT JOB/STATE → NEXT ACTION → REQUIRED EVIDENCE → SECONDARY DETAIL**

Never return to:

**card → card → warning → helper → card → button → nested card**.

## Quality bar

Before any v2 surface is accepted it must:
- work without horizontal page movement on mobile
- show the next action without interpretation
- distinguish action, status, warning and passive information visually
- remain understandable with multiple concurrent records
- retain clarity in dark and light themes
- pass Finance regression CI for any engine integration
- be reviewed at owner desktop and owner phone dimensions
- remain viable for packaging into desktop/mobile application shells without redesigning the whole product

## Initial implementation scope

Build the isolated v2 shell in this order:

1. Design tokens + dark/light theme engine
2. Responsive shell: desktop sidebar / mobile navigation
3. Start / Control Pad
4. Requests
5. Single Job Workspace
6. Integrate real hardened Finance data/actions progressively after the shell is visually accepted
7. Move the accepted shell into the proper shared application architecture before commercial packaging

The old protected candidate remains available during reconstruction and is not replaced until v2 proves its workflow.