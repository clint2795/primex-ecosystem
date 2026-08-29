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

## Core interaction model

Daily work is organised around **jobs and state transitions**, not database fields or generic dashboard cards.

Primary workflow:

`Request → Quote → Accepted → Payment → Fulfilment → Complete`

Only the current stage should demand attention. Previous stages collapse to concise evidence. Future stages remain quiet until relevant.

## Foundation surfaces

### Start / Work Queue

Authoritative operator landing surface.

Show:
- Needs attention
- Due today / overdue
- Recent meaningful changes
- Current work in progress
- Quick actions only where genuinely useful

Every actionable row must identify:
- customer / record
- current state
- reason it needs attention
- next action
- owner / deadline when applicable

Do not make passive statistics look like jobs.

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

Persistent left sidebar.

Target information architecture:
- Start
- Requests
- Customers
- Quotes
- Orders
- Stock
- Payments
- Admin

### Mobile

Keep primary navigation intentionally small.

Default bottom navigation target:
- Start
- Requests
- Orders
- Stock
- More

Secondary modules live under More rather than squeezing seven equal tabs across the screen.

## Visual system

PrimeX production UI must not resemble generic SaaS, gamer dashboards or flat black admin templates.

Target qualities:
- engineered near-black / graphite surfaces in dark mode
- refined warm-neutral light surfaces in light mode
- restrained PrimeX blue used for focus, selection and primary action only
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

## Initial implementation scope

Build the isolated v2 shell in this order:

1. Design tokens + dark/light theme engine
2. Responsive shell: desktop sidebar / mobile navigation
3. Start / Work Queue
4. Requests
5. Single Job Workspace
6. Integrate real hardened Finance data/actions progressively after the shell is visually accepted

The old protected candidate remains available during reconstruction and is not replaced until v2 proves its workflow.