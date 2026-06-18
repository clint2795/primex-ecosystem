begin;

grant select, insert, update on table public.quotes_orders to authenticated;
grant select, insert, update on table public.quote_order_items to authenticated;

commit;
