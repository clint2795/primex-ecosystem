-- PrimeX v45G private commercial review store.
-- Schema-only migration. Apply through the controlled Supabase cutover after review.

begin;

create table if not exists public.commercial_authority_versions (
  authority_version text primary key,
  effective_date date not null,
  status text not null check (status in ('draft', 'current', 'superseded')),
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  constraint commercial_authority_current_status_check
    check ((is_current and status = 'current') or not is_current)
);

create unique index if not exists commercial_authority_one_current
  on public.commercial_authority_versions (is_current)
  where is_current;

create table if not exists public.commercial_product_authority (
  authority_version text not null references public.commercial_authority_versions(authority_version),
  product_code text not null,
  display_name text not null,
  strength text not null,
  supply_format text not null,
  product_kind text not null check (product_kind in ('single_vial', 'research_set')),
  catalog_section text not null check (catalog_section in ('featured', 'beyond', 'sets', 'wider')),
  display_order integer not null,
  public_price numeric(10,2) not null check (public_price > 0),
  price_mode text not null check (price_mode = 'fixed'),
  active_for_new_request boolean not null default false,
  components jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  primary key (authority_version, product_code),
  constraint commercial_product_components_array_check check (jsonb_typeof(components) = 'array')
);

alter table public.commercial_authority_versions enable row level security;
alter table public.commercial_product_authority enable row level security;
revoke all on table public.commercial_authority_versions from anon, authenticated;
revoke all on table public.commercial_product_authority from anon, authenticated;
grant select on table public.commercial_authority_versions to service_role;
grant select on table public.commercial_product_authority to service_role;

create table if not exists public.commercial_price_review_private (
  authority_version text not null references public.commercial_authority_versions(authority_version),
  product_code text not null,
  display_name text not null,
  display_order integer not null,
  public_price numeric(10,2) not null check (public_price > 0),
  existing_price numeric(10,2) not null check (existing_price > 0),
  close_price numeric(10,2) not null check (close_price > 0),
  supplier_pack_price_usd numeric(10,2),
  supplier_pack_quantity integer,
  modelled_loaded_cost_gbp numeric(10,2) not null check (modelled_loaded_cost_gbp > 0),
  cost_evidence text not null,
  composition_note text,
  packaging_status text not null,
  created_at timestamptz not null default now(),
  primary key (authority_version, product_code)
);

alter table public.commercial_price_review_private enable row level security;

revoke all on table public.commercial_price_review_private from anon, authenticated;
grant select on table public.commercial_price_review_private to authenticated;
grant all on table public.commercial_price_review_private to service_role;

drop policy if exists "active finance roles can review commercial pricing" on public.commercial_price_review_private;
create policy "active finance roles can review commercial pricing"
on public.commercial_price_review_private
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role in ('admin', 'finance')
  )
);

commit;
