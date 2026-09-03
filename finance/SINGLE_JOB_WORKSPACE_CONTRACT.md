# PrimeX Finance HQ — Single Job Workspace Contract

**Status:** APPROVED DIRECTION / PRE-UI CONTRACT  
**Authority:** `finance/OPERATOR_UI_V2_AUTHORITY.md`  
**Purpose:** Define the complete operator contract for one customer/job before building the v2 Single Job Workspace proof.  
**Live `/finance/`:** LOCKED / untouched.  
**Engine rule:** The workspace orchestrates hardened Finance capabilities; it does not duplicate or weaken their business rules.

## 1. Workspace role

The Single Job Workspace is the operator's central working surface for one customer job from first request through completion.

It must answer, without interpretation:

1. Who is this job for?
2. What does the customer want?
3. Where is the job in the full process?
4. What changed most recently?
5. What matters now?
6. What must the operator do next?
7. What customer communication is required?
8. What evidence/history already exists?

The workspace is the **hub**, not a replacement source of truth. Specialist records such as Quote, Order, Stock and Payment remain authoritative for their own domains.

## 2. Lifecycle

Primary job lifecycle remains:

`Request → Quote → Accepted → Payment → Fulfilment → Complete`

Rules:
- Current stage is expanded and actionable.
- Previous stages collapse to concise evidence/history.
- Future stages remain subdued until prerequisites are met.
- A job must never disappear when it moves stages.
- The workspace persists across the whole lifecycle under one job/customer context.

## 3. Permanent job header

Always visible job context:
- customer name
- job / request reference
- current lifecycle state
- process position, e.g. `Request · Stage 1 of 6`
- preferred contact
- handled by
- concise current status
- dominant next action

Terminology:
- `Preferred contact · WhatsApp / Email / other configured channel`
- `Handled by · Clint / Jade / Unassigned`

`Handled by` is operator accountability, similar to a till/session responsibility marker. It must remain separate from customer contact preference.

## 4. Workspace information hierarchy

Every job screen follows:

**JOB CONTEXT → LATEST CUSTOMER/WORK EVENT → CURRENT FACTS → NEXT ACTION → CUSTOMER COMMUNICATION → EVIDENCE/HISTORY → SECONDARY DETAIL**

Do not return to card-on-card nesting or repeated state labels.

## 5. Customer conversation

The workspace is the primary operational view for the conversation attached to this job.

Conversation must support:
- original incoming customer request
- subsequent incoming customer messages
- outbound messages sent/generated from the job
- chronological thread
- message timestamps
- communication channel
- operator who handled/sent the message where relevant
- concise system events only when they materially explain the conversation state

The conversation is job-scoped. It must not become a generic detached inbox that loses quote/order/stock context.

## 6. Incoming customer message handling

Incoming messages may change the correct next action. Finance must therefore interpret the message against the **current job state and authoritative job facts**.

Representative message intents include:
- quantity change
- product/item change
- customer question
- availability question
- postage/dispatch question
- missing detail supplied
- quote clarification
- quote amendment request
- quote acceptance
- payment timing/update
- fulfilment/delivery question
- decline/cancel
- unclear or mixed intent requiring operator review

The system may suggest a likely interpretation and next action, but must not silently make a consequential business change where hardened Finance requires operator confirmation.

Target interaction:

**Latest incoming message**  
Customer message text

**Detected meaning / suggested interpretation**  
Plain-language summary of what appears to have changed or what the customer is asking.

**Recommended next action**  
One clear operator action appropriate to the current stage.

Examples:
- quantity changed → `Update quote`
- missing detail supplied → `Continue request review`
- quote accepted → `Convert to live order` when Finance authority permits
- availability question → `Prepare availability update`
- ambiguous message → `Review customer message`

Operator remains in control of consequential changes.

## 7. Current facts

The workspace surfaces only the facts needed to work the current job without making the operator hunt through specialist pages.

At minimum, current facts may include:
- requested items and quantities
- stock position relevant to the request
- current quote total/status when created
- accepted total/status when accepted
- payment state
- fulfilment state
- availability/replenishment state when relevant
- promised next-update date when relevant

Stock rule already approved:
- if Finance knows stock truth, surface the useful request-specific position in the job
- Stock specialist page is for deeper stock operations/detail, not for discovering basic truth already known by Finance
- do not invent unavailable reservation/allocation numbers

## 8. Quote creation and amendment

Quote work is initiated from the job workspace but uses the hardened Quote authority and record.

Target flow:
1. request/current facts are reviewed
2. stock issue is resolved if required
3. operator chooses `Draft quote` / `Update quote`
4. authoritative quote record is created/updated
5. workspace immediately reflects quote state
6. customer communication is generated from the authoritative quote facts

The workspace must not maintain a competing quote total, product list or pricing rule.

## 9. Stock issue decisions

When stock is short or unavailable, the job workspace must surface a job-specific resolution action rather than forcing the operator to infer the problem from the Stock module.

The job-specific stock decision area must support the commercially valid fulfilment paths allowed by Finance authority and future R5I stock logic.

It may link to Stock for detailed stock/replenishment work, but the operator should be able to understand:
- requested quantity
- currently available quantity
- short quantity
- current stock count where authoritative
- whether replenishment/availability follow-up is required
- what customer communication commitment is currently truthful

Customer-facing availability follows the approved authority model: give the most specific truthful position available; if no reliable date/window exists, give a specific next-update date.

## 10. Customer communication desk

Outbound customer communication belongs inside the job workspace.

It must be generated from current authoritative job facts, not maintained as free-floating copy that can drift from the actual quote/order/availability state.

Customer communication area may contain:
- communication purpose/status
- generated draft message
- source facts used
- edit/review control where allowed
- copy action
- future send action through configured channel integrations
- sent evidence/history after dispatch

Examples of communication purpose:
- request clarification
- quote ready
- updated quote
- availability update
- next-update commitment
- payment confirmation/request
- dispatch update
- completion/follow-up

Customer-message authority remains hardened and must not be bypassed by the UI.

## 11. Quote/message relationship

The operator should not have to manually copy commercial facts from Quote into a separate messaging page.

When a quote exists:
- quote record is authoritative
- workspace shows concise quote summary/status
- message draft is generated from that quote and other authoritative job facts
- changing the quote invalidates/regenerates any unsent message that depends on the changed facts
- sent messages remain historical evidence and are never silently rewritten

## 12. Specialist-page relationship

The workspace is the unified operator view. Specialist pages remain available for domain depth.

Expected relationships:
- **Customer** → customer profile/history
- **Quote** → full quote record/editing/evidence
- **Order** → full live-order record
- **Stock** → stock/replenishment operations
- **Payment** → payment evidence/record
- **Fulfilment** → packing/dispatch evidence

Opening a specialist record must preserve an obvious route back to the current job.

## 13. Dominant next action

There is one dominant next action for the current job state.

Representative actions:
- review customer message
- clarify request
- resolve stock issue
- draft quote
- update quote
- send quote
- record acceptance
- convert to live order
- record/confirm payment
- prepare fulfilment
- dispatch
- send customer update
- complete job

Secondary links must not compete visually with the dominant action.

## 14. Evidence and history

The workspace must make it possible to understand how the current state was reached.

History may include:
- original request received
- handler changes
- customer messages received
- customer messages sent
- quote created/updated/sent
- stock decision made
- availability commitment made
- quote accepted
- order created
- payment evidence recorded
- fulfilment/dispatch evidence
- completion

This should be chronological, concise and audit-friendly. Hardened audit history remains authoritative.

## 15. Representative job states required in the proof

The visual proof must include enough representative states to make design decisions once, before integration.

At minimum:
1. New request, fully available, ready to draft quote
2. Request with stock shortage requiring decision
3. Partial availability requiring decision
4. Waiting on customer reply
5. New incoming customer message that changes quantity and therefore requires quote update
6. Customer question requiring a response but no commercial state change
7. Quote ready to send
8. Quote sent / waiting for customer
9. Quote accepted / ready for order transition
10. Payment stage
11. Fulfilment stage
12. Completed job with compact evidence

The first UI proof does not need every state expanded simultaneously, but the contract and component system must support all of them.

## 16. Mobile contract

Mobile must:
- show customer/job identity immediately
- show current stage/status without horizontal movement
- surface latest incoming message when it is the reason the job needs attention
- keep the dominant next action reachable without digging through multiple nested cards
- keep conversation/history readable without tiny type
- avoid stacked equal-weight action buttons where one action is dominant
- use collapsible previous-stage/history detail where needed

## 17. Desktop contract

Desktop may use the extra width for a calmer working layout, but it must preserve the same hierarchy and business meaning as mobile.

Likely desktop composition:
- main working column: current stage, conversation/current task, next action
- supporting column: current facts, linked quote/order/stock/payment summaries, job metadata

Do not turn desktop into a multi-panel monitoring dashboard.

## 18. Behaviour that must remain hardened

The workspace must call/adapt, not rewrite:
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

## 19. First proof build order

Build the Single Job Workspace proof in this order:
1. shell + permanent job header
2. stage treatment
3. latest customer message / conversation treatment
4. current facts treatment
5. dominant next-action treatment
6. customer communication desk
7. specialist-record summaries/links
8. evidence/history
9. waiting/completed variants
10. mobile overflow/readability review
11. desktop composition review

Only after the visual proof is accepted should real hardened Finance data/actions be progressively integrated.

## 20. Acceptance test

Before this surface is accepted, the operator should be able to answer from one job screen:

- What did the customer ask for?
- What did they say most recently?
- Has that message changed what we need to do?
- What is the current quote/order/payment/fulfilment position?
- What is the stock/availability position relevant to this job?
- What must I do next?
- What should the customer be told now?
- What has already been sent/done?
- Which specialist record do I open if I need deeper detail?

If any of those require guessing or hunting across unrelated pages, the workspace is not finished.
