# Operator UI v2 — Section Emphasis

Status: approved optional visual preference; implementation review pending.

The owner requested a scannable section-heading treatment, potentially using a coloured dot, with green for completed stages. Do not use baby blue for headings or add unrelated decorative colours. Preserve the graphite visual system, existing burnt-orange attention colour, and approved success semantics.

The preference is independent of dark/light theme. Offer Minimal (neutral), Balanced (small semantic markers), and Strong (markers plus restrained heading emphasis). Balanced is the proposed default, subject to owner review. Do not assign colours by arbitrary section index or compound family. Text labels and state must remain understandable without colour. Completed means an authoritative completed state, not a clicked button or merely entered evidence. Waiting and attention must remain distinct; red is reserved for genuine critical/blocked states. A neutral section must not appear completed.

Implement through reusable heading/status tokens and a saved user preference, with system theme on first visit. Future shared-user synchronisation should use the existing authorised preference mechanism; do not introduce a new database or service for this visual option. Keep preferences outside customer/job records and do not alter commercial, payment, stock or message authority.

Current work: R5H operator-journey acceptance and isolated Operator UI v2 Payment proof. The Payment proof remains demo-only; live /finance/ is locked. The next review should compare Minimal/Balanced/Strong using the same populated payment record, retain the approved burnt-orange direction, and test mobile overflow and the existing payment guards before integration. No colour option is accepted as the final product palette until owner review.
