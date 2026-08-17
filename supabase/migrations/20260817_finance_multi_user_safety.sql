begin;

alter table public.quotes_orders
  add column if not exists updated_by uuid references public.profiles(id) on delete set null,
  add column if not exists row_version bigint not null default 1,
  add column if not exists claimed_by uuid references public.profiles(id) on delete set null,
  add column if not exists claimed_at timestamptz,
  add column if not exists claim_expires_at timestamptz,
  add column if not exists record_class text not null default 'live',
  add column if not exists affects_stock boolean not null default true,
  add column if not exists dedupe_key text,
  add column if not exists duplicate_of uuid references public.quotes_orders(id) on delete set null,
  add column if not exists duplicate_override_reason text;

update public.quotes_orders
set
  record_class = case
    when order_type = 'Past order' then 'historical'
    when order_type = 'Test order' then 'test'
    else 'live'
  end,
  affects_stock = case when order_type = 'Live order' then true else false end
where record_class = 'live' and affects_stock = true;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'quotes_orders_record_class_check'
      and conrelid = 'public.quotes_orders'::regclass
  ) then
    alter table public.quotes_orders
      add constraint quotes_orders_record_class_check
      check (record_class in ('live', 'historical', 'test'));
  end if;
end $$;

create unique index if not exists quotes_orders_active_dedupe_key_uidx
  on public.quotes_orders(dedupe_key)
  where dedupe_key is not null
    and record_class = 'live'
    and duplicate_of is null
    and order_status <> 'Cancelled';

create index if not exists quotes_orders_claimed_by_idx
  on public.quotes_orders(claimed_by)
  where claimed_by is not null;

create index if not exists quotes_orders_updated_by_idx
  on public.quotes_orders(updated_by)
  where updated_by is not null;

create or replace function public.finance_quote_order_before_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  new.row_version := old.row_version + 1;
  return new;
end;
$$;

drop trigger if exists finance_quote_order_before_update on public.quotes_orders;
create trigger finance_quote_order_before_update
before update on public.quotes_orders
for each row execute function public.finance_quote_order_before_update();

revoke all on function public.finance_quote_order_before_update() from public, anon, authenticated;

create or replace function public.claim_quote_order(
  p_order_id uuid,
  p_lease_minutes integer default 10
)
returns table (
  id uuid,
  claimed_by uuid,
  claimed_at timestamptz,
  claim_expires_at timestamptz,
  row_version bigint
)
language plpgsql
security invoker
set search_path = public
as $$
begin
  return query
  update public.quotes_orders qo
  set
    claimed_by = auth.uid(),
    claimed_at = now(),
    claim_expires_at = now() + make_interval(mins => greatest(1, least(coalesce(p_lease_minutes, 10), 30)))
  where qo.id = p_order_id
    and (
      qo.claimed_by is null
      or qo.claim_expires_at is null
      or qo.claim_expires_at <= now()
      or qo.claimed_by = auth.uid()
    )
  returning qo.id, qo.claimed_by, qo.claimed_at, qo.claim_expires_at, qo.row_version;
end;
$$;

revoke all on function public.claim_quote_order(uuid, integer) from public, anon;
grant execute on function public.claim_quote_order(uuid, integer) to authenticated;

create or replace function public.release_quote_order_claim(p_order_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  changed integer;
begin
  update public.quotes_orders
  set claimed_by = null, claimed_at = null, claim_expires_at = null
  where id = p_order_id and claimed_by = auth.uid();
  get diagnostics changed = row_count;
  return changed > 0;
end;
$$;

revoke all on function public.release_quote_order_claim(uuid) from public, anon;
grant execute on function public.release_quote_order_claim(uuid) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'quotes_orders'
  ) then
    alter publication supabase_realtime add table public.quotes_orders;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'quote_requests'
  ) then
    alter publication supabase_realtime add table public.quote_requests;
  end if;
end $$;

commit;
