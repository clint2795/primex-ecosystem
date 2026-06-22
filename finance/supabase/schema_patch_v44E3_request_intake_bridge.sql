begin;

alter table public.quote_requests
add column if not exists payload jsonb not null default '{}'::jsonb;

create unique index if not exists quote_requests_request_ref_uidx
on public.quote_requests (request_ref)
where request_ref is not null;

commit;
