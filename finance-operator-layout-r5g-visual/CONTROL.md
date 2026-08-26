# PX-ROUTE-R5G Visual Correction Review

Date: 2026-08-26

## Purpose
Protected visual-only review for the owner-reported R5G desktop hierarchy regression.

## Source
- Accepted protected R5G route: `finance-operator-layout-review/`
- Current accepted R5G checkpoint before this proof: `4eb0459994ad7159839626976e0e49a5a446ef38`
- Visual-proof commit: `46efdcbfc6c61dfb59b3c80f3bf28a814f960c2d`

## Approved scope
- Preserve existing R5G Finance logic and data behaviour.
- Improve desktop section/card separation.
- Add restrained cool-blue edge emphasis only when operator cards contain outstanding work.
- Strengthen Next actions visual hierarchy.
- Keep help/back controls in one clean desktop row.
- Preserve current mobile behaviour as far as possible.

## Locked / not changed
- Live `/finance/`.
- Pricing and commercial authority.
- Product codes and stock quantities.
- Stock deduction or stock-operation logic.
- Request, quote, order, payment, fulfilment and message workflows.
- Supabase schema/functions.
- Existing accepted `finance-operator-layout-review/index.html` checkpoint.

## Implementation
This is a protected sibling proof. It loads the accepted R5G route same-origin and injects a presentation-only CSS/DOM classification overlay. The accepted R5G source is not overwritten.

## Acceptance checks
- Desktop header controls do not stack.
- Major Start modules read as separate operator areas rather than one text slab.
- Non-zero Mission Control / Workflow job cards receive restrained edge-light emphasis; zero-count summary cards remain calmer.
- Next-action rows are visually distinct.
- Request selected state remains obvious.
- Mobile retains compact header/navigation behaviour.

## Rollback
Delete or ignore `finance-operator-layout-r5g-visual/`; the accepted R5G route remains unchanged.
