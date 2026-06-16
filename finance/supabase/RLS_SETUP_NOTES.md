# Finance HQ v44A Supabase Setup Notes

## Scope

v44A is a database foundation only.

- Do not wire `finance/index.html` to Supabase yet.
- Do not add anon keys, service role keys, database passwords, or real customer data to the repo.
- Do not change pricing, stock, product, message, or UI logic in the Finance HQ app.
- v44A SQL is intended for a fresh empty Supabase staging project. Run and test there before considering live data. No SQL has been run yet.

## SQL Files

- `schema_v44A.sql`: creates the Finance HQ tables, indexes, and `updated_at` triggers.
- `rls_policies_v44A.sql`: enables RLS and adds policy helpers/policies.

Run order:

1. `schema_v44A.sql`
2. Create the first admin profile manually with trusted SQL/service role access.
3. `rls_policies_v44A.sql`
4. Test RLS with non-service authenticated users before any frontend wiring. Immediately confirm authenticated users can access allowed tables and that the RLS helper functions work despite `app_private` schema usage being revoked.

## Tables Created

- `profiles`: user profile and role mapping for Supabase Auth users.
- `customers`: customer/contact record, including email, preferred contact, source, referral, and follow-up timestamps.
- `quote_requests`: incoming request/quote intake records.
- `quotes_orders`: quote/order header records, including quote status, follow-up fields, and customer reply status.
- `quote_order_items`: line items for product/manual/structure/material/postage entries.
- `stock_items`: stock catalogue and reorder thresholds.
- `stock_movements`: stock changes and order-use audit trail.
- `follow_ups`: dedicated follow-up queue linked to customer, order, or request.
- `audit_events`: append-style operational audit log.

## RLS Approach

RLS deliberately avoids policies that directly query `profiles.role` inline.

Instead, `rls_policies_v44A.sql` creates `app_private` helper functions:

- `app_private.current_user_role()`
- `app_private.is_admin()`
- `app_private.is_staff()`
- `app_private.can_read_finance()`

These are `security definer` functions with a fixed `search_path`, so policies can call the helper rather than recursively checking `profiles` from inside every policy.

Current baseline:

- No anonymous access.
- `viewer` can read finance data but cannot write.
- `finance`, `fulfilment`, and `admin` can read/write operational tables.
- Deletes are admin-only for operational tables.
- `audit_events` can be inserted/read by staff but not updated/deleted by browser users.
- Service role and SQL editor/admin operations must still be handled carefully outside browser code.
- If policy evaluation errors due to helper function or private schema permissions, pause and review the exact required grants. Do not broadly expose the private helper schema.

## Manual Setup Checklist

1. Create or select a fresh empty staging Supabase project.
2. Confirm no real customer data is being imported.
3. Open Supabase SQL editor.
4. Run `schema_v44A.sql`.
5. Create the first trusted admin auth user.
6. Insert that user's `profiles` row with role `admin` using SQL editor or service role context.
7. Run `rls_policies_v44A.sql`.
8. Create test users for `finance`, `fulfilment`, and `viewer`.
9. Verify each role can only perform expected actions, including access to allowed tables after RLS is enabled.
10. Confirm anonymous requests cannot read or write any Finance HQ tables.
11. Confirm the Finance HQ frontend still has no Supabase keys/config.
12. Only after RLS testing should v44B/v44C consider frontend config and data migration.

Example first-admin insert, using a real auth user id from Supabase Auth:

```sql
insert into public.profiles (id, display_name, role)
values ('00000000-0000-0000-0000-000000000000', 'Owner', 'admin');
```

Replace the placeholder UUID before running.

## Fresh Setup Warning

- v44A SQL is intended for a fresh empty Supabase staging project.
- `drop policy if exists` and `drop trigger if exists` are safe for fresh setup, but should not be run casually over a manually modified live project later.
- No SQL has been run yet.

## Needs Review Before Running SQL

- Confirm whether `follow_ups` should be retained in v44A or deferred to v44B. It is included now because it is small and directly supports the new customer/order follow-up fields.
- Confirm role names: `admin`, `finance`, `fulfilment`, `viewer`.
- Confirm whether `fulfilment` should be allowed to edit all operational records or only fulfilment/stock fields in a later tighter RLS pass.
- Confirm allowed values for quote status, customer reply status, request status, preferred contact, and follow-up type/status.
- Confirm whether `payload` JSON fields should remain as migration cushions for the current localStorage shape.
- Confirm whether deletes should remain admin-only or become soft-delete fields before live use.
- Confirm audit requirements before real customer data is stored.

## v44B/v44C Parking Lot

- Frontend Supabase config after RLS testing only.
- Real authentication flow and role bootstrap process.
- Field-level restrictions through RPCs or views if `fulfilment` should not edit quote/payment/customer details.
- Data migration from localStorage export into normalized tables.
- Soft-delete/archive strategy.
- More detailed address table if repeat-customer address autofill becomes important.
