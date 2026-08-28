# PX-ROUTE-R5G Closeout — 2026-08-28

## Status

`COMPLETE / EVIDENCED`

## Accepted source and rollback

- Protected route: `https://portal.primexbiolabs.co.uk/finance-operator-layout-review/`
- Final accepted UI-state commit: `ee2929df244a1ca6e0226ee638285671e4ccf0af`
- Earlier protected R5G source remains `finance-operator-layout-review/index.html`.
- Live `/finance/` remains untouched.

## Human acceptance evidence

Owner desktop review passed after the Start screen was refined back toward the accepted PrimeX card language, with actionable work visually distinct, Next Actions full-width on desktop, Quick Actions demoted below it, and passive/zero states quieter.

Owner phone portrait review passed with:
- compact Finance header;
- readable Mission Control and Workflow totals;
- clear active/passive distinction;
- full-width Next Action controls;
- visible fixed bottom navigation;
- no meaningful control covered by navigation.

Jade-sized phone review passed with:
- readable two-column Workflow and Quick Actions layouts;
- fixed bottom navigation fitting all seven destinations;
- no browser zoom required;
- `Next actions` placed before `Quick actions` after the final mobile-priority correction;
- Urgent stock and Backup remaining below the working sections.

The final ordering was also rechecked on the owner phone after cache-busted load and matched the intended operator order.

## Final Start priority order

1. Mission Control / Workflow totals
2. Next Actions
3. Quick Actions
4. Urgent stock alerts
5. Backup

## Protected-review-only visual helper

`finance/config.js` contains a hard pathname guard for `/finance-operator-layout-review/` only. The helper:
- highlights real outstanding-task cards;
- quiets zero-state cards;
- keeps Open Order Value informational;
- gives action buttons a dark PrimeX surface with a thin blue edge;
- preserves restrained typography;
- enforces work-before-shortcuts ordering on all viewports.

It does not run on live `/finance/`.

## Locked and unchanged

No changes were made to:
- commercial values;
- product codes;
- stock quantities or deduction logic;
- customer message bodies;
- Supabase schema/functions/RLS;
- protocols;
- Early Access/public intake;
- permanent website;
- live `/finance/`.

## Result

R5G is closed. The dependency blocking `PX-ROUTE-R5H` is cleared. The next active Finance work unit is `R5H — Complete operator-journey acceptance`.
