-- PrimeX Finance HQ v44A Supabase RLS foundation
-- Purpose: safe policy baseline only. Review and test before frontend wiring.
-- Important: helper functions use security definer to avoid recursive policies on profiles.role.

begin;

create schema if not exists app_private;
revoke all on schema app_private from public;
revoke all on schema app_private from anon;
revoke all on schema app_private from authenticated;

create or replace function app_private.current_user_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.active = true
  limit 1
$$;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(app_private.current_user_role() = 'admin', false)
$$;

create or replace function app_private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(app_private.current_user_role() in ('admin', 'finance', 'fulfilment'), false)
$$;

create or replace function app_private.can_read_finance()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(app_private.current_user_role() in ('admin', 'finance', 'fulfilment', 'viewer'), false)
$$;

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quotes_orders enable row level security;
alter table public.quote_order_items enable row level security;
alter table public.stock_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.follow_ups enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or app_private.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert"
on public.profiles
for insert
to authenticated
with check (app_private.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "customers_staff_select" on public.customers;
create policy "customers_staff_select"
on public.customers
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "customers_staff_insert" on public.customers;
create policy "customers_staff_insert"
on public.customers
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "customers_staff_update" on public.customers;
create policy "customers_staff_update"
on public.customers
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "customers_admin_delete" on public.customers;
create policy "customers_admin_delete"
on public.customers
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "quote_requests_staff_select" on public.quote_requests;
create policy "quote_requests_staff_select"
on public.quote_requests
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "quote_requests_staff_insert" on public.quote_requests;
create policy "quote_requests_staff_insert"
on public.quote_requests
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "quote_requests_staff_update" on public.quote_requests;
create policy "quote_requests_staff_update"
on public.quote_requests
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "quote_requests_admin_delete" on public.quote_requests;
create policy "quote_requests_admin_delete"
on public.quote_requests
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "quotes_orders_staff_select" on public.quotes_orders;
create policy "quotes_orders_staff_select"
on public.quotes_orders
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "quotes_orders_staff_insert" on public.quotes_orders;
create policy "quotes_orders_staff_insert"
on public.quotes_orders
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "quotes_orders_staff_update" on public.quotes_orders;
create policy "quotes_orders_staff_update"
on public.quotes_orders
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "quotes_orders_admin_delete" on public.quotes_orders;
create policy "quotes_orders_admin_delete"
on public.quotes_orders
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "quote_order_items_staff_select" on public.quote_order_items;
create policy "quote_order_items_staff_select"
on public.quote_order_items
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "quote_order_items_staff_insert" on public.quote_order_items;
create policy "quote_order_items_staff_insert"
on public.quote_order_items
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "quote_order_items_staff_update" on public.quote_order_items;
create policy "quote_order_items_staff_update"
on public.quote_order_items
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "quote_order_items_admin_delete" on public.quote_order_items;
create policy "quote_order_items_admin_delete"
on public.quote_order_items
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "stock_items_staff_select" on public.stock_items;
create policy "stock_items_staff_select"
on public.stock_items
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "stock_items_staff_insert" on public.stock_items;
create policy "stock_items_staff_insert"
on public.stock_items
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "stock_items_staff_update" on public.stock_items;
create policy "stock_items_staff_update"
on public.stock_items
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "stock_items_admin_delete" on public.stock_items;
create policy "stock_items_admin_delete"
on public.stock_items
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "stock_movements_staff_select" on public.stock_movements;
create policy "stock_movements_staff_select"
on public.stock_movements
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "stock_movements_staff_insert" on public.stock_movements;
create policy "stock_movements_staff_insert"
on public.stock_movements
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "stock_movements_staff_update" on public.stock_movements;
create policy "stock_movements_staff_update"
on public.stock_movements
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "stock_movements_admin_delete" on public.stock_movements;
create policy "stock_movements_admin_delete"
on public.stock_movements
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "follow_ups_staff_select" on public.follow_ups;
create policy "follow_ups_staff_select"
on public.follow_ups
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "follow_ups_staff_insert" on public.follow_ups;
create policy "follow_ups_staff_insert"
on public.follow_ups
for insert
to authenticated
with check (app_private.is_staff());

drop policy if exists "follow_ups_staff_update" on public.follow_ups;
create policy "follow_ups_staff_update"
on public.follow_ups
for update
to authenticated
using (app_private.is_staff())
with check (app_private.is_staff());

drop policy if exists "follow_ups_admin_delete" on public.follow_ups;
create policy "follow_ups_admin_delete"
on public.follow_ups
for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "audit_events_staff_select" on public.audit_events;
create policy "audit_events_staff_select"
on public.audit_events
for select
to authenticated
using (app_private.can_read_finance());

drop policy if exists "audit_events_staff_insert" on public.audit_events;
create policy "audit_events_staff_insert"
on public.audit_events
for insert
to authenticated
with check (app_private.is_staff());

-- Audit events should not be edited or deleted by the browser app.

commit;
