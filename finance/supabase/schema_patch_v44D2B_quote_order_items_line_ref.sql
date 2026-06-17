begin;

alter table public.quote_order_items
add column if not exists line_ref text;

create unique index if not exists quote_order_items_quote_order_id_line_ref_uidx
on public.quote_order_items (quote_order_id, line_ref)
where line_ref is not null;

commit;
