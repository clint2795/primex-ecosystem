begin;

alter table public.quotes_orders
drop constraint if exists quotes_orders_order_type_check;

alter table public.quotes_orders
add constraint quotes_orders_order_type_check
check (order_type in ('Live order', 'Quote / enquiry', 'Past order', 'Test order'));

commit;
