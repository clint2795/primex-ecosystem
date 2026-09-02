# PrimeX Finance HQ — R5I Approved Stock Truth Operator Requirement

**Status:** APPROVED REQUIREMENT / NOT YET IMPLEMENTED  
**Authority relationship:** Supplements `finance/OPERATOR_UI_V2_AUTHORITY.md` and the approved availability/replenishment customer model.  
**Implementation stage:** R5I stock operations / v2 hardened-engine integration.  
**Current v2 shell work:** Do not implement the stock/message brain during visual proof work.

## Purpose

When Finance already knows the requested quantity and current stock truth, the operator must not be forced to open the Stock screen merely to discover the basic availability situation.

The job/request/quote workspace should surface the known stock position directly before asking the operator for a decision.

## Required operator stock summary

Where stock truth is available, surface at minimum:
- requested quantity
- available quantity now
- short quantity, if any
- whether replenishment is required
- relevant whole-request context when other quoted/requested items are fully or partially available

Example:

`Requested 4 · Available 2 · Short 2`

The summary must be easy to scan and must come from the authoritative stock model rather than duplicated UI calculations.

## Operator decision principle

Finance may calculate and present the factual situation, but it must not silently make a commercial fulfilment decision where more than one valid path exists.

For example, when 4 are requested and 2 are available, Finance may surface paths such as:
- supply available quantity now / part fulfilment
- hold the full request for replenishment
- unable to supply

The final operator choice controls the downstream workflow and customer communication.

## Whole-request / split-fulfilment context

Where one line is short but other requested/quoted lines are available, Finance should calculate and display the whole-request situation so the operator does not need to reconstruct it manually.

A part-fulfilment decision must account for all other available stock in the same accepted request/quote and preserve the existing split-shipment/postage authority.

## Replenishment intelligence

If the current request is short, Finance should surface that replenishment is required without making the operator enter Stock to discover the conclusion.

Where later R5I logic has enough information, the system should also be able to show:
- shortage for this request
- other open demand for the same item
- total quantity required across affected waiting requests
- incoming quantity when known
- remaining uncovered quantity

Opening Stock remains available for evidence, detail, adjustments, receiving and other stock operations; it is not the mandatory first step just to learn requested-versus-available truth.

## Customer-message integration

Do not create a new parallel message system for this requirement.

The customer message must be generated from:
1. authoritative stock truth,
2. the operator's chosen fulfilment path,
3. the existing approved customer-message authority and availability/replenishment messaging rules.

Existing approved principles remain controlling, including:
- give the most specific truthful customer position available
- use a genuine availability window when known
- otherwise give a specific next-update date
- do not expose supplier names, supplier delays or internal purchasing friction
- keep internal replenishment work separate from customer communication

Saved/approved message templates or snippets should be reused/versioned rather than rewritten during visual-shell work.

## Scope guard

This document records the requirement only.

Do **not** implement new stock calculations, replenishment automation, split-fulfilment logic or customer-message generation inside the current v2 visual proof merely to demonstrate this requirement.

The current shell should only leave appropriate UI space/hooks so the hardened Finance/R5I brain can supply these facts and actions later without redesigning the workflow.
