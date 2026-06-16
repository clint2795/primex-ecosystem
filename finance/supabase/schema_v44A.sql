-- PrimeX Finance HQ v44A Supabase schema foundation
-- Purpose: database structure only. No frontend keys, secrets, or customer data.
-- Review before running in Supabase SQL editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'finance'
    check (role in ('admin', 'finance', 'fulfilment', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_ref text,
  name text,
  email text,
  phone text,
  preferred_contact text
    check (preferred_contact is null or preferred_contact in ('email', 'phone', 'whatsapp', 'sms', 'other')),
  source text,
  referred_by text,
  notes text,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  request_ref text,
  request_status text not null default 'new'
    check (request_status in ('new', 'reviewing', 'quoted', 'converted', 'closed', 'cancelled')),
  request_source text,
  requested_items jsonb not null default '[]'::jsonb,
  request_note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes_orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique,
  customer_id uuid references public.customers(id) on delete set null,
  request_id uuid references public.quote_requests(id) on delete set null,
  order_type text not null default 'Live order'
    check (order_type in ('Live order', 'Past order', 'Test order')),
  quote_status text not null default 'draft'
    check (quote_status in ('draft', 'sent', 'accepted', 'declined', 'expired', 'converted', 'not_required')),
  order_status text not null default 'New / awaiting payment',
  payment_status text not null default 'Awaiting payment',
  customer_reply_status text
    check (customer_reply_status is null or customer_reply_status in ('not_contacted', 'awaiting_reply', 'replied', 'no_reply_needed')),
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  follow_up_note text,
  fulfilment_method text,
  postage_service text,
  tracking_ref text,
  label_qr_ref text,
  confirmation_sent boolean not null default false,
  customer_update_sent boolean not null default false,
  subtotal numeric(12,2) not null default 0,
  materials_charge numeric(12,2) not null default 0,
  postage_charge numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  internal_notes text,
  customer_note text,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_order_items (
  id uuid primary key default gen_random_uuid(),
  quote_order_id uuid not null references public.quotes_orders(id) on delete cascade,
  product_key text,
  item_type text not null default 'product'
    check (item_type in ('product', 'structure', 'manual', 'postage', 'material')),
  title text not null,
  quantity numeric(12,3) not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  stock_key text not null unique,
  label text not null,
  unit text,
  current_quantity numeric(12,3) not null default 0,
  reorder_at numeric(12,3) not null default 0,
  target_quantity numeric(12,3) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  stock_item_id uuid references public.stock_items(id) on delete set null,
  stock_key text,
  movement_type text not null
    check (movement_type in ('receive', 'adjust', 'order_use', 'return', 'correction')),
  quantity numeric(12,3) not null,
  related_order_id uuid references public.quotes_orders(id) on delete set null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  order_id uuid references public.quotes_orders(id) on delete cascade,
  request_id uuid references public.quote_requests(id) on delete cascade,
  type text not null
    check (type in ('quote', 'payment', 'fulfilment', 'delivery', 'customer_reply', 'general')),
  status text not null default 'open'
    check (status in ('open', 'snoozed', 'completed', 'cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or order_id is not null or request_id is not null)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customers_customer_ref_idx on public.customers(customer_ref);
create index if not exists customers_next_follow_up_at_idx on public.customers(next_follow_up_at);
create index if not exists quote_requests_customer_id_idx on public.quote_requests(customer_id);
create index if not exists quotes_orders_customer_id_idx on public.quotes_orders(customer_id);
create index if not exists quotes_orders_request_id_idx on public.quotes_orders(request_id);
create index if not exists quotes_orders_order_ref_idx on public.quotes_orders(order_ref);
create index if not exists quotes_orders_next_follow_up_at_idx on public.quotes_orders(next_follow_up_at);
create index if not exists quote_order_items_quote_order_id_idx on public.quote_order_items(quote_order_id);
create index if not exists stock_movements_stock_item_id_idx on public.stock_movements(stock_item_id);
create index if not exists stock_movements_related_order_id_idx on public.stock_movements(related_order_id);
create index if not exists follow_ups_due_at_idx on public.follow_ups(due_at);
create index if not exists follow_ups_customer_id_idx on public.follow_ups(customer_id);
create index if not exists follow_ups_order_id_idx on public.follow_ups(order_id);
create index if not exists follow_ups_request_id_idx on public.follow_ups(request_id);
create index if not exists audit_events_entity_idx on public.audit_events(entity_type, entity_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists customers_touch_updated_at on public.customers;
create trigger customers_touch_updated_at
before update on public.customers
for each row execute function public.touch_updated_at();

drop trigger if exists quote_requests_touch_updated_at on public.quote_requests;
create trigger quote_requests_touch_updated_at
before update on public.quote_requests
for each row execute function public.touch_updated_at();

drop trigger if exists quotes_orders_touch_updated_at on public.quotes_orders;
create trigger quotes_orders_touch_updated_at
before update on public.quotes_orders
for each row execute function public.touch_updated_at();

drop trigger if exists quote_order_items_touch_updated_at on public.quote_order_items;
create trigger quote_order_items_touch_updated_at
before update on public.quote_order_items
for each row execute function public.touch_updated_at();

drop trigger if exists stock_items_touch_updated_at on public.stock_items;
create trigger stock_items_touch_updated_at
before update on public.stock_items
for each row execute function public.touch_updated_at();

drop trigger if exists follow_ups_touch_updated_at on public.follow_ups;
create trigger follow_ups_touch_updated_at
before update on public.follow_ups
for each row execute function public.touch_updated_at();

commit;
